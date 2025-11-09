import React from 'react'
import MaxWidthWrapper from '../component/MaxWidthWrapper';
import Navbar from '../component/Navbar'
import Img5 from '../assests/img5.avif'
import Img7 from '../assests/img7.svg'
import Footer, { FooterCard } from '../components/home/Footer';
import SEO  from '../service/helmet';

const About = () => {


  const title = "About nationwide-motors | Trusted Online Car Auction Platform";
  const description = "Learn more about nationwide-motors, the trusted platform for car auctions. Discover our mission to provide a secure, reliable, and user-friendly space for buying and selling cars through online auctions.";
  const image = "https://res.cloudinary.com/dgty4nzfo/image/upload/v1730489311/ProfileImages/s4hqfwoc2dxtf6sw6ftq.png";
  const url = "https://nationwide-motors.com/about_us";
  const keywords = "about nationwide-motors, car auction platform, online car marketplace, trusted car auctions, buy cars online, sell cars online, secure car auctions, vehicle auction service, reliable car auctions, car auction mission, nationwide-motors values, online car sales, automotive auction platform";


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


      <MaxWidthWrapper className='mt-32 w-full font-inter flex justify-center overflow-hidden items-center'>

        <div className='text-2xl md:text-5xl sm:text-3xl text-richblue-200 sm:w-10/12  text-center font-bold'>

          Exploring Our Vision for a Seamless Car Auction Experience

        </div>

      </MaxWidthWrapper>

      <div className='w-screen max-w-screen overflow-hidden'>
        <img src={Img5} className='max-w-full w-full' alt="" />
      </div>

      <MaxWidthWrapper className='mt-32  overflow-hidden w-full font-inter flex flex-col space-y-20 justify-center items-center'>

        <div className='flex w-2/3 gap-4 flex-col justify-center items-start'>
          <div className='text-2xl md:text-5xl sm:text-3xl text-richblue-200  text-center font-bold'>

            About Us

          </div>
          <div>
            Welcome to nationwide-motors, your premier online platform for vehicle auctions across Europe. Established with a passion for innovation and transparency in the automotive industry, we are dedicated to connecting buyers and sellers through a seamless, secure, and efficient online auction experience.

          </div>
        </div>


        <div className='flex w-2/3 gap-4 flex-col justify-center items-start'>
          <div className='text-2xl md:text-5xl sm:text-3xl text-richblue-200  text-center font-bold'>

            Our Mission

          </div>
          <div>
            At nationwide-motors, our mission is to revolutionize the way vehicles are bought and sold across Europe. We provide an intuitive and user-friendly platform that allows buyers to access a wide range of vehicles, from everyday cars to luxury models, all in one place. Sellers benefit from our extensive network and cutting-edge auction technology, ensuring that they reach the right buyers quickly and effectively.

          </div>
        </div>

        <div className='flex  gap-4 flex-col justify-center items-center'>

     

          {/* <div className='w-8/12 mt-10'>
            <img src={Img7} className='w-full' alt="" />
          </div> */}
          {/* <section className="py-12 bg-white sm:py-16 lg:py-20">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className='text-2xl md:text-5xl sm:text-3xl text-richblue-200  text-center font-bold'>

                Our Team
              </div>
              <div className="grid max-w-6xl grid-cols-1 px-20 mx-auto mt-12 text-center sm:px-0 sm:grid-cols-2 md:mt-20 gap-x-8 md:grid-cols-4 gap-y-12 lg:gap-x-16 xl:gap-x-20">
                <div>
                  <img className="object-cover w-32 h-32 mx-auto rounded-full lg:w-44 lg:h-44 grayscale filter" src="https://cdn.rareblocks.xyz/collection/clarity/images/team/1/team-member-1.png" alt="" />
                  <p className="mt-5 text-lg font-bold text-gray-900 sm:text-xl sm:mt-8 font-pj"> Gunter Kaufamnn </p>
                  <p className="mt-2 text-base font-normal text-gray-600 font-pj">Chairman</p>
                </div>

                <div>
                  <img className="object-cover w-32 h-32 mx-auto rounded-full lg:w-44 lg:h-44 grayscale filter" src="https://cdn.rareblocks.xyz/collection/clarity/images/team/1/team-member-2.png" alt="" />
                  <p className="mt-5 text-lg font-bold text-gray-900 sm:text-xl sm:mt-8 font-pj"> Mark Lehmann</p>
                  <p className="mt-2 text-base font-normal text-gray-600 font-pj">Chief Operating Officer</p>
                </div>

                <div>
                  <img className="object-cover w-32 h-32 mx-auto rounded-full lg:w-44 lg:h-44 grayscale filter" src="https://cdn.rareblocks.xyz/collection/clarity/images/team/1/team-member-3.png" alt="" />
                  <p className="mt-5 text-lg font-bold text-gray-900 sm:text-xl sm:mt-8 font-pj">Peter Linder</p>
                  <p className="mt-2 text-base font-normal text-gray-600 font-pj">Marketing Manager</p>
                </div>

                <div>
                  <img className="object-cover w-32 h-32 mx-auto rounded-full lg:w-44 lg:h-44 grayscale filter" src="https://cdn.rareblocks.xyz/collection/clarity/images/team/1/team-member-4.png" alt="" />
                  <p className="mt-5 text-lg font-bold text-gray-900 sm:text-xl sm:mt-8 font-pj">Oliver Wimmers</p>
                  <p className="mt-2 text-base font-normal text-gray-600 font-pj">Chief Financial Officer (CFO)</p>
                </div>
              </div>

              <div className="mt-12 sm:mt-16">
                <svg className="w-auto h-4 mx-auto text-gray-300" viewBox="0 0 172 16" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 11 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 46 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 81 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 116 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 151 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 18 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 53 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 88 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 123 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 158 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 25 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 60 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 95 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 130 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 165 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 32 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 67 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 102 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 137 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 172 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 39 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 74 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 109 1)" />
                  <line y1="-0.5" x2="18.0278" y2="-0.5" transform="matrix(-0.5547 0.83205 0.83205 0.5547 144 1)" />
                </svg>
              </div>

            </div>
          </section> */}


        </div>

      </MaxWidthWrapper>

      < FooterCard />
      < Footer />

    </div>
    </>
)
}

export default About;