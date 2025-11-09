import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, buttonVariants } from "../../../component/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useListingByIdQuery,
  useCreateBiddingMutation,
  useUserBidsQuery,
  useWithDrawalBiddingMutation,
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
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { htmlToText } from "html-to-text";
import { toast } from "../../../component/ui/use-toast";
import { FaHeart } from "react-icons/fa";
import { listenToHighestBid } from "../../../slices/fireBaseSlice";
import AuctionTemplate from "./index";
import { GoArrowUpRight } from "react-icons/go";
import { format } from "date-fns";
import { Icons } from "../../../assests/Icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../component/ui/dialog";
// import Img13 from "../../../assests/img13.png";
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
              <td className="py-2 px-4 border-b capitalize text-muted-foreground text-sm font-medium">
                {feature.replace("_", " ")}
              </td>
              <td className="py-2 px-4 border-b text-sm font-semibold">
                {detail}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

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

const Auctions = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.profile);
  const { data, error, isLoading } = useListingByIdQuery(id);
  const { data: userBidsData } = useUserBidsQuery({
    carId: id,
    userId: user?.id,
  });
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  const [image, setImage] = useState(0);
  const [visibleImages, setVisibleImages] = useState(8);
  const showMoreImages = () => {
    setVisibleImages((prevVisibleImages) => prevVisibleImages + 8);
  };
  const showLessImages = () => {
    setVisibleImages(8);
  };

  const userBidStatus = userBidsData?.biddingHistory?.[0]?.status ?? null;

  console.log("user bid state", userBidStatus);

  // const [withDrawalBidding, { isLoading: loading, isSuccess: success }] = useWithDrawalBiddingMutation();

  // const WithDrawalHandler = async () => {

  //     try {

  //         const response = await withDrawalBidding({
  //             userId: user?.id,
  //             carId: id,
  //         }).unwrap();

  //         // console.log("Response:", response);

  //         toast({
  //             title: "Bid WithDrawal Successfully",
  //             description: response.data?.message || "you bid cancelled successfully",
  //             status: "success",
  //             duration: 3000, // Optional duration
  //             isClosable: true, // Optional closable option
  //         });

  //     } catch (err) {
  //         console.log(err)
  //         toast({
  //             title: "Error",
  //             description: err?.data?.message || "Something went wrong",
  //             variant: "destructive",
  //             duration: 3000, // Optional duration
  //             isClosable: true, // Optional closable option
  //         });

  //     }
  // }

  return (
    <AuctionTemplate>
      <div className="grid grid-cols-1 md:grid-cols-6 w-full">
        {/* Image Preview Section */}
        <div className="col-span-1 md:col-span-3">
          <div className="relative">
            <img
              src={data?.Listing?.images[image].fileurl}
              alt="Car image"
              className="rounded-md w-full"
            />
          </div>

          <div className="flex space-x-2 mt-4 flex-wrap">
            {data?.Listing?.images.slice(0, visibleImages).map((car, index) => (
              <div
                key={car._id}
                className={`cursor-pointer p-1 rounded-md ${
                  image === index ? "border-2 border-richblue-100" : ""
                }`}
                onClick={() => setImage(index)}
              >
                <img
                  src={car.fileurl}
                  alt={`car-${index}`}
                  className="h-20 w-24 object-center object-cover rounded-md"
                />
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
        <div className="col-span-1 md:col-span-3 mb-20 flex flex-col  space-y-6 p-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold font-inter">
              {data?.Listing?.name}
            </div>

            <Link to={`/browse_auctions/car_details/${id}`}>
              <Button
                variant="btn"
                className="p-0 h-10 w-10 font-bold text-2xl"
              >
                <GoArrowUpRight />
              </Button>
            </Link>
          </div>

          {userBidStatus === "winner" && (
            <div className="flex flex-col w-full justify-between text-center items-center">
              <Dialog>
                {/* Main congratulatory modal */}
                <div className="w-full border border-richblue-100  bg-white flex flex-col justify-center items-center pb-6 shadow-md rounded-xl">
                  {/* Congrats image */}
                  {/* <div>
                    <img src={Img13} alt="congrats" className="w-60" />
                  </div> */}

                  {/* Congratulations Text */}
                  <div className="text-2xl mt-4 font-bold text-richblue-100">
                    Congratulations
                  </div>
                  <div className="text-muted-foreground">
                    You have won the auction!
                  </div>

                  {/* Button to check invoice, which triggers dialog */}
                  <div>
                    <DialogTrigger asChild>
                      <Button variant="btn" className="rounded-full mt-4">
                        Check Invoice
                      </Button>
                    </DialogTrigger>
                  </div>
                </div>

                {/* Dialog content for downloading invoices */}
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Download Your Invoice</DialogTitle>

                    {/* Conditionally render invoices if they exist */}
                    <div>
                      {userBidsData?.biddingHistory?.[0]?.invoices?.length >
                      0 ? (
                        userBidsData.biddingHistory[0].invoices.map(
                          (invoice, index) => (
                            <div key={invoice}>
                              <a
                                href={invoice}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button variant="link">
                                  Invoice {index + 1}
                                </Button>
                              </a>
                            </div>
                          )
                        )
                      ) : (
                        <div>
                          No invoices available yet. Please check later.
                        </div>
                      )}
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          )}

          <div>
            <Features
              vehicleInformation={
                data?.Listing?.vehicleFeatures?.vehicleInformation
              }
            />
          </div>

          <div>
            <AuctionCarCard
              carData={data?.Listing}
              userBidStatus={userBidStatus}
            />
          </div>

          {/* User Bidding History in Table */}
          <div className="mt-4">
            <h3 className="text-sm text-muted-foreground font-semibold">
              Bidding History
            </h3>
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
                      <td className="p-2 text-sm font-bold text-center">
                        {formatPrice(bid.bidAmount)}
                      </td>
                      <td className="p-2 text-sm text-muted-foreground font-medium text-center">
                        {format(new Date(bid.bid_time), "PPpp")}
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
    </AuctionTemplate>
  );
};

export default Auctions;

export const AuctionCarCard = ({ carData, userBidStatus }) => {
  console.log(carData);

  const form = useForm({
    resolver: zodResolver(biddingSchema),
  });

  const { user } = useSelector((state) => state.profile);

  const dispatch = useDispatch();

  const [
    createBidding,
    { isLoading: bidLoading, isSuccess: bidSuccess, isError: bidError },
  ] = useCreateBiddingMutation();

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
    console.log(carData?._id);

    try {
      if (new Date(carData?.endTime) < new Date()) {
        form.setError("bidPrice", {
          type: "manual",
          message: "This auction has ended. Please check back later.",
        });
        return;
      }

      if (new Date(carData?.startTime) > new Date()) {
        form.setError("bidPrice", {
          type: "manual",
          message: "This auction has not Started yet. Please check back later.",
        });
        return;
      }

      const minimumBidAmount =
        carData?.highestBid !== undefined
          ? carData?.highestBid + (carData?.minimumBidDifference || 0)
          : (carData?.price || 0) + (carData?.minimumBidDifference || 0);

      if (getData.bidPrice < minimumBidAmount) {
        form.setError("bidPrice", {
          type: "manual",
          message: `Bid price must be at least ${formatPrice(
            minimumBidAmount
          )}`,
        });
        return;
      }

      const response = await createBidding({
        bidAmount: getData.bidPrice,
        userId: user?.id,
        carId: carData?._id,
      }).unwrap();

      // console.log("Response:", response);

      toast({
        title: "Bid Placed Successfully",
        description:
          response.data?.message || "Your bid was placed successfully.",
        status: "success",
        duration: 3000, // Optional duration
        isClosable: true, // Optional closable option
      });

      dispatch(listenToHighestBid(carData?._id));

      form.reset();
    } catch (err) {
      form.reset();

      if (err?.data?.message) {
        form.setError("bidPrice", {
          type: "manual",
          message: err.data.message,
        });
      }
    }
  };

  const {
    images,
    name,
    description,
    highestBid: highPrice,
    price,
    startTime,
    totalBids,
    endTime,
    status,
    _id,
  } = carData || {};

  const timeLeft = calculateTimeLeft(startTime, endTime);

  return (
    <div key={_id} className="gap-4 w-full mt-4 relative cursor-pointer">
      <div className=" pb-4 space-y-6 grid-rows-6 font-inter">
        <div className=" flex items-center justify-between">
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

        <div className="flex items-center justify-between">
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
                        className="outline-none h-12 p-2 focus:outline-none border focus:border-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                onClick={(event) => {
                  event.stopPropagation();
                }}
                disabled={
                  bidLoading ||
                  userBidStatus === "completed" ||
                  userBidStatus === "cancelled" ||
                  userBidStatus === "winner" ||
                  status === "past" ||
                  status === "draft"
                }
                variant="btn"
                className="w-36 h-12 py-2"
                size="lg"
              >
                {bidLoading ? <span className="loader"></span> : "Place Bid"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* <div className='absolute top-0 z-10 right-0 bg-richblue-100 text-white font-semibold flex justify-center items-center p-2 rounded-md text-sm'>

                {carStatus({ status, endTime, startTime })}

            </div> */}
    </div>
  );
};

{
  /* <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant='destructive' disabled={ loading || userBidStatus === 'cancelled'} size='sm'>
                                   {userBidStatus === 'cancelled' ? 'Already withdrawn' : 'Withdrawal'}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Withdrawal you Bid</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to withdraw your Bid ?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={WithDrawalHandler} className={buttonVariants({ variant: 'destructive' })}>
                                        Confirm
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog> */
}
