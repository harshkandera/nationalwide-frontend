
import React, { useState } from 'react';
import { LuMinus, LuPlus } from 'react-icons/lu';
import MaxWidthWrapper from '../../../component/MaxWidthWrapper';

const PressKit = () => {


    return (
        <MaxWidthWrapper>
            <div className="py-10 sm:py-16 lg:py-24">
                <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl font-bold leading-tight text-richblue-200 sm:text-4xl lg:text-5xl">nationwide-motors.com</h2>
                        <p className="max-w-xl mx-auto mt-4 text-xl text-richblue-200/70 font-semibold">USA’s Leader in Online Car Auction Sales</p>
                    </div>

                    <div className="flex flex-col font-inter gap-8 mt-20">
                        <p>
                            nationwide-motors.com is proud to announce its position as the leading platform in USA’s online car auction industry. Offering a secure, centralized marketplace for vehicle transactions, nationwide-motors.com provides buyers and sellers with unmatched convenience, flexibility, and access to a vast range of vehicles. Our innovative auction platform allows customers to browse, bid, and purchase vehicles from anywhere in the world, breaking traditional barriers in the automotive market.
                        </p>

                        <p>
                            As the leader in this space, nationwide-motors.com sets itself apart by offering more than just auctions. We provide a fully integrated buying experience, managing everything from payment processing to delivery. Whether you’re sourcing vehicles locally or internationally, our platform operates in multiple languages and currencies, ensuring a seamless and secure process for all users.
                        </p>


                        <p>
                            With thousands of dealers, manufacturers, and fleet managers offering a diverse selection of vehicles, nationwide-motors.com has become the go-to destination for individuals and businesses alike. Our powerful search tools make it easy for users to find the exact vehicle they need, while our tailored service options provide end-to-end support at every stage of the buying process.
                        </p>

                        <p>
                            “Our mission is to revolutionize the way people buy and sell cars,” said Matthias Schneider, CEO of nationwide-motors.com. “As USA’s leading platform, we’re committed to making car auctions more accessible, efficient, and transparent for everyone, from individual buyers to large-scale dealers.”
                        </p>

                        <p>
                            With a focus on innovation and customer satisfaction, nationwide-motors.com continues to shape the future of the automotive auction industry, delivering a truly global marketplace right to your fingertips.
                        </p>

                    </div>

                    <div className="flex items-center justify-center mt-12 md:mt-16">
                        <div className="px-8 py-4 text-center bg-richblue-200 rounded-full">
                            <p className="text-gray-50">For more information about nationwide-motors.com and to explore current auctions, visit  <a href="#" title="" className="text-indigo-300 transition-all duration-200 hover:text-indigo-400 focus:text-indigo-400 hover:underline">www.nationwide-motors.com</a></p>
                        </div>
                    </div>

                    {/* <div className='mt-20'>
                    <DefaultGallery />
                    </div> */}

                </div>
            </div>


        </MaxWidthWrapper>
    );
};

export default PressKit;


export function DefaultGallery() {
    const data = [
      {
        imageLink:
          "https://res.cloudinary.com/dgty4nzfo/image/upload/v1738654223/gbgy46zkueefugmxnurj.jpg",
      },
      {
        imageLink:
          "https://res.cloudinary.com/dgty4nzfo/image/upload/v1738654189/h2jzqpmu8vutzdqo8bzu.jpg",
      },
      {
        imageLink:
          "https://res.cloudinary.com/dgty4nzfo/image/upload/v1738654180/kal2gsqvrzm5mxnepxkw.jpg",
      },
      {
        imageLink:
          "https://res.cloudinary.com/dgty4nzfo/image/upload/v1738654169/ermwrdeffqklsbwaxfq0.jpg",
      },
      {
        imageLink:
          "https://res.cloudinary.com/dgty4nzfo/image/upload/v1738654138/yqxxmlg2rpogq2e8rqfu.jpg",
      },
      {
        imageLink:
          "https://res.cloudinary.com/dgty4nzfo/image/upload/v1738654723/cagb1xi5fokld72wmeim.jpg",
      },
      
    ];
   
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.map(({ imageLink }, index) => (
          <div key={index}>
            <img
              className="h-52 w-full max-w-full rounded-lg object-cover object-center"
              src={imageLink}
              alt="gallery-photo"
            />
          </div>
        ))}
      </div>
    );
  }
   