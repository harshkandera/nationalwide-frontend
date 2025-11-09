import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button} from '../../../component/ui/button';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useListingByIdQuery, useUserBidsQuery } from '../../../slices/apiSlices/carListingApiSlice';
import { formatPrice } from '../../../lib/utils';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { listenToHighestBid } from '../../../slices/fireBaseSlice';
import Dashboard from '../Dashboard'
import { GoArrowUpRight } from "react-icons/go";
import { format } from 'date-fns';
import Graph from '../../../component/BidsChart'
import { IoIosArrowBack } from "react-icons/io";
import MaxWidthWrapper from "../../../component/MaxWidthWrapper";



export const Features = ({ vehicleInformation }) => {

    if (!vehicleInformation) {
        return <p>No vehicle information available.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">

                <tbody>
                    {Object.entries(vehicleInformation)?.map(([feature, detail]) => (
                        <tr key={feature}>
                            <td className="py-2 px-4 border-b capitalize text-muted-foreground text-sm font-medium">{feature.replace('_', ' ')}</td>
                            <td className="py-2 px-4 border-b text-sm font-semibold">{detail}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}




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

const UserBids = () => {
    const { id, carId } = useParams();
    const { data, error, isLoading } = useListingByIdQuery(carId);
    const { data: userBidsData } = useUserBidsQuery({ carId: carId, userId: id });
    const navigate = useNavigate();
    const goBack = () => { navigate(-1); };
    const [image, setImage] = useState(0)
    const [visibleImages, setVisibleImages] = useState(8);
    const showMoreImages = () => {
        setVisibleImages((prevVisibleImages) => prevVisibleImages + 8);
    };
    const showLessImages = () => {
        setVisibleImages(8);
    };

    const userBidStatus = userBidsData?.biddingHistory?.[0]?.status ?? null;

    console.log("user bid state", userBidStatus)


    return (

        < Dashboard>


                <div className='mb-6'>
                    <header className="relative bg-white ">
                        <div className="flex h-10 p-2 justify-between items-center">
                            <div className="ml-4 text-3xl font-bold font-inter flex lg:ml-0">
                                <Link href="/">
                                    All Users
                                </Link>
                            </div>
                        </div>
                    </header>


                    <div className='w-full h-20 mt-4 bg-richblue-100 rounded-xl  '>
                        <div className='p-6 flex gap-2 items-center'>
                            <Button variant='secondary' onClick={goBack} className='font-bold p-0 text-foreground-muted h-10 w-10 rounded-md'><IoIosArrowBack className='text-lg text-muted-foreground' /></Button>

                            <div className='text-xl font-bold font-inter text-white'>
                                {data?.Listing?.name}
                            </div>

                        </div>
                    </div>
                </div>

                <div>


                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 w-full">

                    {/* Image Preview Section */}
                    <div className="col-span-1 md:col-span-3">
                        <div className='relative'>
                            <img src={data?.Listing?.images[image].fileurl} alt="Car image" className="rounded-md w-full" />
                        </div>
                        <div className="flex space-x-2 mt-4 flex-wrap">
                        {data?.Listing?.images.slice(0, visibleImages).map((car, index) => (
                            <div
                                key={car._id}
                                className={`cursor-pointer p-1 rounded-md ${image === index ? "border-2 border-richblue-100" : ""}`}
                                onClick={() => setImage(index)}
                            >
                                <img src={car.fileurl} alt={`car-${index}`} className="h-20 w-24 object-center object-cover rounded-md" />
                            </div>
                        ))}
                    </div>

                    {/* Show More/Show Less Buttons */}
                    <div className="mt-4 flex justify-between">
                        {visibleImages < data?.Listing?.images.length && (
                            <Button onClick={showMoreImages} variant="secondary">
                                Show More
                            </Button>
                        )}

                        {visibleImages > 8 && (
                            <Button onClick={showLessImages} variant="secondary">
                                Show Less
                            </Button>
                        )}
                    </div>

                    </div>

                    {/* Details Section */}
                    <div className="col-span-1 md:col-span-3 flex flex-col space-y-6 p-4">

                        <div className='flex justify-between items-center'>
                            <div className='text-2xl font-bold font-inter'>
                                {data?.Listing?.name}
                            </div>

                            <Link to={`/browse_auctions/car_details/${carId}}`}>
                                <Button variant='btn' className='p-0 h-10 w-10 font-bold text-2xl'>
                                    <GoArrowUpRight />
                                </Button>
                            </Link>
                        </div>
                        <div>
                            <AuctionCarCard carData={data?.Listing} userBidStatus={userBidStatus} />
                        </div>

                        <div>
                            <Graph userBids={userBidsData?.biddingHistory[0]?.bids} allUserBids={data?.SortedBids} />

                            {/* <Features vehicleInformation={data?.Listing?.vehicleFeatures?.vehicleInformation} /> */}
                        </div>


                        {/* User Bidding History in Table */}
                        <div className="mt-4 pb-20">
                            <h3 className="text-sm text-muted-foreground font-semibold">Bidding History</h3>
                            {userBidsData?.biddingHistory[0]?.bids?.length > 0 ? (
                                <table className="table-auto w-full font-inter mt-4">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="p-2 text-sm font-semibold">Bid Amount</th>
                                            <th className="p-2 text-sm font-semibold">Bid Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userBidsData.biddingHistory[0].bids.map((bid) => (
                                            <tr key={bid._id} className="border-b">
                                                <td className="p-2 text-sm font-bold text-center">{formatPrice(bid.bidAmount)}</td>
                                                <td className="p-2 text-sm text-muted-foreground font-medium text-center">
                                                    {format(new Date(bid.bid_time), 'PPpp')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div>No Previous Bids</div>
                            )}
                        </div>
                    </div>
                </div>

        </ Dashboard>
    )
}

export default UserBids;



export const AuctionCarCard = ({ carData, userBidStatus }) => {


    const dispatch = useDispatch()




    useEffect(() => {
        if (carData?._id) {
            const unsubscribe = dispatch(listenToHighestBid({ carId: carData?._id }));

            return () => {
                if (unsubscribe) {
                    unsubscribe(); // Clean up listener on component unmount
                }
            };
        }
    }, [carData?._id, dispatch]);


    const highestBid = useSelector((state) => state.bid.highestBid);





    const {  highestBid: highPrice, price, startTime, totalBids, endTime, status, _id } = carData || {};

    const timeLeft = calculateTimeLeft(startTime, endTime);

    return (
        <div key={_id} className='gap-4 w-full mt-4 relative cursor-pointer'>

            <div className=' pb-4 space-y-6 grid-rows-6 font-inter'>

                <div className=' flex items-center justify-between'>
                    <div className='bg-gray-100 grid px-2 rounded-md gap-2 w-full items-center grid-cols-2 sm:grid-cols-4 justify-between p-2'>
                        <div className='flex flex-col items-center'>
                            <div className='text-sm font-semibold'>
                                {formatPrice(highestBid ? highestBid : (highPrice || price))}
                            </div>
                            <div className='text-xs text-muted-foreground'>Highest Bid</div>
                        </div>
                        <div className='flex flex-col items-center'>
                            <div className='text-sm font-semibold'>{totalBids || 0}</div>
                            <div className='text-xs text-muted-foreground'>Current Bids</div>
                        </div>
                        <div className='flex flex-col items-center'>
                            <div className='text-sm font-semibold'>
                                {`${timeLeft.days}d ${timeLeft.hours}hrs ${timeLeft.minutes}min`}
                            </div>
                            <div className='text-xs text-muted-foreground'>Time Left</div>
                        </div>
                        <div className='flex flex-col items-center'>
                            <div className='text-sm font-semibold'>{formatDate(endTime)}</div>
                            <div className='text-xs text-muted-foreground'>Auction Ending</div>
                        </div>
                    </div>
                </div>

            </div>

            {/* <div className='absolute top-0 z-10 right-0 bg-richblue-100 text-white font-semibold flex justify-center items-center p-2 rounded-md text-sm'>

                {carStatus({ status, endTime, startTime })}

            </div> */}

        </div>
    );
};

