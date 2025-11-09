import React, { useState } from "react";
import MaxWidthWrapper from "../../component/MaxWidthWrapper";
import { Button } from "../../component/ui/button";
import Coupe from "../../assests/coupe.jpg";
import Hatchback from "../../assests/hatchback.jpg";
import Sedan from "../../assests/sedan.jpg";
import SUV from "../../assests/suv.jpg";
import Truck from "../../assests/truck.jpg";
import Van from "../../assests/van.jpg";
import Roadster from "../../assests/roadster.jpeg";
import Pickup from "../../assests/pickup.jpg";
import Convertible from '../../assests/convertible.jpg'
// import Crossover from '../../assests/'
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const carBodyImages = {
  Sedan: Sedan,
  Hatchback: Hatchback,
  SUV: SUV,
  Coupe: Coupe,
  Truck: Truck,
  Van: Van,
  Roadster: Roadster,
  Pickup: Pickup,
  Convertible: Convertible
};

const carBodyTypes = [
  "Sedan",
  "Hatchback",
  "SUV",
  "Coupe",
  "Convertible",
  "Truck",
  "Van",
  "Roadster",
  "Pickup",
];

const BodyTypeCars = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3; // Show 3 items per page
  const totalItems = carBodyTypes.length;

  const next = () => {
    if (currentIndex + itemsPerPage < totalItems) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const prev = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };

  const visibleItems = carBodyTypes.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <MaxWidthWrapper>
      {/* <div className='flex items-center gap-4 flex-wrap'>
                {
                    visibleItems.map((bodyType) => (
                        <Button 
                            variant='secondary' 
                            size='sm' 
                            className='bg-richblue-50 hover:bg-richblue-50/90 rounded-full' 
                            key={bodyType}
                        >
                            {bodyType}
                        </Button>
                    ))
                }
            </div> */}
      {/* Next and Prev buttons */}
      <div className="flex gap-6 justify-end mt-6">
        <Button
          onClick={prev}
          disabled={currentIndex === 0}
          variant="secondary"
        >
          <MdOutlineKeyboardDoubleArrowLeft />
        </Button>
        <Button
          onClick={next}
          variant="secondary"
          disabled={currentIndex + itemsPerPage >= totalItems}
        >
          <MdOutlineKeyboardDoubleArrowRight />
        </Button>
      </div>
      {/* Car Body Type Images */}
      <div className="grid mt-10 gap-6 grid-cols-1 sm:grid-cols-3">
        {visibleItems.map((bodyType) => {
          const imageSrc = carBodyImages[bodyType];
          return (
            imageSrc && (
              <div className="flex flex-col justify-center w-80 h-80 hover:shadow-md cursor-pointer items-center rounded-md">
                <div>
                  <img
                    src={imageSrc}
                    alt={bodyType}
                    className="w-full"
                    key={bodyType}
                  />
                </div>
                <div className="text-lg font-bold">
                    {bodyType}
                </div>
              </div>
            )
          );
        })}
      </div>
    </MaxWidthWrapper>
  );
};

export default BodyTypeCars;
