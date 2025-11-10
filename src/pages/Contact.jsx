import React, { useState } from "react";
import MaxWidthWrapper from "../component/MaxWidthWrapper";
import Navbar from "../component/Navbar";
import Footer, { FooterCard } from "../components/home/Footer";
import { BsChatSquareDots } from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";
import { LuMinus, LuPlus } from "react-icons/lu";
import { Link } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { RiChatSmileLine } from "react-icons/ri";
import SEO from "../service/helmet";

const Contact = () => {
  const [data] = useState([
    {
      question: "How do I register?",
      answer:
        "The first thing you need to do is submit your email address. You will receive a verification code to your email. Next step is to choose a password and your account is created. You can update your information under the Profile section after your account is created.",
      isOpen: false,
    },

    {
      question: "How does the auction process work?",
      answer:
        "STEP 1: Log in and go to the car details page of the vehicle you want to bid on. STEP 2: Enter your bid by typing in the amount or using the + / - button. You cannot place a bid lower than the starting price or the current highest bid. You will immediately see the total price you will need to pay at that bid level, including fees and taxes. STEP 3: Submit your bid by clicking the ‘Place bid’ button. Remember: all bids are binding and cannot be cancelled or removed from the website.",
      isOpen: false,
    },

    {
      question: "What happens if your bid wins?",
      answer:
        "If your bid wins, we’ll begin by verifying your identity—a crucial step in ensuring secure transactions. Once your identity is confirmed, you’ll receive an invoice for your purchase, which must be paid within 48 hours. After payment is received, we’ll arrange for the shipping of your item to your specified location.",
      isOpen: false,
    },
    {
      question: "Has the vehicle been in an accident?",
      answer:
        "We always inform you if a car was involved in an accident. In the Damage section, you’ll find clear details on whether the vehicle has any damage or accident history.",
      isOpen: false,
    },
    {
      question: "If no service book available, can I get a service history?",
      answer:
        "All cars are thoroughly inspected before being listed on our website. However, the service history may not always be available during the auction period.",
      isOpen: false,
    },
    {
      question: "How can I recognize pictures from damages?",
      answer:
        "It’s easy to spot a damaged car on the nationwide-motors website: We provide detailed photos to help you inspect any interior or exterior damage, including scratches or dings. If a car has mechanical issues, these will be clearly noted in the description.",
      isOpen: false,
    },
    {
      question:
        "The vehicle I’ve bought has stickers or logos on it. Will they be removed before delivery?",
      answer:
        "Yes. All stickers and logos will be removed before your vehicle is delivered. As part of our purchase agreement, nationwide-motors is required to remove all branding, stickers and logos applied by the previous owner(s) of the vehicle and present the seller with proof that they have been removed.",
      isOpen: false,
    },
    {
      question: "How and when do I pay for the vehicle?",
      answer:
        "Once you’ve won the auction, you have one business day to complete the vehicle purchase online. After receiving the payment invitation, you pay for the vehicle via bank transfer within two business days. It’s possible to make payments for maximum 2 cars in one transfer. Please include the reference numbers of all vehicles you paid for. We only accept payments from a bank account registered in your name.",
      isOpen: false,
    },
    {
      question: "How can I know when you have received my payment?",
      answer:
        "We will send you a release note via email as soon as we have received your payment.",
      isOpen: false,
    },
    {
      question: "How can I order transport?",
      answer:
        "You won the auction and paid for it? Congratulations! Now you just need to get it to your doorstep. We are happy to arrange transport for you. We will deliver the vehicle to an address of your choosing for a standard delivery fee of €0.5 per kilometer.",
      isOpen: false,
    },
    {
      question:
        "Can I change the delivery address for a transport I already ordered?",
      answer:
        "Yes, you can change the delivery address only before shipping starts. If you change the delivery address after shipping starts, we will ask for an additional cost of €150 and recalculate the distance to your new delivery address.",
      isOpen: false,
    },
    {
      question:
        "Can I pick up the vehicle and pay for it at the storing location?",
      answer:
        "You can pick up a vehicle only with a Pick Up Authorization (PuA).",
      isOpen: false,
    },
    {
      question: "What is a Pickup Authorization (PuA) or release note?",
      answer:
        "With a Pickup Authorization (PuA), you or your driver can pick up your vehicle. This document gives you permission to collect the car. Without the PuA, the vehicle cannot be picked up. This ensures your vehicle is not picked up by the wrong driver.",
      isOpen: false,
    },
    {
      question: "How do I receive the Pickup Authorization (PuA)?",
      answer:
        "A Pickup Authorization is released after the payment for the vehicle is completed and the buyer requests to pick up the vehicle from one of our pickup locations.",
      isOpen: false,
    },
    {
      question: "When will I receive my car documents?",
      answer: "The car documents will be sent with the vehicle.",
      isOpen: false,
    },
    {
      question:
        "Can I get a copy of the car documents before the car is delivered?",
      answer:
        "You can order a copy of the car documents as soon as you complete your order. Each copy will cost you €45.00.",
      isOpen: false,
    },
    {
      question: "What is a COC?",
      answer:
        "A Certificate of Conformity (COC) is a document that declares that your vehicle conforms to EC standards and is allowed free movement within the European Union. It includes the manufacturer’s technical specifications and other data as set by EU regulations.",
      isOpen: false,
    },
    {
      question: "Can I get a duplicate invoice?",
      answer:
        "Lost your invoice? No problem. All our invoices are available online as PDF files.",
      isOpen: false,
    },
    {
      question: "Can I get a hard copy of my invoice?",
      answer:
        "nationwide-motors has abandoned printed documents for the convenience of electronic documents. They’re better for the environment and have the same legal status as hard copy equivalents.",
      isOpen: false,
    },
  ]);

  const handleStartChat = () => {
    const checkZohoSalesIQ = setInterval(() => {
      if (
        window.$zoho &&
        window.$zoho.salesiq &&
        window.$zoho.salesiq.floatwindow
      ) {
        window.$zoho.salesiq.floatwindow.visible("show");
        clearInterval(checkZohoSalesIQ);
      }
    }, 500);
  };

  const title = "Contact Us | Get in Touch with nationwide-motors Support";
  const description =
    "Need assistance or have questions? Contact nationwide-motors for support, inquiries, or general information. We're here to help you with your car auction experience.";
  const image =
    "https://res.cloudinary.com/dgty4nzfo/image/upload/v1730489564/ProfileImages/wk4hohawanq0vfvmpmzr.png";
  const url = "https://nationwide-motors.com/contact_us";
  const keywords =
    "contact nationwide-motors, nationwide-motors support, car auction inquiries, car auction platform support, contact car auctions, car auction help, customer service, get in touch with nationwide-motors, car auction customer support, nationwide-motors contact information";

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

      <MaxWidthWrapper className="mt-32 w-full font-inter gap-2 flex flex-col  overflow-hidden">
        <div className="text-3xl md:text-5xl  text-richblue-200 font-bold">
          Let's Connect
        </div>
        <div className="text-ls md:text-xl text-richblue-200/70 font-semibold">
          Need support or have a question about Coast? We’re here to help.
        </div>

        <div className="flex justify-center items-center flex-wrap gap-8 mt-12">
          <div className="font-inter flex flex-col h-[300px] w-[300px] border shadow-lg rounded-lg p-8 justify-center items-center gap-4">
            <div className="flex justify-center items-center font-semibold text-richblue-200 text-2xl bg-indigo-200 rounded-full h-16 w-16 ">
              <RiChatSmileLine />
            </div>

            <div className="flex justify-center flex-col gap-2 items-center">
              <p className="text-lg text-richblue-200 font-bold">Chat Now</p>
              <p className="text-muted-foreground">Right from this website</p>
            </div>

            <div className="h-px w-full bg-gray-200" />
            <a
              className="w-full"
              href={`https://wa.me/+15419487232`}
              target="_blank"
            >
              <div
                className="bg-orange-500 hover:bg-orange-500/80 rounded-lg flex justify-center cursor-pointer items-center w-full h-14 text-white"
                onClick={handleStartChat}
              >
                start chat now
                <FaArrowRightLong className="ml-2" />
              </div>
            </a>
          </div>

          <div className="font-inter flex flex-col h-[300px] w-[300px] border shadow-lg rounded-lg p-8 justify-center items-center gap-4">
            <div className="flex justify-center items-center  text-richblue-200 text-2xl bg-indigo-200 rounded-full h-16 w-16 ">
              <MdOutlineMailOutline />
            </div>

            <div className="flex justify-center flex-col gap-2 items-center">
              <p className="text-lg text-richblue-200 font-bold"> Email Us </p>
              <p className="text-muted-foreground">From your Email app</p>
            </div>

            <div className="h-px w-full bg-gray-200" />
            <div className="flex justify-center cursor-pointer hover:underline font-bold items-center w-full h-14 text-richblue-200 ">
              <Link to="mailto: support@nationwide-motors.com">
                {" "}
                support@nationwide-motors.com
              </Link>
            </div>
          </div>

          <div className="font-inter flex flex-col h-[300px] w-[300px] border shadow-lg rounded-lg p-8 justify-center items-center gap-4">
            <div className="flex justify-center items-center font-semibold text-richblue-200 text-2xl bg-indigo-200 rounded-full h-16 w-16 ">
              <FaWhatsapp />
            </div>

            <div className="flex justify-center flex-col gap-2 items-center">
              <p className="text-lg text-richblue-200 font-bold">Contact Us</p>
              <p className="text-muted-foreground">From your phone</p>
            </div>

            <div className="h-px w-full bg-gray-200" />
            <div className="flex justify-center font-bold hover:underline cursor-pointer items-center w-full h-14 text-richblue-200 ">
              {/* <a
                href="https://wa.me/"
                target="_blank"
                f
                rel="noopener noreferrer"
              > */}
                
               +1 (231) 310-6051
              {/* </a>{" "} */}
            </div>
          </div>
          <div className="font-inter flex flex-col h-[300px] w-[300px] border shadow-lg rounded-lg p-6 justify-center items-center gap-4">
            <div className="flex justify-center items-center font-semibold text-richblue-200 text-2xl bg-indigo-200 rounded-full h-16 w-16">
              <GrLocation />
            </div>

            <div className="flex justify-center flex-col gap-2 items-center">
              <p className="text-lg text-richblue-200 font-bold">
                296 Warrenton Rd,
              </p>
              <p className="text-sm text-muted-foreground">
                Fredericksburg, VA 22405{" "}
              </p>
            </div>

            <div className="h-px w-full bg-gray-200" />

            <div className="flex justify-start flex-col w-full">
              {/* <p className="text-sm text-richblue-200 font-semibold">
                VAT Number: <span className="font-normal">DE349222590</span>
              </p> */}
              <p className="text-sm text-richblue-200 font-semibold">
                Register:{" "}
                <span className="font-normal">
                  296 Warrenton Rd, Fredericksburg, VA 22405
                </span>
              </p>
              <p className="text-sm text-richblue-200 font-semibold">
                Registration Date:{" "}
                <span className="font-normal">10/16/2019</span>
              </p>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>

      <div className="py-10 sm:py-16 lg:py-24">
        <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-inter leading-tight text-richblue-200 sm:text-4xl lg:text-5xl">
              Questions & Answers
            </h2>
            <p className="max-w-xl mx-auto mt-4 text-xl text-richblue-200/70 font-semibold">
              Explore the common questions and answers about Celebration
            </p>
          </div>

          {/* Use the FAQ component */}
          <FAQ data={data} />

          <div className="flex items-center justify-center mt-12 md:mt-16">
            <div className="px-8 py-4 text-center bg-richblue-200 rounded-full">
              <p className="text-gray-50">
                Didn’t find the answer you are looking for?{" "}
                <a
                  href="#"
                  title=""
                  className="text-indigo-300 transition-all duration-200 hover:text-indigo-400 focus:text-indigo-400 hover:underline"
                >
                  Contact our support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <FooterCard />
      <Footer />
    </>
  );
};

export default Contact;

// components/FAQ.js

export const FAQ = ({ data }) => {
  const [faqs, setFaqs] = useState(data);

  const changeHandle = (index) => {
    setFaqs((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        isOpen: !updatedData[index].isOpen,
      };
      return updatedData;
    });
  };
  return (
    <div className="flex flex-col gap-4 mt-20">
      {faqs.map((faq, index) => (
        <div key={index} className="text-gray-800 font-inter">
          <div className="m-2 p-2 rounded-md flex items-center">
            <div className="min-w-[90%]">
              <div className="font-semibold font-inter">{faq.question}</div>
              <div
                className={`mt-2 text-sm text-muted-foreground ${
                  faq.isOpen
                    ? "transition-all duration-700 ease-in-out max-h-[200vh]"
                    : "max-h-0 overflow-hidden transition-all duration-500 ease-in-out"
                }`}
              >
                {faq.answer}
              </div>
            </div>
            <div
              className="text-richyellow-10 min-w-[10%] text-3xl cursor-pointer"
              onClick={() => changeHandle(index)}
            >
              {faq.isOpen ? <LuMinus /> : <LuPlus />}
            </div>
          </div>
          <div className="h-px w-full bg-gray-200" />
        </div>
      ))}
    </div>
  );
};
