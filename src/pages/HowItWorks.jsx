import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../component/ui/card';
import { DollarSign, Trophy, FileText, Building } from 'lucide-react';
import Footer, { FooterCard } from '../components/home/Footer';
import SEO  from '../service/helmet';
import MaxWidthWrapper from '../component/MaxWidthWrapper';
import Navbar from '../component/Navbar'
import { FaRegUserCircle } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

import { FiSearch } from "react-icons/fi";


const AuctionSteps = () => {

    const title = "About nationwide-motors | Trusted Online Car Auction Platform";
    const description = "Learn more about nationwide-motors, the trusted platform for car auctions. Discover our mission to provide a secure, reliable, and user-friendly space for buying and selling cars through online auctions.";
    const image = "https://res.cloudinary.com/dgty4nzfo/image/upload/v1730489311/ProfileImages/s4hqfwoc2dxtf6sw6ftq.png";
    const url = "https://nationwide-motors.com/about_us";
    const keywords = "about nationwide-motors, car auction platform, online car marketplace, trusted car auctions, buy cars online, sell cars online, secure car auctions, vehicle auction service, reliable car auctions, car auction mission, nationwide-motors values, online car sales, automotive auction platform";
  


  const steps = [
    {
      number: 1,
      title: "REGISTER",
      description: "Complete the registration form on the website to create an account within My Account section.",
      icon: <FaRegUserCircle className="h-10 w-10 text-blue-500" />
    },
    {
      number: 2,
      title: "SEARCH VEHICLES",
      description: "Use your computer, mobile, or tablet to browse and find the vehicles you want to purchase in the auction. Detailed descriptions of all auctioned vehicles are provided. We recommend using a desktop PC for best viewing experience.",
      icon: <IoSearch className="h-10 w-10 text-green-500" />
    },
    {
      number: 3,
      title: "BID",
      description: "Please bid only on the desired vehicle. For new customers, we typically limit the sale to one car to allow you to become familiar with how our website operates. If you place bids on multiple items in quick succession, our system will automatically delete your bids. Repeated offenses may result in the suspension of your account. Place a single bid, and if you are outbid, you will receive a notification via email. Please do not place a bid if you do not intend to purchase the vehicle.",
      icon: <DollarSign className="h-10 w-10 text-amber-500" />
    },
    {
      number: 4,
      title: "WIN THE AUCTION",
      description: "If you have the highest bid, and the seller approves it, you are the winner. Each bid in an auction is a legal commitment to proceed with the purchase. Bid carefully and avoid bidding on multiple items simultaneously.",
      icon: <Trophy className="h-10 w-10 text-yellow-500" />
    },
    {
      number: 5,
      title: "PURCHASE AND SALE AGREEMENT",
      description: "After winning an auction, provide a copy of your ID or Passport to complete the Purchase and Sale Contract. We will get in touch with you once the auction ends in order to povide you with a Sale Contract and your signature will be required. Upon receiving the signed contract, the invoice will be issued.",
      icon: <FileText className="h-10 w-10 text-orange-500" />
    },
    {
      number: 6,
      title: "WIRE TRANSFER – PAY THE BILL",
      description: "Within 24 hours of winning the auction, you are required to finish the payment by Wire Transfer using the issued Invoice and a proof of payment must be sent to us.",
      icon: <Building className="h-10 w-10 text-purple-500" />
    }
  ];

  return (
    <>

    <SEO 
        title={title}
        description={description}
        image={image}
        url={url}
        keywords={keywords}
      />


    <div className='max-w-screen overflow-hidden'>
      <MaxWidthWrapper>
        <Navbar />
      </MaxWidthWrapper>


    <div className="max-w-4xl mt-32 mx-auto p-4">
      <Card className='border-0'>
        <CardHeader className="">
          <CardTitle className='text-2xl md:text-5xl sm:text-3xl text-richblue-200  text-center font-bold'>
            How To Participate In nationwide-motors Auctions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-slate-50 transition-colors">
                <div className="flex-shrink-0 bg-white p-2 rounded-full shadow-sm">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800">
                    {step.number}. {step.title}
                  </h3>
                  <p className="mt-1 text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
    < FooterCard />
    < Footer />
    </>
  );
};

export default AuctionSteps;