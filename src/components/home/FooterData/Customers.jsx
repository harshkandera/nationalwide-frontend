import React from 'react';
import MaxWidthWrapper from '../../../component/MaxWidthWrapper';

const Testimonials = () => {
  const testimonials = [
    {
      title: "Expanding a Local Dealership’s Inventory",
      comment:
        "nationwide-motors.com has completely transformed my business. As a local dealer, I was limited to sourcing cars locally, but now I can access auctions across Europe. This has allowed me to offer my customers a wider selection of vehicles and grow my dealership.",
      client: "Thomas G., Munich, Germany",
    },
    {
      title: "Seamless International Purchases",
      comment:
        "I was nervous about buying cars internationally, but nationwide-motors.com made the process incredibly easy. From bidding to arranging delivery, everything was handled smoothly. Now I regularly purchase cars from different countries without any hassle.",
      client: "Sophie P., Lyon, France",
    },
    {
      title: "Streamlining Fleet Management",
      comment:
        "Managing a fleet for our logistics company used to be time-consuming and expensive. Thanks to nationwide-motors.com, we’ve been able to replace older vehicles quickly and at a great price, all without leaving the office.",
      client: "Jan H., Rotterdam, Netherlands",
    },
    {
      title: "Expanding a Used Car Business",
      comment:
        "Using nationwide-motors.com has allowed me to expand my used car business beyond my expectations. I’ve been able to source high-quality vehicles at excellent prices, giving me a competitive edge in the market.",
      client: "Marco S., Milan, Italy",
    },
    {
      title: "Buying a Dream Car from Abroad",
      comment:
        "I had been looking for a specific model for months with no luck. nationwide-motors.com not only helped me find it in another country but also made the bidding and purchase process straightforward. I’m now driving my dream car!",
      client: "Lars E., Oslo, Norway",
    },
    {
      title: "Simplifying Corporate Vehicle Sales",
      comment:
        "We needed to sell off several vehicles from our corporate fleet quickly. Using nationwide-motors.com, we were able to list and auction them in no time, reaching buyers across Europe. The platform made everything fast and easy.",
      client: "Emily K., London, UK",
    },
    {
      title: "Hassle-Free Payments and Delivery",
      comment:
        "nationwide-motors.com takes care of the entire transaction process, including payment and delivery. I’ve bought multiple vehicles, and every time, the experience has been smooth, allowing me to focus on my business without worrying about logistics.",
      client: "Andreas L., Zurich, Switzerland",
    },
    {
      title: "Expanding Beyond Borders",
      comment:
        "As a car dealer in Eastern Europe, I was looking for ways to expand my inventory. nationwide-motors.com gave me access to auctions in Western Europe, helping me diversify my stock and attract more customers.",
      client: "Mateusz W., Warsaw, Poland",
    },
    {
      title: "Building Trust through Transparency",
      comment:
        "What I love most about nationwide-motors.com is the transparency. Every vehicle is clearly listed with all the details I need to make informed decisions. I never feel like I’m taking a risk when bidding on cars.",
      client: "Hana M., Prague, Czech Republic",
    },
    {
      title: "Efficient Bidding from Anywhere",
      comment:
        "nationwide-motors.com’s platform allows me to bid from anywhere, anytime. I can monitor auctions and make bids on the go, which has been a game-changer for my business. It’s so easy to use, and the range of vehicles is amazing.",
      client: "David F., Barcelona, Spain",
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
