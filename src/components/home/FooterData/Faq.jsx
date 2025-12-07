
import React, { useState } from 'react';
import { LuMinus, LuPlus } from 'react-icons/lu';
import MaxWidthWrapper from '../../../component/MaxWidthWrapper';

const FAQ = ({ data }) => {

 const [faqs, setFaqs] = useState([
  {
    question: "How do I register?",
    answer: "To register, simply enter your email address and we’ll send you a verification code. After verifying your email, you can set your password and complete your profile inside the account dashboard.",
    isOpen: false
  },
  {
    question: "How does the auction process work?",
    answer: "STEP 1: Log in and open the vehicle details page of the car you want to bid on. STEP 2: Enter your bid using the input box or the + / – buttons. You cannot bid below the starting price or the current highest bid. STEP 3: Click ‘Place Bid’. All bids are final and legally binding.",
    isOpen: false
  },
  {
    question: "What happens if my bid wins?",
    answer: "If your bid wins, we will begin by verifying your identity to ensure a secure purchase. Once verified, you will receive an invoice that must be paid within 48 hours. After payment is confirmed, we’ll coordinate shipping to your chosen U.S. address.",
    isOpen: false
  },
  {
    question: "Has the vehicle been in an accident?",
    answer: "If the car has accident history, it will be clearly mentioned. Check the Damage or Condition Report section for detailed information, including previous accidents or structural repairs.",
    isOpen: false
  },
  {
    question: "If the service book is not available, can I get a service history?",
    answer: "Vehicles are inspected before listing, but service history may not always be available depending on the previous owner or auction source.",
    isOpen: false
  },
  {
    question: "How can I recognize damages in the pictures?",
    answer: "We provide detailed, high-quality photos showing exterior and interior condition, including scratches, dents, or mechanical issues. Any major damage will be highlighted in the listing.",
    isOpen: false
  },
  {
    question: "The vehicle I purchased has decals or business logos. Will they be removed before delivery?",
    answer: "Yes. Any commercial decals, stickers, or branding applied by the previous owner will be removed before delivery, and proof of removal will be documented.",
    isOpen: false
  },
  {
    question: "How and when do I pay for the vehicle?",
    answer: "Once you win the auction, you will receive a payment request. Payment must be completed via bank transfer or ACH within 2 business days. All payments must be made from a bank account registered in your name.",
    isOpen: false
  },
  {
    question: "How will I know when my payment has been received?",
    answer: "You will receive an email confirmation and a release note once your payment is successfully processed.",
    isOpen: false
  },
  {
    question: "How can I order transport?",
    answer: "Once you've paid for your vehicle, we can arrange nationwide delivery to any U.S. address. Delivery fees start at $0.50 per mile, depending on distance and location.",
    isOpen: false
  },
  {
    question: "Can I change the delivery address for a transport I already scheduled?",
    answer: "Yes, but only before the vehicle is dispatched. Changing the delivery address after shipping has begun may incur an additional fee of $150, along with an updated mileage cost.",
    isOpen: false
  },
  {
    question: "Can I pick up the vehicle and pay for it at the storage location?",
    answer: "Vehicles can only be picked up with a Pickup Authorization (PuA). Payment must be completed online before pickup.",
    isOpen: false
  },
  {
    question: "What is a Pickup Authorization (PuA)?",
    answer: "A Pickup Authorization is a document that allows you or your authorized transporter to collect the vehicle. Without this document, the vehicle cannot be released.",
    isOpen: false
  },
  {
    question: "How do I receive the Pickup Authorization (PuA)?",
    answer: "The PuA is issued after your payment has been confirmed and you request vehicle pickup from one of our approved U.S. pickup locations.",
    isOpen: false
  },
  {
    question: "When will I receive my vehicle documents?",
    answer: "Your vehicle documents, including the title and bill of sale, will be shipped along with the vehicle or sent separately depending on state regulations.",
    isOpen: false
  },
  {
    question: "Can I get a copy of the vehicle documents before the vehicle is delivered?",
    answer: "Yes, you may request digital copies of essential vehicle documents once your order is processed. A small service fee of $45 applies.",
    isOpen: false
  },
  {
    question: "What is a Certificate of Conformity (COC)?",
    answer: "A Certificate of Conformity verifies that your vehicle meets U.S. EPA and DOT compliance standards. It includes manufacturer specifications and required regulatory information.",
    isOpen: false
  },
  {
    question: "Can I get a duplicate invoice?",
    answer: "Yes. All your invoices are available for download at any time as PDF files in your account dashboard.",
    isOpen: false
  },
  {
    question: "Can I get a hard copy of my invoice?",
    answer: "We use digital documentation for convenience and environmental reasons. However, you may print your invoice directly from your dashboard if needed.",
    isOpen: false
  }
]);

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
    <MaxWidthWrapper>
      <div className="py-10 sm:py-16 lg:py-24">
        <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold leading-tight text-richblue-200 sm:text-4xl lg:text-5xl">Frequently Ask Questions</h2>
            <p className="max-w-xl mx-auto mt-4 text-xl text-richblue-200/70 font-semibold">Explore the common questions and answers about Celebration</p>
          </div>

          <div className="flex flex-col gap-4 mt-20">
            {faqs.map((faq, index) => (
              <div key={index} className="text-gray-800 font-inter">
                <div className="m-2 p-2 rounded-md flex items-center">
                  <div className="min-w-[90%]">
                    <div className="font-semibold font-inter">{faq.question}</div>
                    <div
                      className={`mt-2 text-sm text-muted-foreground ${faq.isOpen ? 'transition-all duration-700 ease-in-out max-h-[200vh]' : 'max-h-0 overflow-hidden transition-all duration-500 ease-in-out'
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

          <div className="flex items-center justify-center mt-12 md:mt-16">
            <div className="px-8 py-4 text-center bg-richblue-200 rounded-full">
              <p className="text-gray-50">Didn’t find the answer you are looking for? <a href="#" title="" className="text-indigo-300 transition-all duration-200 hover:text-indigo-400 focus:text-indigo-400 hover:underline">Contact our support</a></p>
            </div>
          </div>
        </div>
      </div>


    </MaxWidthWrapper>
  );
};

export default FAQ;