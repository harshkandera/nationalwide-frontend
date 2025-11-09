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
import VehicleDetails from "./VehicleDetails";
import Dashboard from '../Dashboard'
import { IoIosArrowBack } from "react-icons/io";

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

const NewListing = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };
  const location = useLocation();
  const { params } = useParams();


  return (
    <Dashboard>


      <div className="bg-white font-inter  max-w-screen mx-auto ">
        <header className="relative bg-white ">
            <div className="flex h-10 p-2 justify-between items-center">
              <div className="ml-4 text-3xl font-bold font-inter flex lg:ml-0">
                <Link href="/">
                  New Listing
                </Link>
              </div>
            </div>
        </header>


          <div className='w-full h-20 mt-4 bg-richblue-100 rounded-xl  '>
            <div className='p-6 flex gap-2 items-center'>
              <Button variant='secondary' onClick={goBack} className='font-bold p-0 text-foreground-muted h-10 w-10 rounded-md'><IoIosArrowBack className='text-lg text-muted-foreground' /></Button>

              <div className='text-xl font-bold font-inter text-white'>
                Add New Listing Here!
              </div>
            
            </div>
          </div>


        <div className="my-10">
          {
            location.pathname === '/admin/new_listing/details' && <Listing />
          }

          {
            params && params === 'vehicle-details' && <VehicleDetails />
          }

        

        </div>

      </div>
    </Dashboard>
  );
};

export default NewListing;
