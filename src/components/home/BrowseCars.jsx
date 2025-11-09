import React from "react";
import CarCards from "./CarCards";
import { Link } from "react-router-dom";
import { CarsSkeleton } from "../../component/CarSkeleton";
import Img15 from "../../assests/img15.png"; // Import your image correctly

const NoSearchFound = () => {
  return (
    <div className="w-full flex flex-col gap-2 justify-center items-center">
      <div className="w-24">
        <img src={Img15} alt="not found" />
      </div>
      <div className="text-3xl font-medium">No Results Found</div>
      <div className="text-muted-foreground">
        Please try searching with another term.
      </div>
    </div>
  );
};

const BrowseCars = ({ cars, isLoading, isError, error }) => {
  return (
    <div className="px-2 w-full">
      <div className="flex flex-col w-full font-inter justify-center gap-6">
        <div className="w-full md:px-16 px-2">
          <div className="mt-4">
            {/* Handle loading state */}
            {isLoading && <CarsSkeleton count={32} />}

            {/* Handle error state */}
            {isError && (
              <div className="text-center text-red-500 font-bold">
                {error
                  ? error.message
                  : "An error occurred while fetching cars."}
              </div>
            )}

            {/* Render car cards if not loading and no error */}
            {!isLoading &&
              !isError &&
              (cars?.length > 0 ? (
                <div className="grid grid-cols-1 justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-4">
                  {cars
                    .filter((car) => car.status !== "draft")
                    .map((car) => (
                      <Link
                        className="flex justify-center items-center"
                        key={car._id}
                        to={`car_details/${car._id}`}
                      >
                        <CarCards car={car} />
                      </Link>
                    ))}
                </div>
              ) : (
                <div className="w-full h-full mt-32 flex justify-center items-center">
                  <NoSearchFound />
                </div>
                // Render the NoSearchFound component
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseCars;
