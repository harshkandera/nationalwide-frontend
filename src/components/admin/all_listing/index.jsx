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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../component/ui/tabs";
import Dasboard from "../Dashboard"
import DraftListing from "./DraftListing";
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
            <Link to='/admin/all_listings'>All Listing</Link>
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
    <Dasboard>
      <div className=" font-inter  max-w-screen mx-auto overflow-hidden">


        <header className="relative ">
            <div className="flex h-16 p-2 justify-between items-center">
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
           See All Listings Here!
           </div>
          
          </div>
        </div>


        {/* <MaxWidthWrapper className="mt-10">
        <BreadcrumbWithCustomSeparator params={params} />
      </MaxWidthWrapper> */}


        <div className="mt-4">
        <DraftListing />
        </div>

      </div>
    </Dasboard>

  );
};

export default NewListing;





{/* <Tabs defaultValue="draft" className="w-full">

<TabsList className="grid w-72 grid-cols-2 bg-transparent ">
  <TabsTrigger className='data-[state=active]:bg-richblue-100 data-[state=active]:text-white data-[state=active]:shadow-sm' value="draft">Draft Auctions</TabsTrigger>
  <TabsTrigger className='data-[state=active]:bg-richblue-100 data-[state=active]:text-white data-[state=active]:shadow-sm' value="live">Live Auctions</TabsTrigger>
</TabsList>

<TabsContent value="draft">

</TabsContent>
<TabsContent value="live">

</TabsContent>
</Tabs> */}