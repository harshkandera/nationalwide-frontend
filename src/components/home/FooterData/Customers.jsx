import React from 'react';
import MaxWidthWrapper from '../../../component/MaxWidthWrapper';

const Testimonials = () => {
const testimonials = [
  {
    title: "Expanding Inventory with Nationwide Access",
    comment:
      "nationwide-motors.com has completely transformed my dealership. Earlier, I relied only on local auctions, but now I can source cars from all over the USA. This has helped me offer a wider range of vehicles and scale my business faster than ever.",
    client: "Thomas G., Dallas, Texas",
  },
  {
    title: "Smooth and Simple Buying Experience",
    comment:
      "I was initially unsure about purchasing vehicles from out-of-state auctions, but nationwide-motors.com made everything effortless. From bidding to transportation, the process was seamless. Now I regularly buy vehicles from coast to coast.",
    client: "Sophia P., Phoenix, Arizona",
  },
  {
    title: "Streamlining Fleet Upgrades",
    comment:
      "Managing our logistics fleet used to be a challenge. Thanks to nationwide-motors.com, we can replace older trucks quickly and at competitive prices without leaving the office. It has made fleet management more efficient than ever.",
    client: "Jan H., Indianapolis, Indiana",
  },
  {
    title: "Growing My Used Car Business",
    comment:
      "nationwide-motors.com has helped me expand my used car business far beyond my expectations. I now source high-quality vehicles at great prices across the country, which gives me a big edge over local competitors.",
    client: "Marco S., Miami, Florida",
  },
  {
    title: "Finally Found My Dream Car",
    comment:
      "I had been searching for a specific model for months. nationwide-motors.com helped me find it in another state and made the whole bidding and purchase process super easy. I'm finally driving my dream car!",
    client: "Lars E., Seattle, Washington",
  },
  {
    title: "Quick Corporate Vehicle Liquidation",
    comment:
      "We needed to sell several vehicles from our corporate fleet quickly. With nationwide-motors.com, we listed and auctioned everything in no time and reached buyers from different states. The entire process was smooth and efficient.",
    client: "Emily K., New York, New York",
  },
  {
    title: "Reliable Payments and Delivery",
    comment:
      "One thing I appreciate most about nationwide-motors.com is that they handle payments and delivery smoothly. I've bought multiple vehicles, and each transaction has been stress-free, allowing me to focus on growing my business.",
    client: "Andrew L., Denver, Colorado",
  },
  {
    title: "Expanding Across State Lines",
    comment:
      "As a dealer on the East Coast, I wanted access to more diverse inventory. nationwide-motors.com gave me entry to auctions all over the West Coast, helping me stock unique vehicles that attract more customers.",
    client: "Matthew W., Atlanta, Georgia",
  },
  {
    title: "Trustworthy and Transparent",
    comment:
      "What I value most is the transparency. Every vehicle is listed with clear details, making it easy to make confident bidding decisions. I always feel informed and in control during auctions.",
    client: "Hannah M., Chicago, Illinois",
  },
  {
    title: "Bid from Anywhere, Anytime",
    comment:
      "nationwide-motors.com lets me bid from anywhere — even while traveling. I can monitor auctions and place bids on the go, which has been a major advantage for my dealership. The platform is incredibly easy to use.",
    client: "David F., Los Angeles, California",
  },
];

  return (
    <MaxWidthWrapper>
      <div className="py-10 sm:py-16 lg:py-24">
        <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold leading-tight text-richblue-200 sm:text-4xl lg:text-5xl">
              nationwide-motors Testimonials
            </h2>
            <p className="max-w-xl mx-auto mt-4 text-xl text-richblue-200/70 font-semibold">
              Hear what our customers have to say
            </p>
          </div>

          <div className="relative mt-10 md:mt-24">
            <div className="absolute -inset-x-1 inset-y-16 md:-inset-x-2 md:-inset-y-6">
              <div className="w-full h-full max-w-5xl mx-auto rounded-3xl opacity-30 blur-lg filter bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></div>
            </div>

            <div className="relative grid max-w-lg grid-cols-1 gap-6 mx-auto md:max-w-none lg:gap-10 md:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex flex-col overflow-hidden shadow-xl">
                  <div className="flex flex-col justify-between flex-1 p-6 bg-white lg:py-8 lg:px-7">
                    <div className="flex-1">
                      <blockquote className="flex-1 mt-8">
                        <p className="text-lg leading-relaxed text-gray-900 font-pj italic">
                          “{testimonial.comment}”
                        </p>
                      </blockquote>
                    </div>
                    <div className="flex items-center mt-8">
                      <div className="ml-4">
                        <p className="text-base font-bold text-gray-900 font-pj">
                          {testimonial.client}
                        </p>
                        <p className="mt-0.5 text-sm font-pj text-gray-600">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Testimonials;
