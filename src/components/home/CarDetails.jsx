import React, { useState, useEffect } from "react";
import MaxWidthWrapper from "../../component/MaxWidthWrapper";
import Navbar from "../../component/Navbar";
import {
  useListingByIdQuery,
  useSaveForLaterMutation,
  useCreateBiddingMutation,
  useLazyUserBidsQuery,
  useBuyNowMutation,
} from "../../slices/apiSlices/carListingApiSlice";
import { toast } from "../../component/ui/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import WPSGallery from "../../component/WPSGallery";
import { IoMdShareAlt } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { Button } from "../../component/ui/button";
import { formatPrice } from "../../lib/utils";
import { format } from "date-fns";
import { Input } from "../../component/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../component/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from "react-share";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaTelegram } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../component/ui/dialog";
import { Separator } from "../../component/ui/separator";
import { useSelector, useDispatch } from "react-redux";
import { listenToHighestBid } from "../../slices/fireBaseSlice";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../component/ui/hover-card";
import { useFetchAndSaveUserBids } from "../../slices/listingSlice";
import { IoIosArrowBack } from "react-icons/io";
import { emitNewHighestBid } from "../../slices/socketSlice";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../component/ui/tabs";
import Footer, { FooterCard } from "../../components/home/Footer";
import { Icons } from "../../assests/Icons";
import SEO from "../../service/helmet";
import { useSocket } from "../../lib/SocketContext";

const UserImage = (image, size = "8") =>
  image ? (
    <img
      src={image}
      alt="User Avatar"
      className={`w-${size} h-${size} mr-2 rounded-full object-cover`}
    />
  ) : (
    <Icons.photo className={`w-${size} h-${size} mr-2`} />
  );

const biddingSchema = z.object({
  bidPrice: z
    .string()
    .min(1, "Bid price must be greater than 0")
    .refine((value) => parseInt(value) > 0, "Bid price must be positive"),
});

export const AuctionHistoryTable = ({ bidHistory }) => {
  // console.log(bidHistory)
  const [visibleBids, setVisibleBids] = useState(3); // Initially show 3 bids

  if (!bidHistory || bidHistory.length === 0) {
    return (
      <p className="flex justify-center items-center">
        No auction history available.
      </p>
    );
  }

  // Function to show more bids
  const showMoreBids = () => {
    setVisibleBids(visibleBids + 3);
  };

  return (
    <div className="overflow-x-auto  max-w-screen">
      <table className="min-w-full bg-[#F1F8FE] rounded-lg">
        <thead>
          <tr className="text-left">
            <th className="py-2 px-4 font-semibold font-inter border-b">
              Bids Placed
            </th>
            <th className="py-2 px-4 font-semibold font-inter border-b">
              Amount
            </th>
            <th className="py-2 px-4 font-semibold font-inter border-b">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {bidHistory.slice(0, visibleBids).map((bid, index) => (
            <tr className="font-inter font-medium text-sm" key={index}>
              <td className="py-2 px-4 text-muted-foreground border-b">
                <div className="flex items-center gap-2">
                  <div>{UserImage(bid?.user[0]?.image)}</div>
                  {/* <div>{bid?.user[0]?.email}</div> */}
                </div>
              </td>
              <td className="py-2 px-4 font-semibold border-b">
                {" "}
                {formatPrice(bid.bidAmount || 0)}
              </td>
              <td className="py-2 px-4 text-muted-foreground border-b">
                {format(new Date(bid.bidTime), "PPpp")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {visibleBids < bidHistory.length && (
        <div className="text-right mt-4">
          <Button variant="outline" onClick={showMoreBids}>
            See More
          </Button>
        </div>
      )}
    </div>
  );
};

export const ShareOptions = () => {
  const shareUrl = window.location.href;
  const title = "Check out this awesome content!";
  const [copySuccess, setCopySuccess] = useState("");

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopySuccess("Link copied to clipboard!");
        setTimeout(() => setCopySuccess(""), 2000); // Clear message after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="flex flex-col gap-4 w-full text-richblue-200 rounded-md">
      <div className="flex gap-4 items-center">
        <FacebookShareButton url={shareUrl} quote={title}>
          <FaFacebook size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl} title={title}>
          <FaTwitter size={32} round />
        </TwitterShareButton>
        <WhatsappShareButton url={shareUrl} title={title}>
          <IoLogoWhatsapp size={32} round />
        </WhatsappShareButton>
        <TelegramShareButton url={shareUrl} title={title}>
          <FaTelegram size={32} round />
        </TelegramShareButton>
      </div>

      <div className="p-4 border rounded shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Share this link</h2>
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={copyToClipboard}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Copy Link
        </button>
        {copySuccess && <p className="text-green-600 mt-2">{copySuccess}</p>}
      </div>
    </div>
  );
};

const formatDate = (dateString) => {
  if (dateString) {
    const date = new Date(dateString);
    const options = { weekday: "long", hour: "2-digit", minute: "2-digit" };
    const formattedEndTime = date.toLocaleString("en-GB", options);
    return formattedEndTime;
  } else {
    return "Invalid";
  }
};

export const Features = ({ vehicleInformation }) => {
  if (!vehicleInformation) {
    return <p>No vehicle information available.</p>;
  }

  return (
    <div className="overflow-x-auto max-w-screen">
      <table className="min-w-full bg-white">
        <thead>
          <tr className=" ">
            <th className="py-2 text-left px-4 border-b">Feature</th>
            <th className="py-2 text-right px-4 border-b">Details</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(vehicleInformation)?.map(([feature, detail]) => (
            <tr key={feature}>
              <td className="py-2 px-4 border-b text-left capitalize text-muted-foreground font-medium">
                {feature.replace("_", " ")}
              </td>
              <td className="py-2 px-4 border-b text-right capitalize font-semibold">
                {detail}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CarDetails = () => {
  const { id } = useParams();
  const { istoken, user } = useSelector((state) => state.profile) || {};
  const { data, error, isLoading, isSuccess } = useListingByIdQuery(id);
  const [saveForLater, { isLoading: loading }] = useSaveForLaterMutation();
  const [createBidding, { isLoading: bidLoading }] = useCreateBiddingMutation();
  const [buyNow, { isLoading: buyNowLoading }] = useBuyNowMutation();
  const [trigger, { data: userBidsData }] = useLazyUserBidsQuery();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [isSaved, setSaved] = useState(false);
  const { isLoading: savedLoading, error: savedError } =
    useFetchAndSaveUserBids({ userId: user?.id });
  const { savedCars, biddingHistory } = useSelector((state) => state.listing);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(data?.Listing?.startTime, data?.Listing?.endTime)
  );
  const { socket } = useSocket();

  const goBack = () => {
    navigate(-1);
  };

  const [highestBid, setHighestBid] = useState();

  // const highestBid = useSelector((state) => state.bid.highestBid);
  // useEffect(() => {

  //   if (id) {
  //     const unsubscribe = dispatch(listenToHighestBid({ carId: id }));

  //     return () => {
  //       if (unsubscribe) {
  //         unsubscribe();
  //       }
  //     };
  //   }

  // }, [id, dispatch]);

  useEffect(() => {
    if (savedCars) {
      if (Array.isArray(savedCars)) {
        const isCarSaved = savedCars.find((savedCar) => savedCar.carId === id);
        setSaved(Boolean(isCarSaved));
      }
    }
  }, [savedCars]);

  useEffect(() => {
    if (id && user?.id) {
      trigger({ carId: id, userId: user?.id }); // Manually trigger the fetch
    }
  }, [isSuccess]);

  useEffect(() => {
    if (socket) {
      socket.on("updateHighestBid", (data) => {
        setHighestBid(data);
      });
    }

    return () => {
      if (socket) {
        socket.off("updateHighestBid");
      }
    };
  }, [socket]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(
        calculateTimeLeft(data?.Listing?.startTime, data?.Listing?.endTime)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [data?.Listing?.endTime]);

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

  const form = useForm({
    resolver: zodResolver(biddingSchema),
  });

  const SaveForLaterHandler = async () => {
    try {
      if (!user || !istoken) {
        navigate("/sign-in");
      }

      const response = await saveForLater({
        userId: user?.id,
        carId: id,
      }).unwrap();

      setSaved(!isSaved);

      toast({
        title: "Saved For Later",
        status: "success",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to save for later",
        status: "error",
        variant: "destructive",
      });
    }
  };

  // ('/buy_now/:userId/:carId

  const buyNowSubmitHandler = async (getData) => {
    
    if (!user || !istoken) {
      navigate("/sign-in");
    }

    // if(!user?.isProfileCompleted){
    //   navigate("/profile");
    // }

    try {
      if (new Date(data?.Listing?.endTime) < new Date()) {
        toast({
          title: "Auction Has Ended",
          description: "Please check back later.",
          status: "warning",
          variant: "destructive",
        })
        return;
      }

      if (new Date(data?.Listing?.startTime) > new Date()) {
        toast({
          title: "Auction Has Not Started",
          description: "Please check back later.",
          status: "warning",
          variant: "destructive",
        })
        return;
      }

      const response = await buyNow({
        userId: user?.id,
        carId: id,
      }).unwrap();

      console.log("Response:", response);

      if (response?.data?.isProfileCompleted === false) {
        navigate(`/profile/${encodeURIComponent(user?.email)}`);
        toast({
          title: "Profile Incomplete",
          description: "Please complete your profile before bidding.",
          status: "warning",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Car Purchased Successfully",
        description:
          response.data?.message || "Your Car has been purchased successfully.",
        status: "success",
        duration: 3000, // Optional duration
        isClosable: true, // Optional closable option
      });

      const title = data?.Listing?.name;
      const carId = id;
      const bidAmount = getData.bidPrice;
      const image = data?.Listing?.images[0].fileurl || "";

      emitNewHighestBid(title, carId, bidAmount, image);

      dispatch(listenToHighestBid(id));

      navigate('/dashboard/auctions')

    } catch (err) {

      if (err?.data?.message) {
        toast({
          title: "Failed to Buy Now",
          description: err?.data?.message,
          status: "error",
          variant: "destructive",
        });
        form.setError("bidPrice", {
          type: "manual",
          message: err.data.message,
        });
      }
    }
  };

  const onSubmit = async (getData) => {
    if (!user || !istoken) {
      navigate("/sign-in");
    }

    // if(!user?.isProfileCompleted){
    //   navigate("/profile");
    // }

    try {
      if (new Date(data?.Listing?.endTime) < new Date()) {
        form.setError("bidPrice", {
          type: "manual",
          message: "This auction has ended. Please check back later.",
        });
        return;
      }

      if (new Date(data?.Listing?.startTime) > new Date()) {
        form.setError("bidPrice", {
          type: "manual",
          message: "This auction has not Started yet. Please check back later.",
        });
        return;
      }

      const minimumBidAmount =
        data?.Listing?.highestBid !== undefined
          ? data?.Listing?.highestBid +
            (data?.Listing?.minimumBidDifference || 0)
          : (data?.Listing?.price || 0) +
            (data?.Listing?.minimumBidDifference || 0);

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
        carId: id,
      }).unwrap();

      // Debug log for response
      console.log("Response:", response);

      if (response?.data?.isProfileCompleted === false) {
        navigate(`/profile/${encodeURIComponent(user?.email)}`);
        toast({
          title: "Profile Incomplete",
          description: "Please complete your profile before bidding.",
          status: "warning",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Bid Placed Successfully",
        description:
          response.data?.message || "Your bid was placed successfully.",
        status: "success",
        duration: 3000, // Optional duration
        isClosable: true, // Optional closable option
      });

      const title = data?.Listing?.name;
      const carId = id;
      const bidAmount = getData.bidPrice;
      const image = data?.Listing?.images[0].fileurl || "";

      emitNewHighestBid(title, carId, bidAmount, image);

      dispatch(listenToHighestBid(id));

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

  const title = data?.Listing?.name || "nationwide-motors | Car Auction";
  const description =
    data?.Listing?.description ||
    "Discover great deals on cars with nationwide-motors's car auction platform.";
  const image =
    data?.Listing?.images?.[0]?.fileurl ||
    "https://res.cloudinary.com/dgty4nzfo/image/upload/v1730487391/ProfileImages/lvzs88ic6sjaze0dnwnf.png";
  const url = `${process.env.REACT_APP_BASE_URL}/browse_auctions/car_details/${id}`;

  const keywords = [
    data?.Listing?.make || "car",
    data?.Listing?.model || "auction",
    data?.Listing?.year || "2024",
    data?.Listing?.category || "vehicles",
    "car auction",
    "buy cars online",
    "sell cars online",
    "nationwide-motors",
  ].join(", ");

  return (
    <>
      <SEO
        title={title}
        description={description}
        image={image}
        url={url}
        keywords={keywords}
      />

      <MaxWidthWrapper>
        <Navbar />
      </MaxWidthWrapper>

      <MaxWidthWrapper className="mt-20">
        <div className="p-4 relative flex items-center justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="shadow-md"
                onClick={() => setVisible(true)}
              >
                <IoMdShareAlt className="text-gray-400  text-2xl" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Share Listing On</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center items-center">
                <ShareOptions />
              </div>
            </DialogContent>
          </Dialog>

          <div>
            <Button
              variant="secondary"
              disabled={loading}
              className={`shadow-md ${
                isSaved ? "text-richblue-100" : "text-gray-400"
              }`}
              onClick={SaveForLaterHandler}
            >
              {loading ? (
                <span className="loader"></span>
              ) : (
                <>
                  <FaHeart className="text-xl mr-2" />
                  Save for later
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="text-2xl flex gap-4 items-center font-semibold  m-6 font-inter capitalize">
          <div>
            <Button
              variant="btn"
              onClick={goBack}
              className="font-bold p-0 shadow-md h-10 w-10 rounded-md"
            >
              <IoIosArrowBack className="text-lg " />
            </Button>
          </div>

          <div>{data?.Listing?.name}</div>
        </div>

        <div className="w-full max-w-screen flex-col sm:grid sm:grid-cols-9 sm:gap-6">

          <div className="col-span-6">
            <div className="w-full max-w-screen">
              <WPSGallery galleryImages={data?.Listing?.images} />
            </div>

            <div className="mt-20">
              <div className={isExpanded ? "" : "truncate-multi-line"}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: data?.Listing?.description,
                  }}
                />
              </div>

              <Button variant="link" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "Read Less" : "Read More"}
              </Button>
            </div>

            <div className="my-10 block sm:hidden font-inter">
              {/* <div className="border my-4 h-32 max-h-fit w-full  sm:sticky sm:top-16 rounded-md flex flex-col gap-4 p-6"></div> */}

              <div className=" max-h-fit w-full  sm:sticky sm:top-16 rounded-md border flex flex-col gap-4 p-6">
                <div>
                  <div className="text-2xl font-extrabold font-inter">
                    {highestBid && highestBid?.carId === id
                      ? formatPrice(highestBid?.bidAmount)
                      : formatPrice(
                          data?.Listing?.highestBid !== undefined &&
                            data?.Listing?.highestBid !== null
                            ? data?.Listing?.highestBid
                            : data?.Listing?.price || 0
                        )}
                  </div>
                  <div className="text-muted-foreground">
                    Current Bid ({data?.Listing?.totalBids} bids)
                  </div>
                </div>

                <div className="bg-gray-100 grid px-2 rounded-md items-center grid-cols-2 justify-between p-2">
                  <div>
                    <div className="text-sm font-semibold">
                      {`${timeLeft.days}d ${timeLeft.hours}hrs ${timeLeft.minutes}min`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Time Left
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold">
                      {formatDate(data?.Listing?.endTime)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Auction Ending
                    </div>
                  </div>
                </div>
                <div>
                  <div className="grid px-2 text-sm font-medium font-inter rounded-md items-center grid-cols-2 justify-between p-2">
                    <div className="text-muted-foreground">
                      Minimum Bid Amount
                    </div>
                    <div>
                      {formatPrice(
                        highestBid && highestBid?.carId === id
                          ? highestBid?.bidAmount +
                              (data?.Listing?.minimumBidDifference || 0)
                          : data?.Listing?.highestBid !== undefined
                          ? data?.Listing?.highestBid +
                            (data?.Listing?.minimumBidDifference || 0)
                          : (data?.Listing?.price || 0) +
                            (data?.Listing?.minimumBidDifference || 0)
                      )}
                    </div>
                  </div>
                  <div className="grid px-2 text-sm font-medium font-inter rounded-md items-center grid-cols-2 justify-between p-2">
                    <div className="text-muted-foreground">Starting Bid</div>
                    <div>{formatPrice(data?.Listing?.price || 0)}</div>
                  </div>
                </div>

                <div>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col gap-4 w-full font-normal text-base justify-center items-center"
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
                        disabled={
                          bidLoading ||
                          data?.Listing?.status === "past" ||
                          data?.Listing?.status === "draft"
                        }
                        variant="btn"
                        className="w-full py-2"
                        size="lg"
                      >
                        {bidLoading ? (
                          <span className="loader"></span>
                        ) : (
                          "Place Bid"
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>

                {data?.Listing?.buyNow?.isBuyNow && (
                  <Button
                    variant="secondary"
                    className="w-full py-2"
                    onClick={buyNowSubmitHandler}
                  >
                  Buy Now in  {formatPrice(data?.Listing?.buyNow?.buyNowPrice)}
                  </Button>
                )}

                <div className="z-10">
                  <HoverCard>
                    <HoverCardTrigger>
                      <Button variant="link">
                        Previous Bids Placed By You
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent align="down">
                      <div>
                        {userBidsData?.biddingHistory[0]?.bids ? (
                          userBidsData?.biddingHistory[0]?.bids?.map((bid) => {
                            return (
                              <div
                                key={bid._id}
                                className="grid px-2 text-sm font-medium font-inter rounded-md items-center grid-cols-2 justify-between p-2"
                              >
                                <div>{formatPrice(bid.bidAmount)}</div>
                                <div>{formatDate(bid.bid_time)}</div>
                              </div>
                            );
                          })
                        ) : (
                          <div>No Previous Bids</div>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            </div>

            <Separator className="w-full" />

            <div className="text-2xl p-4 font-bold font-inter">Features</div>
            <Features
              vehicleInformation={
                data?.Listing?.vehicleFeatures?.vehicleInformation
              }
            />

            <div className="my-6">
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full bg-[#F1F8FE] gap-2  h-14 grid-cols-4 shadow-none">
                  <TabsTrigger
                    className="shadow-none w-36 hidden sm:block h-12 data-[state=active]:bg-[#4ACA7D] capitalize"
                    value="account"
                  >
                    standard features
                  </TabsTrigger>

                  <TabsTrigger
                    className="shadow-none w-36 sm:hidden h-12 data-[state=active]:bg-[#4ACA7D] capitalize"
                    value="account"
                  >
                    standard
                  </TabsTrigger>

                  <TabsTrigger
                    className="shadow-none hidden sm:block w-36 h-12 data-[state=active]:bg-[#4ACA7D]  capitalize"
                    value="password"
                  >
                    technical features
                  </TabsTrigger>
                  <TabsTrigger
                    className="shadow-none  sm:hidden w-36 h-12 data-[state=active]:bg-[#4ACA7D]  capitalize"
                    value="password"
                  >
                    technical
                  </TabsTrigger>

                  <TabsTrigger
                    className="shadow-none w-28 sm:w-36 h-12 data-[state=active]:bg-[#4ACA7D]  capitalize"
                    value="damages"
                  >
                    Damages
                  </TabsTrigger>
                  <TabsTrigger
                    className="shadow-none hidden sm:block w-36 h-12 data-[state=active]:bg-[#4ACA7D]  capitalize"
                    value="history"
                  >
                    Auction History
                  </TabsTrigger>

                  <TabsTrigger
                    className="shadow-none sm:hidden  w-28 h-12 data-[state=active]:bg-[#4ACA7D]  capitalize"
                    value="history"
                  >
                    History
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                  {data?.Listing?.vehicleFeatures?.optionsFeature?.length >
                    0 && (
                    <div className=" mt-8 relative">
                      <table className="table-fixed font-inter min-w-full ">
                        <tbody>
                          {data?.Listing?.vehicleFeatures?.optionsFeature?.map(
                            (item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 capitalize text-sm font-medium ">
                                  {item.feature}
                                </td>
                                <td className="px-4 py-2 capitalize text-sm font-semibold ">
                                  {item.value}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="password">
                  {data?.Listing?.vehicleFeatures?.technicalFeature?.length >
                    0 && (
                    <div className=" mt-8 relative">
                      <table className="table-fixed font-inter min-w-full ">
                        <tbody>
                          {data?.Listing?.vehicleFeatures?.technicalFeature?.map(
                            (item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 capitalize text-sm font-medium ">
                                  {item.feature}
                                </td>
                                <td className="px-4 py-2 capitalize  text-sm font-semibold ">
                                  {item.value}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="damages">
                  {data?.Listing?.vehicleFeatures?.damages?.length > 0 && (
                    <div className=" mt-8 relative">
                      <table className="table-fixed font-inter min-w-full ">
                        <tbody>
                          {data?.Listing?.vehicleFeatures?.damages?.map(
                            (item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 capitalize text-sm font-medium ">
                                  {item.feature}
                                </td>
                                <td className="px-4 py-2 capitalize text-sm font-semibold ">
                                  {item.value}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="history">
                  <AuctionHistoryTable bidHistory={data?.SortedBids} />
                </TabsContent>
              </Tabs>
            </div>

            {/* auction history */}
            <Separator className="w-full" />
            {/* 
                        <div className='text-2xl p-4 font-bold font-inter'>
                            Auction History
                        </div>
                     */}
          </div>

          <div className="my-10 hidden sm:block font-inter col-span-3">
            <div className="max-h-fit shadow-xl  w-full  sm:sticky sm:top-16 rounded-md border flex flex-col gap-4 p-6">
              {/* <div className=" w-full rounded-md border flex flex-col gap-4 ">


              </div> */}

              <div>
                <div className="text-2xl font-extrabold font-inter">
                  {highestBid && highestBid?.carId === id
                    ? formatPrice(highestBid?.bidAmount)
                    : formatPrice(
                        data?.Listing?.highestBid !== undefined &&
                          data?.Listing?.highestBid !== null
                          ? data?.Listing?.highestBid
                          : data?.Listing?.price || 0
                      )}
                </div>
                <div className="text-muted-foreground">
                  Current Bid ({data?.Listing?.totalBids} bids)
                </div>
              </div>

              <div className="bg-gray-100 grid px-2 rounded-md items-center grid-cols-2 justify-between p-2">
                <div>
                  <div className="text-sm font-semibold">
                    {`${timeLeft.days}d ${timeLeft.hours}hrs ${timeLeft.minutes}min`}
                  </div>
                  <div className="text-xs text-muted-foreground">Time Left</div>
                </div>

                <div>
                  <div className="text-sm font-semibold">
                    {formatDate(data?.Listing?.endTime)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Auction Ending
                  </div>
                </div>
              </div>
              <div>
                <div className="grid px-2 text-sm font-medium font-inter rounded-md items-center grid-cols-2 justify-between p-2">
                  <div className="text-muted-foreground">
                    Minimum Bid Amount
                  </div>
                  <div>
                    {formatPrice(
                      highestBid && highestBid?.carId === id
                        ? highestBid?.bidAmount +
                            (data?.Listing?.minimumBidDifference || 0)
                        : data?.Listing?.highestBid !== undefined
                        ? data?.Listing?.highestBid +
                          (data?.Listing?.minimumBidDifference || 0)
                        : (data?.Listing?.price || 0) +
                          (data?.Listing?.minimumBidDifference || 0)
                    )}
                  </div>
                </div>
                <div className="grid px-2 text-sm font-medium font-inter rounded-md items-center grid-cols-2 justify-between p-2">
                  <div className="text-muted-foreground">Starting Bid</div>
                  <div>{formatPrice(data?.Listing?.price || 0)}</div>
                </div>
              </div>

              <div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 w-full font-normal text-base justify-center items-center"
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
                      disabled={
                        bidLoading ||
                        data?.Listing?.status === "past" ||
                        data?.Listing?.status === "draft"
                      }
                      variant="btn"
                      className="w-full py-2"
                      size="lg"
                    >
                      {bidLoading ? (
                        <span className="loader"></span>
                      ) : (
                        "Place Bid"
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
              {data?.Listing?.buyNow?.isBuyNow && (
                <Button
                  variant="secondary"
                  className="w-full py-2"
                  onClick={buyNowSubmitHandler}
                >
                  Buy Now in  {formatPrice(data?.Listing?.buyNow?.buyNowPrice)}
                </Button>
              )}

              <div className="z-10">
                <HoverCard>
                  <HoverCardTrigger>
                    <Button variant="link">Previous Bids Placed By You</Button>
                  </HoverCardTrigger>
                  <HoverCardContent align="down">
                    <div>
                      {userBidsData?.biddingHistory[0]?.bids ? (
                        userBidsData?.biddingHistory[0]?.bids?.map((bid) => {
                          return (
                            <div
                              key={bid._id}
                              className="grid px-2 text-sm font-medium font-inter rounded-md items-center grid-cols-2 justify-between p-2"
                            >
                              <div>{formatPrice(bid.bidAmount)}</div>
                              <div>{formatDate(bid.bid_time)}</div>
                            </div>
                          );
                        })
                      ) : (
                        <div>No Previous Bids</div>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          </div>

          
        </div>
      </MaxWidthWrapper>
      <Footer />
    </>
  );
};

export default CarDetails;
