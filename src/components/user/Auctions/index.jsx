import React, { useEffect } from "react";
import Dashboard from "../Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../component/ui/button";
import MaxWidthWrapper from "../../../component/MaxWidthWrapper";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import ErrorBoundry from "../../../ErrorBoundry";

const Auctions = ({ children }) => {
  const { user } = useSelector((state) => state.profile);

  const location = useLocation();

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Dashboard>
      <header className="relative">
        <div className="flex h-16 p-2 justify-between items-center">
          <div className="ml-4 text-3xl font-inter font-bold flex lg:ml-0">
            Auctions
          </div>
        </div>
      </header>

      <div className="w-full h-20 mt-4 bg-richblue-100 rounded-xl">
        <div className="p-6 flex gap-2 items-center">
          <Button
            variant="secondary"
            onClick={goBack}
            className="font-bold p-0 text-foreground-muted h-10 w-10 rounded-md"
          >
            <IoIosArrowBack className="text-lg text-muted-foreground" />
          </Button>

          <div className="text-lf md:text-xl font-bold font-inter text-white">
            See All your Auctions here!
          </div>
        </div>
      </div>

      <ErrorBoundry>
        <div className="mt-6">{children}</div>
      </ErrorBoundry>
    </Dashboard>
  );
};

export default Auctions;
