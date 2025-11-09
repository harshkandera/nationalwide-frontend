import React, { useState,useEffect } from "react";
import { Card } from "../component/ui/card";
import { Button } from "../component/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../component/ui/tabs";
import { CheckCircle } from "lucide-react";
import Footer, { FooterCard } from "../components/home/Footer";
import Navbar from "../component/Navbar";
import MaxWidthWrapper from "../component/MaxWidthWrapper";
import Review from "../assests/review.jpg";
import HeroVideoDialog from '../component/magicui/hero-video-dialog'
import { apiConnector } from "../service/apiconnector";
// Star Rating Component
const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`text-lg ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};


export function formatDate(isoString) {
  const date = new Date(isoString);
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
}


// Testimonial Card Component
const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Media Section */}
      {testimonial.type === "image" && (
        <div className="relative h- bg-gray-100">
          <img
            src={testimonial.media}
            alt={`${testimonial.name}'s review`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {testimonial.type === "video" && (
        <div className="relative  bg-gray-100">
      <HeroVideoDialog
        className="shadow-none "
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
        thumbnailAlt="Hero Video"
      />
   
        </div>
      )}

      {/* Review Content */}
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            {testimonial.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">{testimonial.name}</div>
            <div className="text-xs text-gray-500">
              {testimonial.location} • {testimonial.reviewCount} review
              {testimonial.reviewCount > 1 ? "s" : ""}
            </div>
            {testimonial.verified && (
              <div className="flex items-center text-xs text-blue-600 mt-1">
                <CheckCircle className="h-3 w-3 mr-1" /> Verified
              </div>
            )}
          </div>
          <StarRating rating={testimonial.rating} />
        </div>

        <h3 className="font-semibold text-gray-900 mb-2">{testimonial.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{testimonial.content}</p>
        <p className="text-xs text-gray-400">
          Date of experience: {formatDate(testimonial.date)}
        </p>
      </div>
    </div>
  );
};

export default function TestimonialPagePreview() {
  const [activeTab, setActiveTab] = useState("all");

  const [testimonials, setTestimonials] = useState([]);


  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        
        const response = await apiConnector("GET", process.env.REACT_APP_BASE_URL + "/api/v2/get_reviews");
    
        console.log(response)
        setTestimonials(response.data?.testimonials.map((t) => ({ ...t, id: t._id })));
    
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    fetchTestimonials();

    },[])
    


  // const testimonials = [
  //   {
  //     id: 1,
  //     name: "Dietrich Vogel",
  //     location: "DE",
  //     reviewCount: 1,
  //     rating: 5,
  //     title: "I was hesitant at first",
  //     content: "I was hesitant at first, but the entire process exceeded my expectations. Amazing car and team!",
  //     date: "13 April 2024",
  //     verified: true,
  //     type: "image",
  //     media: Review,
  //   },
  //   {
  //     id: 2,
  //     name: "Michael Johnson",
  //     location: "US",
  //     reviewCount: 1,
  //     rating: 5,
  //     title: "Changed my perspective about luxury cars",
  //     content: "When I first visited the showroom, I wasn't convinced I needed such a high-end vehicle.",
  //     date: "10 March 2024",
  //     verified: true,
  //     type: "video",
  //     media: "your-video-url-here", // Replace with actual video URL
  //   },
  //   {
  //     id: 3,
  //     name: "Sarah Chen",
  //     location: "CA",
  //     reviewCount: 3,
  //     rating: 5,
  //     title: "Best purchase decision ever",
  //     content: "From start to finish, the whole experience was seamless and enjoyable.",
  //     date: "5 May 2024",
  //     verified: true,
  //     type: "text",
  //   },
  //   // Add more testimonials as needed
  // ];

  const filteredTestimonials = testimonials.filter((testimonial) => {
    if (activeTab === "all") return true;
    if (activeTab === "video") return testimonial.type === "video";
    if (activeTab === "image") return testimonial.type === "image";
    if (activeTab === "text") return testimonial.type === "text";
    return true;
  });

  return (
    <>
      <div className="max-w-screen overflow-hidden">
        <MaxWidthWrapper>
          <Navbar />
        </MaxWidthWrapper>

        <MaxWidthWrapper>
          <div className="mt-32 min-h-screen p-4">
            <div className="max-w-6xl mx-auto py-8">
              {/* Header Section */}
              <div className="text-center mb-12">
                <h1 className="text-2xl md:text-5xl sm:text-3xl text-richblue-200 text-center font-bold">
                  What Our Customers Say
                </h1>
                <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                  Hear from our satisfied customers about their experience with our products and services.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">4.9</div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">2,500+</div>
                  <div className="text-sm text-gray-500">Happy Customers</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">98%</div>
                  <div className="text-sm text-gray-500">Satisfaction Rate</div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex justify-center mb-10">
                <div className="bg-white rounded-full p-1 shadow-sm">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        activeTab === "all"
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      All Reviews
                    </button>
                    <button
                      onClick={() => setActiveTab("image")}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        activeTab === "image"
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Photo Reviews
                    </button>
                    <button
                      onClick={() => setActiveTab("video")}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        activeTab === "video"
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Video Reviews
                    </button>
                    <button
                      onClick={() => setActiveTab("text")}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        activeTab === "text"
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Written Reviews
                    </button>
                  </div>
                </div>
              </div>

              {/* Testimonial Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTestimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-10">
                <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors">
                  Load More Reviews
                </button>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>

      <FooterCard />
      <Footer />
    </>
  );
}