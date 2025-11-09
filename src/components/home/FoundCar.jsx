import React, { useState, useEffect } from "react";
import MaxWidthWrapper from "../../component/MaxWidthWrapper";
import { Input } from "../../component/ui/input";
import { Button, buttonVariants } from "../../component/ui/button";
import { toast } from "../../component/ui/use-toast"; // Assuming toast is available in your project
import { Icons } from "../../assests/Icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useGetAuctionsQuery,
  useFilterListingsMutation,
} from "../../slices/apiSlices/carListingApiSlice";
import CarCards from "./CarCards";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { cn } from "../../lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../component/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../component/ui/select";
import Img15 from "../../assests/img15.png";
import { apiConnector } from "../../service/apiconnector";
import { setFilterData } from "../../slices/filterSlice";
import { useDispatch, useSelector } from "react-redux";
import { Separator } from "../../component/ui/separator";
import { IoMdSearch } from "react-icons/io";
import { CarsSkeleton } from "../../component/CarSkeleton";
import { Link } from "react-router-dom";
import { setBrowseAuctionCategory } from "../../slices/adminFilter";

const formSchema = z
  .object({
    keyword: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    fromyear: z
      .string()
      .optional()
      .refine((value) => value === undefined || !isNaN(Number(value)), {
        message: "From year must be a valid year.",
      }),
    tillyear: z
      .string()
      .optional()
      .refine((value) => value === undefined || !isNaN(Number(value)), {
        message: "Till year must be a valid year.",
      }),
    price: z.string().optional(),
    kms_driven: z
      .string()
      .optional()
      .refine((value) => value === undefined || !isNaN(Number(value)), {
        message: "Mileage must be a valid number.",
      }),
    bodyType: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.fromyear && data.tillyear) {
        return Number(data.tillyear) > Number(data.fromyear);
      }
      return true; // If either is not present, skip the comparison
    },
    {
      message: "Till year must be greater than from year.",
      path: ["tillyear"],
    }
  );

const FoundCar = () => {
  const [status, setStatus] = useState("live");
  const [page, setPage] = useState(1);
  const limit = 12;
  const [cars, setCars] = useState([]);
  const [fromYearSelected, setFromYearSelected] = useState(1986);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [bodyColors, setBodyColors] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState(null);
  const [
    filterListings,
    { isLoading: fiiterLoading, isError: IsfilterError, error: filterError },
  ] = useFilterListingsMutation();
  const {browseAuctionCategory} = useSelector((state) => state.adminFilter);
  const {
    data: Listings,
    isLoading,
    isError,
    error,
  } = useGetAuctionsQuery({ status, page, limit , category: browseAuctionCategory });
  const dispatch = useDispatch();
  const [totalFound, setTotalFound] = useState(Listings?.total);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiConnector(
          "GET",
          process.env.REACT_APP_BASE_URL + "/api/metadata"
        );
        const data = result.data.data[0];
        setMakes(data.MakesModels);
        setBodyColors(data.BodyColors);
        setBodyTypes(data.BodyTypes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleMakeChange = (makeId) => {
    const selected = makes.find((make) => make.Make === makeId);
    setModels(selected ? selected.Models : []);
    setSelectedMake(makeId);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1986 + 1 },
    (_, i) => 1986 + i
  );

  const onSubmit = async (data) => {
    try {
      filterListings({ ...data, limit , category: browseAuctionCategory })
        .unwrap()
        .then((filteredCars) => {
          setCars(filteredCars?.cars);
          setPage(filteredCars?.page);
          setTotalFound(filteredCars?.totalCars);
        });
    } catch (filterError) {
      toast({
        title: "Error",
        description: filterError?.data?.message || "Failed to filter listings.",
        status: "error",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (Listings?.auctions) {
      setCars(Listings?.auctions);
      setTotalFound(Listings?.total);
    }
    if (isError) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to load auctions.",
        status: "error",
        variant: "destructive",
      });
    }
  }, [Listings, isError, error]);

  return (
    <div className="overflow-x-hidden">
      <div className="h-full w-full">
        <div className="min-h-full w-full h-full flex items-center">
          <div className="p-2 w-full flex justify-center  items-center">
            <Form {...form} className="w-full flex">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-center shadow rounded-md p-4 justify-center"
              >
                {/* Make */}
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel className="text-muted-foreground flex justify-center">
                        Make
                      </FormLabel> */}
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleMakeChange(value);
                          }}
                        >
                          <SelectTrigger className="w-[150px]  border-none  ring-0 focus:outline-0 focus:inset-0  focus:ring-0 outline-0 h-14">
                            <SelectValue placeholder="Make" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Makes</SelectLabel>
                              {makes.map((type) => (
                                <SelectItem key={type._id} value={type.Make}>
                                  {type.Make}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <Separator orientation = "vertical" className='h-14'  /> */}
                {/* Model */}
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel className="text-muted-foreground flex justify-center">
                      Model
                      </FormLabel> */}
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger className="w-[150px] h-14 border-none ring-0 focus:outline-0 focus:inset-0  focus:ring-0">
                            <SelectValue placeholder="Model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Models</SelectLabel>
                              {models.map((model) => (
                                <SelectItem key={model} value={model}>
                                  {model}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <Separator  orientation = "vertical" className='h-14' /> */}

                <div className="flex w-[150px] gap-2">
                  {/* From Year */}
                  <FormField
                    control={form.control}
                    name="fromyear"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel className="text-muted-foreground flex justify-center">
                      From
                        </FormLabel> */}
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setFromYearSelected(Number(value)); // Update fromYear state
                            }}
                            value={field.value} // Use value directly from form state
                          >
                            <SelectTrigger className=" h-14 w-[75px] border-none ring-0 focus:outline-0 focus:inset-0  focus:ring-0">
                              <SelectValue placeholder="From" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>From Year</SelectLabel>
                                {years.map((year) => (
                                  <SelectItem key={year} value={String(year)}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Till Year */}
                  <FormField
                    control={form.control}
                    name="tillyear"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel className="text-muted-foreground flex justify-center">
                      Till
                        </FormLabel> */}
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value} // Use value from form state
                          >
                            <SelectTrigger className=" h-14 w-[75px] border-none ring-0 focus:outline-0 focus:inset-0  focus:ring-0">
                              <SelectValue placeholder="Till" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Till Year</SelectLabel>
                                {years
                                  .filter((year) => year > fromYearSelected) // Only show years greater than fromYearSelected
                                  .map((year) => (
                                    <SelectItem key={year} value={String(year)}>
                                      {year}
                                    </SelectItem>
                                  ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* <Separator orientation = "vertical" className='h-14' /> */}

                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel className="text-muted-foreground flex justify-center">
                      Price Range
                      </FormLabel> */}
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger className="w-[150px] h-14 border-none ring-0 focus:outline-0 focus:inset-0  focus:ring-0">
                            <SelectValue placeholder="Price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Price Range</SelectLabel>
                              <SelectItem value="0-3000">$0 - $3000</SelectItem>
                              <SelectItem value="3000-5000">
                                $3000 - $5000
                              </SelectItem>
                              <SelectItem value="5000-10000">
                                $5000 - $10000
                              </SelectItem>
                              <SelectItem value="10000-15000">
                                $10000 - $15000
                              </SelectItem>
                              <SelectItem value="15000-20000">
                                $15000 - $20000
                              </SelectItem>
                              <SelectItem value=">20000">
                                More than $20000
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <Separator orientation = "vertical" className='h-14'  /> */}

                {/* Body Type */}
                <FormField
                  control={form.control}
                  name="bodyType"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel className="text-muted-foreground flex justify-center">
                      Body Type
                      </FormLabel> */}
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger className="w-[150px] h-14 border-none ring-0 focus:outline-0 focus:inset-0  focus:ring-0">
                            <SelectValue placeholder="Body Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Body Type</SelectLabel>
                              {bodyTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <Separator  orientation = "vertical" className='h-14'  /> */}

                <Button
                  variant="btn"
                  type="submit"
                  className="w-full h-12 mt-4"
                >
                  <IoMdSearch className="mr-2" />
                  Search
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <div className="font-inter gap-6">
        <div className="flex flex-col items-center mt-10">
          <div className="flex items-start justify-start w-full ml-14">
            <Link to='/browse_auctions'>
            <Button variant="btn" className="rounded-full ">
              Show {totalFound} Vehicles <IoMdSearch className="ml-2" />
            </Button>
            </Link>
          
          </div>

          {/* Car Cards */}
          <div className="mt-4">
            <div>
              {isLoading || fiiterLoading ? (
                <CarsSkeleton count={12} />
              ) : isError || IsfilterError ? (
                <p>
                  {error?.data?.message ||
                    filterError?.data?.message ||
                    "Failed to load cars."}
                </p>
              ) : (
                <div className="flex justify-center items-center" >
                  {cars.length > 0 ? (
                    <div className="grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {cars.map((car) => (
                        <Link
                          className="flex justify-center items-center"
                          key={car._id}
                          to={`browse_auctions/car_details/${car._id}`}
                        >
                          <CarCards car={car} />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-full flex justify-center items-center">
                      <NoSearchFound />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {/* <div className='mt-6'>
            <Pagination
              currentPage={page}
              totalPages={Math.ceil((Listings?.total || 1) / limit)}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default FoundCar;

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-center items-center space-x-4">
      <Button onClick={handlePrevious} disabled={currentPage === 1}>
        <MdOutlineKeyboardDoubleArrowLeft />
      </Button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <Button onClick={handleNext} disabled={currentPage === totalPages}>
        <MdOutlineKeyboardDoubleArrowRight />
      </Button>
    </div>
  );
};

const NoSearchFound = () => {
  return (
    <div className="w-full flex flex-col gap-2 justify-center items-center">
      <div className="w-24">
        <img src={Img15} alt="not search" />
      </div>

      <div className="text-3xl font-medium">No Results Found</div>
      <div className="text-muted-foreground">
        Please try searching with another terms .{" "}
      </div>
    </div>
  );
};
