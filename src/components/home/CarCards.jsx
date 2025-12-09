import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRef } from "react";
import { Pagination, Mousewheel, Keyboard, Navigation } from "swiper/modules";
import { Badge } from "../../component/ui/badge";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { formatPrice } from "../../lib/utils";
import { htmlToText } from "html-to-text";
import { Separator } from "../../component/ui/separator";
import { Button } from "../../component/ui/button";
function truncateString(str, num) {
  const plainText = htmlToText(str || "");
  return plainText.length <= num
    ? plainText
    : plainText.substring(0, num) + "...";
}

// Helper function to calculate time left
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
      color: "#FFA500", // Orange for starting
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
      color: "#00FF00", // Green for ongoing
    };
  } else {
    // Auction has ended
    timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
      status: "reserved",
      color: "#FF0000", // Red for expired
    };
  }

  return timeLeft;
}

// Car Cards Component
function CarCards({ car }) {
  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(car?.startTime, car?.endTime)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(car?.startTime, car?.endTime));
    }, 1000);

    // Clear the timer when the component unmounts
    return () => clearInterval(timer);
  }, [car?.startTime, car?.endTime]);

  if (!car) return null; // Early return if car data is not available

  const truncatedDescription = truncateString(car?.description, 70);

  const carCurrentStatus = carStatus({
    status: car?.status,
    endTime: car?.endTime,
    startTime: car?.startTime,
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
    <div className="bg-white rounded-lg border max-w-[350px] sm:max-w-[300px] h-[410px] font-inter relative shadow-sm hover:shadow-md cursor-pointer p-2 flex flex-col items-center">
      <div className="mt-2">
        <Timer timeLeft={timeLeft} />
      </div>

      <div>
        <Badge
          className={`absolute top-0 rounded-md right-0 ${getStatusClasses(
            carCurrentStatus
          )}`}
        >
          {carCurrentStatus}
        </Badge>
      </div>

      <div className="max-w-full flex justify-center relative items-center w-full h-48">
        {car.images?.length > 1 ? (
          <Swiper
            pagination={{
              dynamicBullets: true,
            }}
            mousewheel={true}
            keyboard={true}
            // navigation={true}
            modules={[Pagination, Mousewheel, Keyboard, Navigation]}
            className="mySwiper"
            init="false"
          >
            {car.images?.map((image, index) => (
              <SwiperSlide
                key={index}
                className="flex justify-center items-center"
              >
                <img
                  src={image.fileurl}
                  alt={`car-${index}`}
                  className="h-48 w-full object-cover rounded-md"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <img
            src={car?.images[0]?.fileurl}
            alt="car"
            className="h-full w-full object-cover object-center rounded-md"
          />
        )}

       { car?.buyNow?.isBuyNow && 
        <div className="absolute top-2 left-2">
          <Badge className="bg-red-500">Buy now</Badge>
        </div>
       } 

      </div>

      <div className="flex flex-col items-center gap-2 mt-4">
        <div className="">
          <div className="text-lg font-semibold">
            {truncateString(car.name, 20)}
          </div>
          <div className="text-muted-foreground text-sm">
            {truncatedDescription}
          </div>
        </div>
        <div className=" text-base flex gap-6 font-semibold ">
          <div className="flex flex-col justify-center ">
            <div className="font-bold text-lg">
              {formatPrice(car?.highestBid || car?.price)}
            </div>
            <div className="text-muted-foreground font-normal text-xs">
              {car?.highestBid ? "highest bid" : "starting bid"}
            </div>
          </div>
          <Separator orientation="vertical" />
          <div className="flex-col justify-center ">
            <Button variant="btn" size="lg">
              Place Bid
            </Button>
            {/* <div className="font-medium text-muted-foreground">
              ({car.totalBids})
            </div>
            <div className="text-muted-foreground font-normal text-xs">
              current bid
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

// Timer Component

export const Timer = ({ timeLeft }) => {
  if (timeLeft.expired) {
    return (
      <div className="grid grid-cols-7 w-[200px]">
        <div className="flex flex-col justify-center items-center">
          <div className="text-lg font-bold">0</div>
          <div className="text-muted-foreground">days</div>
        </div>
        <div className="text-xl flex justify-center font-bold">:</div>
        <div className="flex flex-col justify-center items-center">
          <div className="text-lg font-bold">0</div>
          <div className="text-muted-foreground">hours</div>
        </div>
        <div className="text-xl flex justify-center font-bold">:</div>
        <div className="flex flex-col justify-center items-center">
          <div className="text-lg font-bold">0</div>
          <div className="text-muted-foreground">min</div>
        </div>
        <div className="text-xl flex justify-center font-bold">:</div>
        <div className="flex flex-col justify-center items-center">
          <div className="text-lg font-bold">0</div>
          <div className="text-muted-foreground">sec</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-9 w-[250px]">
      {timeLeft.status === "starting" ? (
        <>
          <div className="flex flex-col justify-center items-center">
            <div className="text-lg font-bold">{timeLeft.days}</div>
            <div className="text-muted-foreground">days</div>
          </div>
          <div className="text-xl flex justify-center font-bold">:</div>
          <div className="flex flex-col justify-center items-center">
            <div className="text-lg font-bold">{timeLeft.hours}</div>
            <div className="text-muted-foreground">hours</div>
          </div>
          <div className="text-xl flex justify-center font-bold">:</div>
          <div className="flex flex-col justify-center items-center">
            <div className="text-lg font-bold">{timeLeft.minutes}</div>
            <div className="text-muted-foreground">min</div>
          </div>
          <div className="text-xl flex justify-center font-bold">:</div>
          <div className="flex flex-col justify-center items-center">
            <div className="text-lg font-bold">{timeLeft.seconds}</div>
            <div className="text-muted-foreground">sec</div>
          </div>
          <div className="text-xs col-span-2 text-gray-800 font-bold flex justify-center items-center w-full">
            Live in
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center">
            <div className="text-lg font-bold">{timeLeft.days}</div>
            <div className="text-muted-foreground">days</div>
          </div>
          <div className="text-xl flex justify-center font-bold">:</div>
          <div className="flex flex-col justify-center items-center">
            <div className="text-lg font-bold">{timeLeft.hours}</div>
            <div className="text-muted-foreground">hours</div>
          </div>
          <div className="text-xl flex justify-center font-bold">:</div>
          <div className="flex flex-col justify-center items-center">
            <div className="text-lg font-bold">{timeLeft.minutes}</div>
            <div className="text-muted-foreground">min</div>
          </div>
          <div className="text-xl flex justify-center font-bold">:</div>
          <div className="flex flex-col justify-center items-center">
            <div className="text-lg font-bold">{timeLeft.seconds}</div>
            <div className="text-muted-foreground">sec</div>
          </div>
          <div className="text-xs col-span-2 text-gray-800 font-bold flex justify-center items-center w-full">
            Ends in
          </div>
        </>
      )}
    </div>
  );
};

// Car Status Helper Function
const carStatus = ({ status, endTime, startTime }) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Past auctions should always be Reserved
  if (status === "past" || now > end) {
    return "Reserved";
  }

  // Upcoming (start time is in the future)
  if (now < start) {
    return "Upcoming";
  }

  // Live (between start and end)
  if (status === "live" && now >= start && now <= end) {
    return "Live";
  }

  return "Unknown";
};


export default CarCards;
