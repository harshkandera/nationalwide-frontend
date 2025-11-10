import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setUser } from "../slices/profileSlice";
import MaxWidthWrapper from "../component/MaxWidthWrapper";
import Navbar from "../component/Navbar";
import { buttonVariants, Button } from "../component/ui/button";
import { Link } from "react-router-dom";
import { Icons } from "../assests/Icons";
import { FaPlay } from "react-icons/fa";
import { cn } from "../lib/utils";
import Img2 from "../assests/img2.svg";
import FoundCar from "../components/home/FoundCar";
import { IoDiamondOutline } from "react-icons/io5";
import { IoMdLock } from "react-icons/io";
import { RiHeart2Fill } from "react-icons/ri";
import BodyTypeCars from "../components/home/BodyTypeCars";
import Icon1 from "../assests/icon1.png";
import Icon2 from "../assests/icon2.png";
import Icon3 from "../assests/icon3.png";
import Footer, { FooterCard } from "../components/home/Footer";
import SEO from "../service/helmet";

export const Heading = ({ heading, name }) => {
  return (
    <div className="flex justify-center my-20 items-center">
      <div className="bg-gray-200 h-px max-w-[10%]" />

      <div className="md:text-5xl sm:text-4xl text-3xl font-semibold m-2">
        {heading} <span className="text-richblue-100">{name}</span>
      </div>
      <div className="bg-gray-200 h-px maxm-w-[10%]" />
    </div>
  );
};

const cardData = [
  {
    icon: <IoDiamondOutline />,
    name: "Wide Selection",
    description:
      " We offer a diverse selection of vehicles from trusted sellers, including dealerships, manufacturers, and private owners.",
  },
  {
    icon: <IoMdLock />,
    name: "Secure Transactions",
    description:
      "Your safety and satisfaction are our top priorities. We ensure that every transaction on our platform is secure, transparent, and straightforward.",
  },
  {
    icon: <RiHeart2Fill />,
    name: "Expert Support",
    description:
      "Our team of automotive professionals is here to support you every step of the way, whether you’re listing a vehicle for sale or placing a bid.",
  },
];

const card = [
  {
    icon: Icon2, // Placeholder for the registration icon
    title: "Registration and Account",
    description:
      "Search inventory of more than salvage used vehicles. Aliquam sagittis pellentesque turpis egestas tincidunt. Integer mollis leo lectus.",
  },
  {
    icon: Icon1, // Placeholder for the car and dollar icon
    title: "Browse and Select a Vehicle",
    description:
      "Search inventory of more than salvage used vehicles. Aliquam sagittis pellentesque turpis egestas tincidunt. Integer mollis leo lectus.",
  },
  {
    icon: Icon3, // Placeholder for the dollar and bids icon
    title: "Place Bids and Monitor",
    description:
      "Search inventory of more than salvage used vehicles. Aliquam sagittis pellentesque turpis egestas tincidunt. Integer mollis leo lectus.",
  },
];

export const ViewCard = ({ cardData }) => {
  return (
    <div className="w-[] sm:w-96 min-h-[300px] flex flex-col group p-2 justify-center items-center ">
      <div className="bg-richblue-200 h-2 rounded-t-full transition-all	ease-in-out group-hover:bg-richblue-100 w-32 p-0 m-0" />

      <div className="font-inter h-full flex flex-col justify-center  items-start border gap-6 px-6 py-2 rounded-lg  shadow">
        <div className="flex w-14 text-white text-xl h-14 justify-center items-center transition-all	ease-in-out group-hover:bg-richblue-100 bg-richblue-200  rounded-md">
          {cardData.icon}
        </div>

        <div className="text-xl font-medium ">{cardData.name}</div>

        <div className="text-muted-foreground ">{cardData.description}</div>
      </div>
    </div>
  );
};

const WorksCard = ({ card, index }) => {
  return (
    <div className="w- sm:w-[380px] min-h-[300px] flex flex-col gap-4 group p-2 justify-center items-center ">
      <div
        className={`${
          index == 1 ? "bg-[#FF2800]" : "bg-[#FFF6F6]"
        } rounded-3xl flex justify-center items-center p-4 `}
      >
        <img src={card.icon} className="w-20 h-20" alt="" />
      </div>
      <div className="font-semibold text-lg">{card.title}</div>

      <div className="text-muted-foreground text-center">
        {card.description}
      </div>
    </div>
  );
};

const Home = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.profile);

  const logouthandler = () => {
    setTimeout(() => {
      dispatch(setUser(null));
    }, 1000);

    setTimeout(() => {
      localStorage.removeItem("persist:root");
    }, 2000);
  };

  const title =
    "nationwide-motors | Premier Online Car Auction Platform for Best Deals";
  const description =
    "nationwide-motors is the leading online car auction platform where buyers and sellers connect to bid on a wide selection of vehicles. Enjoy secure, real-time auctions and find your next car at the best price. Join us to explore premium car listings from trusted sellers.";
  const keywords =
    "car auction, online car auctions, buy cars online, sell cars online, car marketplace, used car auction, luxury car auction, car bidding platform, live car auctions, best car deals, car auction site, car listings, family car auction, SUV auction, sports car auction";
  const image =
    "https://res.cloudinary.com/dgty4nzfo/image/upload/v1730487391/ProfileImages/lvzs88ic6sjaze0dnwnf.png";
  const url = "https://nationwide-motors.com";

  return (
    <>
      <SEO
        title={title}
        description={description}
        image={image}
        url={url}
        keywords={keywords}
      />

      <div className="min-h-screen max-w-screen overflow-x-hidden font-inter">
        <MaxWidthWrapper>
          <Navbar />
        </MaxWidthWrapper>

        <MaxWidthWrapper className={"flex justify-center items-center"}>
          <div className="pt-32 pb-20 font-inter text-center sm:text-start flex flex-col items-center max-w-3xl">
            <h1 className="text-5xl font-semibold mr-auto text-richblue-200 sm:text-6xl md:text-7xl">
              Your Next Car is Just a{" "}
              <span className="text-richblue-100">Bid</span> Away! Bid with
              Confidence!
            </h1>

            <p className="mt-8 text-lg max-w-prose mr-auto  text-richblue-200/80">
              Discover exclusive cars at unbeatable prices in our live auctions,
              with real-time bidding, instant updates, and a seamless
              experience.
            </p>

            <div className=" mr-auto hidden sm:flex flex-col items-center sm:flex-row gap-6 mt-8">
              <Link
                to="/browse_auctions"
                className={cn(
                  buttonVariants({ variant: "btn", size: "lg" }),
                  "drop-shadow-xl"
                )}
              >
                Get Started
                <Icons.arrow className="ml-4 h-4 w-4" />
              </Link>
              <Button
                variant="btn"
                className="drop-shadow-xl w-10 ml-4 h-10 py-0 px-0 rounded-full"
              >
                <FaPlay />
              </Button>
              <p className="text-richblue-200 font-normal font-inter">
                Watch Our Video{" "}
              </p>
            </div>

            <div className="flex flex-col sm:hidden items-center sm:flex-row gap-6 mt-8">
              <Link
                to="/product"
                className={cn(
                  buttonVariants({ variant: "btn", size: "lg" }),
                  "drop-shadow-xl"
                )}
              >
                Get Started
                <Icons.arrow className="ml-4 h-4 w-4" />
              </Link>
              <Button
                variant="btn"
                className="drop-shadow-xl w-10 h-10 py-0 px-0 rounded-full"
              >
                <FaPlay />
              </Button>
              <p className="text-richblue-200 font-normal font-inter">
                Watch Our Video
              </p>
            </div>
          </div>

          <div className=" hidden sm:block">
            <img src={Img2} className="h-[80vh]" />
          </div>
        </MaxWidthWrapper>

        <div className="w-screen ">
          <Icons.home className="w-full" />
        </div>

        <MaxWidthWrapper className="mt-10 sm:mt-30">
          <Heading heading="Find your" name="Car" />
          <FoundCar />
        </MaxWidthWrapper>

        <MaxWidthWrapper className="mt-10 sm:mt-30">
          <Heading heading="Why Choose" name="NATIONWIDE MOTORS?" />
          <div className="grid grid-cols-1  sm:grid-cols-3 gap-4">
            {cardData.map((card) => (
              <ViewCard key={card.id} cardData={card} />
            ))}
          </div>
        </MaxWidthWrapper>

        <MaxWidthWrapper className="mt-10 sm:mt-30">
          <Heading heading="Browse by" name="Body Type" />
          <BodyTypeCars />
        </MaxWidthWrapper>

        <MaxWidthWrapper className="mt-10 sm:mt-30">
          <Heading heading="How it" name="Works?" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {card.map((card, index) => (
              <WorksCard key={index} card={card} index={index} />
            ))}
          </div>
        </MaxWidthWrapper>

        <FooterCard />
        <Footer />
      </div>
    </>
  );
};

export default Home;
