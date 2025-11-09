import React from 'react';
import Dashboard from './Dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../component/ui/button';
import MaxWidthWrapper from '../../component/MaxWidthWrapper';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { useFetchAndSaveUserBids } from '../../slices/listingSlice';
import { useGetUsersBidsQuery } from '../../slices/apiSlices/carListingApiSlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import { Badge } from '../../component/ui/badge';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { formatPrice } from '../../lib/utils';
import { useSaveForLaterMutation } from "../../slices/apiSlices/carListingApiSlice";
import { htmlToText } from 'html-to-text';
import { toast } from '../../component/ui/use-toast';
import { FaHeart } from "react-icons/fa";
import { listenToHighestBid } from '../../slices/fireBaseSlice';
import NoDataFound from '../../component/NoDataFound';


function calculateTimeLeft(startTime, endTime) {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    let timeLeft = {};

    if (now < start) {
        // Auction has not started yet
        const difference = start - now;
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            expired: false,
            status: 'starting',
        };
    } else if (now < end) {
        // Auction is ongoing
        const difference = end - now;
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            expired: false,
            status: 'ongoing',
        };
    } else {
        // Auction has ended
        timeLeft = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            expired: true,
            status: 'expired',
        };
    }

    return timeLeft;
}


// Format the date for display
const formatDate = (dateString) => {
    if (dateString) {
        const date = new Date(dateString);
        const options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleString('en-GB', options);
    } else {
        return "Invalid";
    }
};

// Helper function to truncate a string and convert HTML to plain text
function truncateString(str, num) {
    const plainText = htmlToText(str || "");  // Handle undefined or null descriptions
    if (plainText.length <= num) return plainText;
    return plainText.substring(0, num) + '...';
}

// Determine the status of the car based on its auction time
export function carStatus({ status, endTime, startTime }) {
    const currentTime = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (status === 'live') {
        if (currentTime >= start && currentTime <= end) {
            return 'Live';
        } else if (currentTime > end) {
            return 'Expired';
        }
    }

    if (status === 'live' && currentTime < start) {
        return 'Upcoming';
    }

    if (status === 'past' || currentTime > end) {
        return 'Expired';
    }

    return 'Unknown';
}



// Component to display individual cars in the cart
export const CartCarCard = ({ carData, SaveForLaterHandler, loading }) => {
    return (
        <div key={carData._id} className='grid grid-cols-1 sm:grid-cols-8 w-full relative hover:bg-gray-50 rounded-md p-2 cursor-pointer'>
            {/* Image Section */}
            <div className='col-span-1 sm:col-span-2'>
                <Swiper
                     pagination={{
                        dynamicBullets: true,
                      }}
                    mousewheel={true}
                    keyboard={true}
                    modules={[Pagination, Mousewheel, Keyboard]}
                    className="mySwiper"
                >
                    {carData?.images?.map((image, index) => (
                        <SwiperSlide key={index} className="flex justify-center items-center">
                            <img
                                src={image.fileurl}
                                alt={`car-${index}`}
                                className="h-36 sm:h-44 w-full object-cover rounded-md"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className='col-span-1 sm:col-span-6 sm:p-6 p-4 space-y-4 font-inter'>
                <div className='text-lg sm:text-xl font-bold'>
                    {carData?.name}
                </div>
                <div className='text-muted-foreground text-xs sm:text-sm'>
                    {truncateString(carData?.description, 100)}
                </div>
                <div className='flex flex-col sm:flex-row items-center sm:justify-between space-y-2 sm:space-y-0'>


                    <div className='hidden sm:flex items-center justify-center p-2 bg-gray-100 text-indigo-500 font-semibold rounded-md'>
                        {formatPrice(carData?.highestBid ? carData?.highestBid : carData?.price)}
                    </div>


                    <div className='bg-gray-100 grid px-2 rounded-md gap-2 items-center grid-cols-2 justify-between p-2'>
                        <div>
                            <div className='text-sm font-semibold'>
                                {`${calculateTimeLeft(carData?.endTime).days}d ${calculateTimeLeft(carData?.endTime).hours}hrs ${calculateTimeLeft(carData?.endTime).minutes}min`}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                                Time Left
                            </div>
                        </div>
                        <div>
                            <div className='text-sm font-semibold'>
                                {formatDate(carData?.endTime)}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                                Auction Ending
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center items-center gap-2'>

                    <div className=' flex sm:hidden mt-2 items-center justify-center p-2 bg-gray-100 text-indigo-500 font-semibold rounded-md'>
                        {formatPrice(carData?.highestBid ? carData?.highestBid : carData?.price)}
                    </div>

                    <div className='sm:mt-0 mt-2'>
                        <Link to={`/browse_auctions/car_details/${carData?._id}`}>
                            <Button variant='btn' className='h-10 w-24 sm:h-12 sm:w-28'>Place Bid</Button>
                        </Link>
                    </div>

                    </div>
              
                </div>
            </div>

            {/* Car Status Badge */}
            <div className='absolute top-0 z-10 left-0 bg-richblue-100 text-white font-semibold flex justify-center items-center p-2 rounded-md text-xs sm:text-sm'>
                {carStatus({ status: carData?.status, endTime: carData?.endTime, startTime: carData?.startTime })}
            </div>

            {/* Save for Later Button */}
            <div className='absolute top-0 z-10 right-0'>
                <Button
                    variant='secondary'
                    disabled={loading}
                    className='text-richblue-100 bg-transparent hover:bg-transparent'
                    onClick={() => SaveForLaterHandler(carData?._id)}
                >
                    {loading ? <span className="loader"></span> : <FaHeart className='text-lg sm:text-xl mr-2' />}
                </Button>
            </div>
        </div>
    );
};



// Main Saved Component
const Saved = () => {
    const { user } = useSelector((state) => state.profile);
    const { isLoading: savedLoading, error: savedError } = useFetchAndSaveUserBids({ userId: user?.id });
    const { savedCars } = useSelector((state) => state.listing);

    const { data:userBidsData , error, isLoading } = useGetUsersBidsQuery({ userId: user?.id });

    const [saveForLater, { isLoading: loading, isSuccess, isError }] = useSaveForLaterMutation();

    const navigate = useNavigate();
    const goBack = () => { navigate(-1); };

    const SaveForLaterHandler = async (id) => {
        try {
            const response = await saveForLater({ userId: user?.id, carId: id });
            toast({
                title: response.data.message,
                status: "success",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to save for later",
                status: "error",
                variant: "destructive",
            });
        }
    };

    return (
        <Dashboard>
            <header className="relative">
                <div className="flex h-16 p-2 justify-between items-center">
                    <div className="ml-4 text-3xl font-inter font-bold flex lg:ml-0">
                        Saved
                    </div>
                </div>
            </header>

            <div className='w-full h-20 mt-4 bg-richblue-100 rounded-xl'>
                <div className='p-6 flex gap-2 items-center'>
                    <Button variant='secondary' onClick={goBack} className='font-bold p-0 text-foreground-muted h-10 w-10 rounded-md'>
                        <IoIosArrowBack className='text-lg text-muted-foreground' />
                    </Button>

                    <div className='text-lg md:text-xl font-bold font-inter text-white'>
                        See your Saved Cars here!
                    </div>
                </div>
            </div>

            <div className='p-0 sm:p-6'>

                { userBidsData?.data?.cart?.length > 0 ? userBidsData?.data?.cart?.map((car) => (
                    <div key={car._id} className='border-b p-4'>
                        <CartCarCard carData={car?.carId} SaveForLaterHandler={SaveForLaterHandler} loading={loading} />
                    </div>
                )):(
                    <NoDataFound title='No Saved Auction!' subtitle='Please try After Save any car.' />
                ) }

            </div>


        </Dashboard>
    );
};

export default Saved;
