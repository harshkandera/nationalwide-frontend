import React from "react";
import MaxWidthWrapper from "../../../component/MaxWidthWrapper";
import { Button } from "../../../component/ui/button";
import { Icons } from "../../../assests/Icons";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../component/ui/breadcrumb";
import { Separator } from "../../../component/ui/separator";
import Listing from "./Listing";
import VehicleDetails from "../new_listing/VehicleDetails";
import VehicleFeatures from "./Feature";
import VehicleLooks from "./VehicleLooks";
import { useSelector, useDispatch } from 'react-redux'
import { IoIosArrowBack } from "react-icons/io";
import { useListingByIdQuery } from "../../../slices/apiSlices/carListingApiSlice"


import Dasboard from "../Dashboard"


export function BreadcrumbWithCustomSeparator({ params }) {

  return (

    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link to="/admin/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link to='/admin/new_listing/details'>New Listing</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage>{params}</BreadcrumbPage>
        </BreadcrumbItem>


      </BreadcrumbList>
    </Breadcrumb>
  );
}

const CompleteListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, params } = useParams();

  const { data, error, isLoading } = useListingByIdQuery(id);

  console.log(data)
  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };



  return (
    <Dasboard>


      <div className="bg-white font-inter  max-w-screen mx-auto overflow-hidden">

        <header className="relative bg-white ">
            <div className="flex h-10 p-2 justify-between items-center">
              <div className="ml-4 text-3xl font-bold font-inter flex lg:ml-0">
                <Link href="/">
                  All Listings
                </Link>
              </div>
            </div>
        </header>

        
        <div className='w-full h-20 mt-4 bg-richblue-100 rounded-xl  '>
          <div className='p-6 flex gap-2 items-center'>
           <Button variant='secondary' onClick={goBack} className='font-bold p-0 text-foreground-muted h-10 w-10 rounded-md'><IoIosArrowBack className='text-lg text-muted-foreground' /></Button>

           <div className='text-xl font-bold font-inter text-white'>
           {data?.Listing?.name}
           </div>
          
          </div>
        </div>

        {/* <MaxWidthWrapper className="mt-10">
        <BreadcrumbWithCustomSeparator params={params} />
      </MaxWidthWrapper> */}


        <div className="mt-10">
          {
            location.pathname === `/admin/all_listings/draft/vehicle/${id}` && <Listing data={data?.Listing} />
          }

          {
            params && params === 'details' && <VehicleDetails data={data?.Listing} />
          }


          {
            params && params === 'features' && <VehicleFeatures data={data?.Listing} />
          }


          {
            params && params === 'looks' && <VehicleLooks data={data?.Listing} />
          }


        </div>

      </div>
    </Dasboard>
  );
};

export default CompleteListing;
