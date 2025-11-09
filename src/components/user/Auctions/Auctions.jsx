import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../component/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetUsersBidsQuery,
  useCreateBiddingMutation,
} from "../../../slices/apiSlices/carListingApiSlice";
import { formatPrice } from "../../../lib/utils";
import { Input } from "../../../component/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../component/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import NoDataFound from "../../../component/NoDataFound";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { htmlToText } from "html-to-text";
import { toast } from "../../../component/ui/use-toast";
import { FaHeart } from "react-icons/fa";
import { listenToHighestBid } from "../../../slices/fireBaseSlice";
import AuctionTemplate from "./index";
import { GoArrowUpRight } from "react-icons/go";

const biddingSchema = z.object({
  bidPrice: z
    .string()
    .min(1, "Bid price must be greater than 0")
    .refine((value) => parseInt(value) > 0, "Bid price must be positive"),
});

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
export const carStatus = ({ status, endTime, startTime }) => {
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
  };
  
  

const Auctions = () => {
  const { user } = useSelector((state) => state.profile);
  const {
    data: userBidsData,
    error,
    isLoading,
  } = useGetUsersBidsQuery({ userId: user?.id });

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <AuctionTemplate>
      <div>
        <div className="mt-6">
          {isLoading ? (
            <div className="text-center text-lg">Loading...</div>
          ) : error ? (
            <div className="text-center text-lg text-red-500">
              Error loading auctions.
            </div>
          ) : userBidsData?.data?.biddingHistory?.length > 0 ? (
            <div className="p-0 sm:p-6">
              {userBidsData?.data?.biddingHistory?.map((car) => (
                <div key={car?._id} className=" p-4">
                  <AuctionCarCard carData={car?.bidId?.car_id} />
                </div>
              ))}
            </div>
          ) : (
            <NoDataFound
              title="No Auction Found!"
              subtitle="Please try bidding on any car."
            />
          )}
        </div>
      </div>
    </AuctionTemplate>
  );
};

export default Auctions;

export const AuctionCarCard = ({ carData }) => {
  const form = useForm({
    resolver: zodResolver(biddingSchema),
  });
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const [createBidding, { isLoading: bidLoading }] = useCreateBiddingMutation();

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
  const onSubmit = async (getData) => {
    // Validation logic remains unchanged
    // ...
  };

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
 
  const carCurrentStatus = carStatus({
    status:status,
    endTime:endTime,
    startTime:startTime,
  });

  const getStatusClasses = (status) => {
    switch (status) {
      case "Live":
        return "bg-green-500"; // Green background and border
      case "Expired":
        return "bg-red-500 "; // Red background and border
      case "Upcoming":
        return "bg-yellow-400 "; // Yellow background and border
      default:
        return "bg-gray-500"; // Grey background and border
    }
  };


  return (
    <div
      key={_id}
      className="grid grid-cols-1 sm:grid-cols-9 gap-4 border w-full relative hover:bg-gray-50 rounded-md p-4 cursor-pointer"
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
                className="h-64 w-full object-cover rounded-md"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Details Section */}
      <div className="col-span-1 sm:col-span-6 pb-4 space-y-4 grid-rows-6 font-inter">
        <div className="row-span-1 flex items-center gap-4 text-lg sm:text-xl font-bold">
          <div>{name}</div>
          <Link to={`/dashboard/auctions/${_id}`}>
            <Button variant="btn" className="p-0 h-8 w-8 font-bold text-xl">
              <GoArrowUpRight />
            </Button>
          </Link>
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

        <div className="row-span-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex gap-4 w-full font-normal text-base justify-center items-center"
            >
              <FormField
                name="bidPrice"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col gap-2 justify-center items-center">
                    <FormControl>
                      <Input
                        id="bidPrice"
                        type="number"
                        placeholder="Enter your bid"
                        {...field}
                        className="outline-none h-12 focus:outline-none border focus:border-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={bidLoading || status === "past" || status === "draft"}
                variant="btn"
                className="w-28 h-12 py-2 "
              >
                {bidLoading ? <span className="loader"></span> : "Place Bid"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Status Badge */}
            <div className={`absolute top-0 z-10 right-0  text-white font-semibold flex justify-center items-center p-2 rounded-md text-xs ${getStatusClasses(carCurrentStatus)}`}>
          {carCurrentStatus}
      </div>
    </div>
  );
};
