import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../component/ui/button";
import {
  useGetUsersBidsQuery,
  useCreateBiddingMutation,
} from "../../../slices/apiSlices/carListingApiSlice";
import { formatPrice } from "../../../lib/utils";
import NoDataFound from "../../../component/NoDataFound";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { htmlToText } from "html-to-text";
import { listenToHighestBid } from "../../../slices/fireBaseSlice";
import { GoArrowUpRight } from "react-icons/go";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import Dashboard from "../Dashboard";
import { IoIosArrowBack } from "react-icons/io";
import MaxWidthWrapper from "../../../component/MaxWidthWrapper";
import { Icons } from "../../../assests/Icons";
import { Card, CardHeader, CardTitle, CardContent } from '../../../component/ui/card';
import { BiUser, BiEnvelope, BiPhone, BiBuilding } from 'react-icons/bi';
import { HiOutlineLocationMarker } from "react-icons/hi";
import PhoneInput from "react-phone-input-2";



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
      status: "starting",
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
      status: "ongoing",
    };
  } else {
    // Auction has ended
    timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
      status: "expired",
    };
  }

  return timeLeft;
}

// Format the date for display
const formatDate = (dateString) => {
  if (dateString) {
    const date = new Date(dateString);
    const options = { weekday: "long", hour: "2-digit", minute: "2-digit" };
    return date.toLocaleString("en-GB", options);
  } else {
    return "Invalid";
  }
};

// Helper function to truncate a string and convert HTML to plain text
function truncateString(str, num) {
  const plainText = htmlToText(str || ""); // Handle undefined or null descriptions
  if (plainText.length <= num) return plainText;
  return plainText.substring(0, num) + "...";
}

// Determine the status of the car based on its auction time
export function carStatus({ status, endTime, startTime }) {
  const currentTime = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (status === "live") {
    if (currentTime >= start && currentTime <= end) {
      return "Live";
    } else if (currentTime > end) {
      return "Expired";
    }
  }

  if (status === "live" && currentTime < start) {
    return "Upcoming";
  }

  if (status === "past" || currentTime > end) {
    return "Expired";
  }

  return "Unknown";
}

const User = () => {
  const { id } = useParams();
  const {
    data: userBidsData,
    error,
    isLoading,
  } = useGetUsersBidsQuery({ userId: id });

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <Dashboard>
      <div className="mb-20">
        <header className="relative bg-white ">
          <div className="flex h-10 p-2 justify-between items-center">
            <div className="ml-4 text-3xl font-bold font-inter flex lg:ml-0">
              <Link href="/">All Users</Link>
            </div>
          </div>
        </header>

        <div className="w-full h-20 mt-4 bg-richblue-100 rounded-xl  ">
          <div className="p-6 flex gap-2 items-center">
            <Button
              variant="secondary"
              onClick={goBack}
              className="font-bold p-0 text-foreground-muted h-10 w-10 rounded-md"
            >
              <IoIosArrowBack className="text-lg text-muted-foreground" />
            </Button>

            <div className="text-xl font-bold font-inter text-white">
              {userBidsData?.data?.username}
            </div>
          </div>
        </div>

        {/* <div className="max-w-full mt-4 bg-white w-96 border rounded-lg overflow-hidden">
          <div className="flex items-center p-2 ">
            <div>
              {userBidsData?.data?.image ? (
                <img
                  src={userBidsData?.data?.image}
                  alt="User Avatar"
                  className={`h-20 w-20 mr-2 rounded-md object-cover`}
                />
              ) : (
                <Icons.photo className={`h-24 w-24 mr-2`} />
              )}
            </div>

            <div className="px-6 py-2">
              <h2 className="text-start font-semibold text-gray-800">
                {userBidsData?.data?.username}
              </h2>
              <p className="text-gray-600">
                <span className="font-medium text-sm">Email: </span>
                {userBidsData?.data?.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-sm">Phone: </span>
                {userBidsData?.data?.phone}
              </p>
            </div>
          </div>
        </div> */}
        <div className="mt-6 ">
        <ProfileDataCard user={userBidsData?.data} />
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="text-center text-lg">Loading...</div>
          ) : error ? (
            <div className="text-center text-lg text-red-500">
              Error loading auctions.
            </div>
          ) : userBidsData?.data?.biddingHistory?.length > 0 ? (
            <div className="p-0 sm:p-6">
              <div className="ml-4 text-2xl font-bold font-inter flex lg:ml-0">
                User's Auctions
              </div>
              {userBidsData?.data?.biddingHistory?.map((car) => (
                <div key={car?._id} className=" p-4">
                  <Link
                    to={`/admin/all_users/${id}/${car?.bidId?.car_id?._id}`}
                  >
                    <AuctionCarCard carData={car?.bidId?.car_id} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <NoDataFound
              title="No Auction Found!"
              subtitle="User had not participated in any auctions."
            />
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default User;


export const ProfileDataCard = ({ user }) => {
  return (
    <Card className="w-full  max-w-3xl mx-auto shadow-lg">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="flex items-center gap-3">
          <BiUser className="text-richblue-100 text-2xl" />
          Profile Details
        </CardTitle>
        
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="items-center p-4">
        {user?.image && (
          <div className=" flex justify-">
            <img 
              src={user?.image} 
              alt="Profile" 
              className="w-20 h-20 rounded-full object-cover border-2 border-richblue-100"
            />
          </div>
        )}
        </div>
        <div className="grid md:grid-cols-2 gap-2">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
            
              <BiUser className="text-richblue-100 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-semibold">
                  {user?.firstname} {user?.lastname || user?.username}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <BiEnvelope className="text-richblue-100 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-semibold">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <BiPhone className="text-richblue-100 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <div className="font-semibold">
                  <PhoneInput
                    value={user?.phone}
                    disabled={true}
                    containerClass="w-full"
                    inputClass="w-full border-0 focus:outline-none focus:ring-0"
                    inputStyle={{
                      width: "100%",
                      border: "none",
                      backgroundColor: "transparent",
                      fontSize: "0.875rem",
                      fontWeight: "600"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {user?.companyName && (
              <div className="flex items-center gap-3">
                <BiBuilding className="text-richblue-100 text-xl" />
                <div>
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="font-semibold">{user?.companyName}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <div>
              <HiOutlineLocationMarker className="text-richblue-100 text-xl " />
              </div>
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="font-semibold">
                  {user?.street}, {user?.city}, {user?.state}
                </p>
                <p className="text-sm text-gray-600">
                  {user?.country} - {user?.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>
        
    
      </CardContent>
    </Card>
  );
};


export const AuctionCarCard = ({ carData }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (carData?._id) {
      const unsubscribe = dispatch(listenToHighestBid({ carId: carData?._id }));
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [carData?._id, dispatch]);

  const highestBid = useSelector((state) => state.bid.highestBid);

  const {
    images,
    name,
    description,
    highestBid: highPrice,
    price,
    totalBids,
    startTime,
    endTime,
    status,
    _id,
  } = carData || {};
  const timeLeft = calculateTimeLeft(startTime, endTime);

  return (
    <div
      key={_id}
      className="grid grid-cols-1 sm:grid-cols-9 gap-4 border-b w-full relative hover:bg-gray-50 rounded-md p-4 cursor-pointer"
    >
      {/* Image Section */}
      <div className="col-span-1 sm:col-span-3">
        <Swiper
          pagination={{
            dynamicBullets: true,
          }}
          mousewheel={true}
          keyboard={true}
          modules={[Pagination, Mousewheel, Keyboard]}
          className="mySwiper"
        >
          {images?.map((image, index) => (
            <SwiperSlide
              key={index}
              className="flex justify-center items-center"
            >
              <img
                src={image.fileurl}
                alt={`Image of ${name} ${index + 1}`}
                className="h-44 w-full object-cover rounded-md"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Details Section */}
      <div className="col-span-1 sm:col-span-6 pb-4 space-y-4 grid-rows-6 font-inter">
        <div className="row-span-1 flex items-center gap-4 text-lg sm:text-xl font-bold">
          <div>{name}</div>
        </div>

        <div className="row-span-1 text-muted-foreground text-xs sm:text-sm">
          {truncateString(description, 100)}
        </div>

        <div className="row-span-2 flex-col items-center justify-between">
          <div className="bg-gray-100 grid px-2 rounded-md gap-2 w-full items-center grid-cols-2 sm:grid-cols-4 justify-between p-2">
            <div className="flex flex-col items-center">
              <div className="text-sm font-semibold">
                {formatPrice(highestBid ? highestBid : highPrice || price)}
              </div>
              <div className="text-xs text-muted-foreground">Highest Bid</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-sm font-semibold">{totalBids || 0}</div>
              <div className="text-xs text-muted-foreground">Current Bids</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-sm font-semibold">
                {`${timeLeft.days}d ${timeLeft.hours}hrs ${timeLeft.minutes}min`}
              </div>
              <div className="text-xs text-muted-foreground">Time Left</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-sm font-semibold">{formatDate(endTime)}</div>
              <div className="text-xs text-muted-foreground">
                Auction Ending
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="absolute top-0 z-10 right-0 bg-richblue-100 text-white font-semibold flex justify-center items-center p-2 rounded-md text-xs">
        {carStatus({ status, endTime, startTime: carData?.startTime })}
      </div>
    </div>
  );
};
