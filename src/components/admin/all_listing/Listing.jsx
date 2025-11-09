import React from "react";
import MaxWidthWrapper from "../../../component/MaxWidthWrapper";
import { Button } from "../../../component/ui/button";
import { Link } from "react-router-dom";
import { Separator } from "../../../component/ui/separator";
import { useSelector, useDispatch } from 'react-redux'
import { setNewListing } from "../../../slices/listingSlice";
import { Progress } from "../../../component/ui/progress";



const Listing = ({ data }) => {
  const dispatch = useDispatch();

  console.log(data)


  return (
    <div>
      <MaxWidthWrapper className="mt-10">
        <div className="flex w-full justify-center items-center flex-col gap-2">
          <div className="text-2xl font-bold font-inter ">Complete Listing Detail</div>
          <div className="text-sm font-medium text-muted-foreground">
            Enter details to proceed further
          </div>
          <Separator className="my-8 w-80" />
        </div>
      </MaxWidthWrapper>

      <MaxWidthWrapper className="mt-10">
        <div className="flex w-full justify-center items-center flex-col gap-2">
          <div className="text-xl font-bold font-inter ">
            Set vehicle details
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Title ,description ,price etc.
          </div>

          <div className="w-52 my-4">
            <Progress value={data?.step1 ? 100 : 10} className='h-2' />
          </div>

          <Link to={`/admin/all_listings/draft/details/${data?._id}`}>
            <Button variant="secondary">Procced</Button>
          </Link>

          <Separator className="my-8 w-96" />
        </div>
      </MaxWidthWrapper>

      <MaxWidthWrapper className="mt-10">
        <div className="flex w-full justify-center items-center flex-col gap-2">
          <div className="text-xl font-bold font-inter ">
            Set vehicle feactures
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Body type ,fuel type, transmission etc.
          </div>

          <div className="w-52 my-4">
            <Progress value={data?.step2 ? 100 : 10} className='h-2' />
          </div>

          <Link to={`/admin/all_listings/draft/features/${data?._id}`}>
            <Button variant="secondary">Procced</Button>
          </Link>
          <Separator className="my-8 w-96" />
        </div>
      </MaxWidthWrapper>

      <MaxWidthWrapper className="mt-10">
        <div className="flex w-full justify-center items-center flex-col gap-2">
          <div className="text-xl font-bold font-inter ">Set overall look</div>
          <div className="text-sm font-medium text-muted-foreground">
            explain looks ,upload images etc.
          </div>
          <div className="w-52 my-4">
            <Progress value={data?.step3 ? 100 : 10} className='h-2' />
          </div>
          <Link to={`/admin/all_listings/draft/looks/${data?._id}`}>
            <Button variant="secondary">Procced</Button>
          </Link>
          <Separator className="my-8 w-96" />
        </div>
      </MaxWidthWrapper>

      {/* <MaxWidthWrapper className="mb-20 ">
        <div className="flex w-full justify-center items-center ">
          <Button disable={!data?.step1 || !data?.step2 || !data?.step3} variant='btn' className='w-44'>
            Make it Live
          </Button>
        </div>

      </MaxWidthWrapper> */}




    </div>
  );
};

export default Listing;
