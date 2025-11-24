import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../component/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetAuctionsByIdQuery,
  useDeleteBidsMutation,
} from "../../../slices/apiSlices/carListingApiSlice";
import { formatPrice } from "../../../lib/utils";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { listenToHighestBid } from "../../../slices/fireBaseSlice";
import Dashboard from "../Dashboard";
import { GoArrowUpRight } from "react-icons/go";
import { format } from "date-fns";
import Graph from "../../../component/BidsChart";
import { IoIosArrowBack } from "react-icons/io";
import MaxWidthWrapper from "../../../component/MaxWidthWrapper";
import { Icons } from "../../../assests/Icons";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";
import { Separator } from "../../../component/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../component/ui/input";
import { RxCross2 } from "react-icons/rx";
import { toast } from "../../../component/ui/use-toast";
import { apiConnector } from "../../../service/apiconnector";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../component/ui/alert-dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../component/ui/card";
import { BiUser, BiEnvelope, BiPhone, BiBuilding } from "react-icons/bi";
import { HiOutlineLocationMarker } from "react-icons/hi";

import PhoneInput from "react-phone-input-2";

// Define validation schema for Zod

const schema = z.object({
  file: z
    .any()
    .refine(
      (file) => file && file[0]?.type === "application/pdf",
      "Only PDF files are allowed"
    )
    .refine(
      (file) => file && file[0]?.size <= 5 * 1024 * 1024, // 5MB size limit
      "File size should be less than 5MB"
    ),
});
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

export const ProfileDataCard = ({ user }) => {
  if (!user) {
    return (
      <Card className="w-full max-w-3xl mx-auto ">
        <CardContent className="p-6 text-center text-gray-500">
          <div className="flex flex-col items-center justify-center space-y-2">
            <BiUser className="text-4xl text-gray-300" />
            <p className="text-xl font-semibold">No Highest Bid Available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full  max-w-3xl mx-auto shadow-lg">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="flex items-center gap-3">
          <BiUser className="text-richblue-100 text-2xl" />
          Profile Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
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
                      fontWeight: "600",
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

        {user?.image && (
          <div className="mt-6 flex justify-center">
            <img
              src={user?.image}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-richblue-100"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

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

const AuctionsCar = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetAuctionsByIdQuery(id);
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

  // useEffect(() => {
  //   console.log(data);
  // }, []);

  const fileInputRef = useRef(null);

  // React Hook Form setup with zod resolver
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Handle file submission
  const handleFileUpload = (data) => {
    const formData = new FormData();
    formData.append("invoice", data.file[0]);

    // Example API call for upload
    console.log("File uploaded:", data.file[0]);

    reset(); // Clear the input after submission
  };

  // Trigger hidden file input
  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Dashboard>
      <div className="mb-6">
        <header className="relative bg-white ">
          <div className="flex h-10 p-2 justify-between items-center">
            <div className="ml-4 text-3xl font-bold font-inter flex lg:ml-0">
              <Link href="/">All Auctions</Link>
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
              {data?.data?.name}
            </div>
          </div>
        </div>
      </div>

      <div></div>

      <div className="grid grid-cols-1 md:grid-cols-6 w-full">
        {/* Image Preview Section */}
        <div className="col-span-1 md:col-span-3">
          <div className="relative">
            <img
              src={data?.data?.images[image].fileurl}
              alt="Car image"
              className="rounded-md w-full"
            />
          </div>

          <div className="flex space-x-2 mt-4 flex-wrap">
            {data?.data?.images.slice(0, visibleImages).map((car, index) => (
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
          <div className="my-4 flex justify-between">
            {visibleImages < data?.data?.images.length && (
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
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold font-inter">
              {data?.data?.name}
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
          <div>
            <AuctionCarCard carData={data?.data} />
          </div>

          <div>
            <Features
              vehicleInformation={
                data?.data?.vehicleFeatures?.vehicleInformation
              }
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <ProfileDataCard user={data?.data?.highestBidder} />
        {/* <HighestBidderCard
          highestBidder={data?.data?.highestBidder}
          highestBid={data?.data?.highestBid}
        /> */}
        {data?.data?.status === "past" && (
          <div className="mb-6">
            <UploadInvoice
              carId={data?.data?._id}
              userId={data?.data?.highestBidder?._id}
            />
          </div>
        )}
      </div>

      <div className="mt-4">
        <Graph allUserBids={data?.data?.SortedBids} />
      </div>

      <div className="my-10">
        <AuctionHistoryTable bidHistory={data?.data?.SortedBids} />
      </div>
    </Dashboard>
  );
};

export default AuctionsCar;

export const AuctionCarCard = ({ carData }) => {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (carData?._id) {
  //     const unsubscribe = dispatch(listenToHighestBid({ carId: carData?._id }));

  //     return () => {
  //       if (unsubscribe) {
  //         unsubscribe();
  //       }
  //     };
  //   }
  // }, [carData?._id, dispatch]);

  // const highestBid = useSelector((state) => state.bid.highestBid);

  const {
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
                {formatPrice(highPrice || price)}
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

      {/* <div className='absolute top-0 z-10 right-0 bg-richblue-100 text-white font-semibold flex justify-center items-center p-2 rounded-md text-sm'>

                {carStatus({ status, endTime, startTime })}

            </div> */}
    </div>
  );
};

export const AuctionHistoryTable = ({ bidHistory }) => {
  const [visibleBids, setVisibleBids] = useState(3); // Initially show 3 bids
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for AlertDialog
  const [selectedBid, setSelectedBid] = useState(null); // Store the selected bid for withdrawal
  const navigate = useNavigate();

  const [deleteBids, { isLoading }] = useDeleteBidsMutation();

  if (!bidHistory || bidHistory.length === 0) {
    return <p>No auction history available.</p>;
  }

  // Function to show more bids
  const showMoreBids = () => {
    setVisibleBids(visibleBids + 3);
  };

  // Function to handle delete bid
  const DeleteHandler = async () => {
    if (!selectedBid) return;

    try {
      const { _id, bidAmount } = selectedBid;

      if (!_id) {
        return toast({
          title: "Bid Id not found",
          variant: "destructive",
        });
      }

      await deleteBids({ bidId: _id, bidAmount }).unwrap();

      toast({
        title: "Bid Deleted Successfully",
      });
      setIsDialogOpen(false);
    } catch (err) {
      toast({
        title: "Failed to Delete Bid",
        description:
          err.message ||
          err.data.message ||
          "An error occurred while Deleting the Bid. Please try again later.",
        variant: "destructive",
      });
      setIsDialogOpen(false);
      console.error(err);
    }
  };

  return (
    <div className="overflow-x-auto max-w-screen">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="text-left">
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Bid Amount</th>
            <th className="py-2 px-4 border-b">Bid Time</th>
            <th className="py-2 px-4 border-b">Actions</th>{" "}
            {/* Add Actions column */}
          </tr>
        </thead>
        <tbody>
          {bidHistory.slice(0, visibleBids).map((bid, index) => (
            <tr className="font-inter font-medium text-sm" key={index}>
              <td
                className="py-2 px-4 text-muted-foreground border-b cursor-pointer hover:underline"
                onClick={() => navigate(`/admin/all_users/${bid?.user[0]?.id}`)}
              >
                {bid?.user[0]?.email}
              </td>

              <td className="py-2 px-4 font-semibold border-b">
                {formatPrice(bid.bidAmount)}
              </td>
              <td className="py-2 px-4 text-muted-foreground border-b">
                {format(new Date(bid.bidTime), "PPpp")}
              </td>
              <td className="py-2 px-4 border-b">
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedBid(bid);
                        setIsDialogOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Bid</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want Delete this Bid?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={DeleteHandler} // Change this line to pass the function reference
                        className="bg-red-600 hover:bg-red-500/90 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="loader"></span>
                        ) : (
                          "Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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

const HighestBidderCard = ({ highestBidder, highestBid }) => {
  if (!highestBidder) {
    return <p>No bids placed yet.</p>;
  }

  const { username, image, email, phone } = highestBidder;

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white max-w-sm">
      <div className="flex items-center">
        {image ? (
          <img
            src={image}
            alt="User Avatar"
            className={`w-16 h-16 mr-2 rounded-full object-cover`}
          />
        ) : (
          <Icons.photo className={`w-16 h-16 mr-2`} />
        )}

        <div>
          <h2 className="text-lg font-semibold">{username}</h2>
          <p className="text-sm text-gray-600">{email}</p>
          <p className="text-sm text-gray-600">{phone}</p>
          <div className="text-base mt-2 font-semibold">
            {formatPrice(highestBid)}{" "}
            <span className="text-xs text-muted-foreground font-normal">
              (highest Bid)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FORMATS = ["application/pdf"];

const pdfUploadSchema = z.object({
  invoice: z
    .any()
    .refine(
      (files) => files?.length > 0,
      "Please upload at least one PDF file."
    )
    .refine(
      (files) =>
        files &&
        Array.from(files).every((file) => ALLOWED_FORMATS.includes(file.type)),
      "Only PDF format is allowed."
    )
    .refine(
      (files) =>
        files && Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      "Each file should be less than 5MB."
    ),
});

export const UploadInvoice = ({ carId, userId }) => {
  const inputRef = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [uploadedInvoices, setUploadedInvoices] = useState([]);
  const form = useForm({
    resolver: zodResolver(pdfUploadSchema),
  });

  const handleFileChange = (files) => {
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);

    // Create preview URLs for PDFs
    const previews = fileArray.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!carId || !userId) return;

      try {
        const response = await apiConnector(
          "GET",
          `${process.env.REACT_APP_BASE_URL}/api/v2/get_invoices/${carId}/${userId}`
        );

        if (response?.data?.invoices?.length > 0) {
          setUploadedInvoices(response?.data?.invoices);
        } else {
          return;
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast(error?.response?.data?.message || "Failed to fetch invoices.");
      }
    };

    fetchInvoices();
  }, [carId, userId]);

  const handleFileRemove = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setFilePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );

    // Reset the input field so that the same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Array.from(data.invoice).forEach((file) => {
      formData.append("invoice", file);
    });

    if (!carId || !userId) return;

    setLoading(true);

    try {
      const response = await apiConnector(
        "POST",
        `${process.env.REACT_APP_BASE_URL}/api/v2/upload_invoices/${carId}/${userId}`,
        formData
      );

      toast({
        title: "Success",
        description: "Invoices uploaded successfully.",
        status: "success",
      });
      console.log(response);
    } catch (error) {
      console.error("Error uploading invoices:", error);
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to upload invoices.",
        status: "error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-10">
      <div className="flex my-6 w-full flex-col gap-2">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full font-normal text-base items-center"
        >
          <div className="w-full flex flex-col">
            <div className="flex gap-4 justify-center items-center">
              <input
                id="file-upload"
                type="file"
                className="sr-only"
                ref={inputRef}
                hidden
                accept="application/pdf"
                onChange={(e) => {
                  handleFileChange(e.target.files);
                  form.setValue("invoice", e.target.files); // Update form field with selected files
                }}
                multiple
              />

              <div onClick={() => inputRef.current.click()}>
                <Button type="button" className="rounded-full">
                  <FaFilePdf className="mr-2" />
                  Upload Invoice
                </Button>
              </div>

              {selectedFiles.length > 0 && (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-full p-0 w-10 h-10"
                >
                  {isLoading ? (
                    <>
                      <span className="loader"></span>
                    </>
                  ) : (
                    <FaCloudUploadAlt className="text-xl" />
                  )}
                </Button>
              )}
            </div>

            {/* Display selected files with preview and remove options */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative bg-slate-100 text-sm rounded p-2 pr-10"
                >
                  <div className="flex gap-2">
                    {/* Preview PDF button */}
                    <a
                      href={filePreviews[index]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      <p>{file.name}</p>
                    </a>
                    {/* Remove file button */}
                    <div
                      className="absolute top-2 right-1  bg-indigo-500 text-white font-semibold flex justify-center items-center text-xl rounded-lg cursor-pointer"
                      onClick={() => handleFileRemove(index)}
                    >
                      <RxCross2 />
                    </div>
                  </div>
                </div>
              ))}

              {uploadedInvoices?.length > 0 &&
                uploadedInvoices?.map((invoice, index) => (
                  <div
                    key={index}
                    className="relative bg-slate-100 text-sm rounded p-2 pr-10"
                  >
                    <div className="flex gap-2">
                      <a
                        href={invoice}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        <p>Invoice {index + 1}</p>
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
