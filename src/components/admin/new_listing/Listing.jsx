import React from "react";
import MaxWidthWrapper from "../../../component/MaxWidthWrapper";
import { Button } from "../../../component/ui/button";
import { Link } from "react-router-dom";
import { Separator } from "../../../component/ui/separator";

const Listing = () => {


  return (
    <div> 
      <MaxWidthWrapper className="mt-4">
        <div className="flex w-full justify-center items-center flex-col gap-4">
          <div className="text-3xl font-bold font-inter ">
            Set Vehicle Details
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Title ,description ,price etc.
          </div>
          <Link to='/admin/new_listing/vehicle-details'>
          <Button variant="secondary">Procced</Button>
          </Link>
          <Separator className="my-8 w-96" />
        </div>
      </MaxWidthWrapper>


    </div>
  );
};

export default Listing;
