import React, {
  createContext,
  useContext,
  useState,
  Suspense,
  useEffect,
} from "react";
import MaxWidthWrapper from "../component/MaxWidthWrapper";
import Navbar from "../component/Navbar";
import { Button } from "../component/ui/button";
import Filter from "../components/home/Filter";
import { IoMdSearch } from "react-icons/io";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../component/ui/form";
import Footer from "../components/home/Footer";
import { Sheet, SheetContent, SheetTrigger } from "../component/ui/sheet";
import { CarsSkeleton } from "../component/CarSkeleton";
import { Icons } from "../assests/Icons";
import {
  useGetAuctionsQuery,
  useFilterListingsMutation,
} from "../slices/apiSlices/carListingApiSlice";
import { socket } from "../slices/socketSlice";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { setBrowseAuctionCategory } from "../slices/adminFilter";
import SEO  from '../service/helmet';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../component/ui/pagination";

// Context for Search
const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

const searchSchema = z.object({
  search: z
    .string()
    .min(3, { message: "Search query cannot be empty" })
    .max(100, { message: "Search query is too long" }),
});

export const SearchComponent = () => {
  const { setSearchValue } = useSearch();

  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: "",
    },
  });

  const onSubmit = (data) => {
    setSearchValue(data.search);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="search" className="sr-only">
                Search
              </FormLabel>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <IoMdSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <FormControl>
                  <input
                    type="search"
                    id="search"
                    placeholder="Search auction cars..."
                    className="block h-10 p-2 w-80 rounded-full pl-10 text-sm text-gray-900   shadow-md outline-0 outline-none border-0 focus:ring-blue-500 focus:border-blue-500"
                    {...field}
                  />
                </FormControl>
                <Button
                  type="submit"
                  className="absolute  rounded-full right-0 bottom-0"
                  variant="btn"
                >
                  <IoMdSearch className="mx-2" /> Search
                </Button>
              </div>
              <FormMessage className="text-white" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

const BrowseCars = React.lazy(() => import("../components/home/BrowseCars"));

const BrowseAuctions = () => {
  const [searchValue, setSearchValue] = useState("");
  const [cars, setCars] = useState([]);
  const { filter } = useSelector((state) => state.filter);
  const [status, setStatus] = useState("live");
  const [page, setPage] = useState(1);
  const [totalFound, setTotalFound] = useState();
  
  const limit = 32;
  const dispatch = useDispatch();
  const { browseAuctionCategory } = useSelector((state) => state.adminFilter);

  const {
    data: Listings,
    isLoading,
    isError,
    error,
  } = useGetAuctionsQuery({ status, page, limit , category: browseAuctionCategory } );

  const [
    filterListings,
    { isLoading: filterLoading, isError: IsfilterError, error: filterError },
  ] = useFilterListingsMutation();

  useEffect(() => {
    setCars(Listings?.auctions);
    setTotalFound(Listings?.total);
  }, [Listings]);

  useEffect(() => {
    if (searchValue) {
      filterListings({ keyword: searchValue, page, limit , category: browseAuctionCategory},
      )
        .unwrap()
        .then((filteredCars) => {
          setCars(filteredCars?.cars);
          setPage(filteredCars?.page);
          setTotalFound(filteredCars?.totalCars);
        })
        .catch((error) => {
          console.error("Error filtering cars:", error);
        });
    } else {
      setCars(Listings?.auctions);
    }
  }, [searchValue, filterListings]);


  useEffect(() => {
    if (filter) {
      filterListings(filter , browseAuctionCategory )
        .unwrap()
        .then((filteredCars) => {
          setCars(filteredCars?.cars);
          setPage(filteredCars?.page);
          setTotalFound(filteredCars?.totalCars);
        })
        .catch((error) => {
          console.error("Error filtering cars:", error);
        });
    } else {
      setCars(Listings?.auctions);
    }
  }, [filter, filterListings]);


  useEffect(() => {
    socket.on("bidUpdated", (data) => {
      const { carId, bidAmount } = data;
      setCars((prevCars) =>
        prevCars.map((car) =>
          car._id === carId ? { ...car, highestBid: bidAmount } : car
        )
      );
    });

    return () => {
      socket.off("bidUpdated");
    };
  }, [cars]);

  // Handle button clicks to filter cars
  const handleStatusChange = (newStatus) => {
    if (newStatus === status) return;
    setStatus(newStatus);
  };

  // Handle pagination changes
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const title = "Browse Car Auctions | Find the Best Deals on Cars - nationwide-motors";
  const description =
    "Explore a wide range of car listings on nationwide-motors's Browse Auctions page. Discover the latest car deals, bid on your favorite models, and find the perfect car at competitive prices.";
  const image =
    "https://res.cloudinary.com/dgty4nzfo/image/upload/v1730488850/ProfileImages/wirvzf6r44ryuv7vckey.png";
  const url = "https://nationwide-motors.com/browse_auctions";
  const keywords =
    "browse car auctions, car listings, car auction platform, bid on cars, car deals, used car auctions, luxury car auctions, SUV auction, sedan auction, sports car auction, online car marketplace, auctioned cars, best car prices, find cars online";

  return (
    <SearchContext.Provider value={{ searchValue, setSearchValue }}>
      <SEO
        title={title}
        description={description}
        image={image}
        url={url}
        keywords={keywords}
      />
      <div className="min-h-screen font-inter">
        <MaxWidthWrapper>
          <Navbar className="absolute" />
        </MaxWidthWrapper>

        <div className="w-full">
          <div className="grid grid-rows-8 gap-2">
            <div className="flex gap-4 row-span-6">
              <Sheet>
                <SheetContent side="left">
                  <Filter />
                </SheetContent>

                <div className="flex-1 flex-col pt-24 min-h-screen h-full">
                  <div className="h-fit pb-2 z-10 pt-4 bg-richblue-200 sticky top-0 row-span-1 flex justify-center items-center">
                    <div className="h-full flex flex-col sm:flex-row justify-center items-center">
                      {/* Search Component */}
                      <SearchComponent />

                      <div className="flex gap-2 pb-2 items-center w-full mx-2 mt-2">
                        <div className="flex gap-2">
                          {/* Status Buttons */}
                          {/* <Button
                            variant={status === "all" ? "btn" : "secondary"}
                            onClick={() => handleStatusChange("all")}
                            className='rounded-full'
                          >
                            All
                          </Button> */}
                          <Button
                            variant={browseAuctionCategory === "cars" ? "btn" : "secondary"}
                            onClick={() => dispatch(setBrowseAuctionCategory("cars"))}
                            className="rounded-full"
                          >
                            Cars
                          </Button>
                          <Button
                            variant={browseAuctionCategory === "construction" ? "btn" : "secondary"}
                            onClick={() => dispatch(setBrowseAuctionCategory("construction"))}
                            className="rounded-full"
                          >
                            Classic Cars
                          </Button>

                          {/* <Button
                            variant={
                              status === "upcoming" ? "btn" : "secondary"
                            }
                            onClick={() => handleStatusChange("upcoming")}
                            className='rounded-full'

                          >
                            Upcoming
                          </Button> */}
                        </div>

                        <SheetTrigger asChild>
                          <Button
                            variant="secondary"
                            className="bg-gray-100 rounded-full flex justify-center items-center text-muted-foreground"
                          >
                            <Icons.filter className="flex justify-center mt-3 items-center m-0 h-10 w-10 text-muted-foreground" />
                            Filters
                          </Button>
                        </SheetTrigger>
                      </div>
                    </div>
                  </div>

                  <div className="w-full  flex-1 min-h-screen mt-10 justify-center  items-center">
                    <div className="flex items-start justify-start w-full pl-10 sm:pl-20 ">
                      <Button variant="btn" className="rounded-full ">  
                        {totalFound} Vehicles Found{" "}
                        <IoMdSearch className="ml-2" />
                      </Button>
                    </div>
                    <Suspense fallback={<CarsSkeleton count={32} />}>
                      <BrowseCars
                        cars={cars}
                        isLoading={isLoading || filterLoading}
                        isError={isError || IsfilterError}
                        error={error || filterError}
                      />
                    </Suspense>
                  </div>

                  {/* Pagination Controls */}
                  {/* <div className="flex justify-center mt-4">
                    <Button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="mx-2 my-2">
                      Page {page} of {Listings?.pages || 1}
                    </span>
                    <Button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === Listings?.pages}
                    >
                      Next
                    </Button>
                  </div> */}
                  <Pagination className="mt-6">
                    <PaginationContent>
                      {/* Previous Button */}
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            if (page === 1) {
                              e.preventDefault(); // Prevent click when on the first page
                            } else {
                              handlePageChange(page - 1);
                            }
                          }}
                          className={
                            page === 1 ? "text-gray-400 cursor-not-allowed" : ""
                          }
                        >
                          Previous
                        </PaginationPrevious>
                      </PaginationItem>

                      {/* Current Page Display */}
                      <PaginationItem>
                        <span className="mx-2 my-2">
                          Page {page} of {Listings?.pages || 1}
                        </span>
                      </PaginationItem>

                      {/* Next Button */}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            if (page === Listings?.pages) {
                              e.preventDefault();
                            } else {
                              handlePageChange(page + 1);
                            }
                          }}
                          className={
                            page === Listings?.pages
                              ? "text-gray-400 cursor-not-allowed"
                              : ""
                          }
                        >
                          Next
                        </PaginationNext>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </SearchContext.Provider>
  );
};

export default BrowseAuctions;
