import React, { useState, useEffect } from "react";
import { Input } from "../../component/ui/input";
import { Button } from "../../component/ui/button";
import { Icons } from "../../assests/Icons";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiConnector } from "../../service/apiconnector";
import { useFilterListingsMutation } from "../../slices/apiSlices/carListingApiSlice";
import { setFilterData } from "../../slices/filterSlice";
import { useDispatch, useSelector } from "react-redux";
import { Separator } from "../../component/ui/separator";
import { IoMdSearch } from "react-icons/io";
import MaxWidthWrapper from "../../component/MaxWidthWrapper";


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
  

export const FilterButton = ({ children, onRemove }) => {
  return (
    <Button
      variant="ghost"
      className="bg-richblue-50 flex gap-2 pr-[5px] hover:bg-richblue-50 justify-between items-center rounded-full"
    >
      <p>{children}</p>
      <div
        className="bg-richblue-100 h-8 w-8 flex justify-center hover:bg-richblue-100/90 cursor-pointer items-center rounded-full"
        onClick={onRemove}
      >
        <Icons.cross className="text-white h-6 w-6 " />
      </div>
    </Button>
  );
};

const Filter = ({ className }) => {
  const [fromYearSelected, setFromYearSelected] = useState(1986);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [bodyColors, setBodyColors] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState(null);
  const [filterListings, { isLoading, isError }] = useFilterListingsMutation();

  const { filter } = useSelector((state) => state.filter);

  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...filter,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiConnector("GET", process.env.REACT_APP_BASE_URL + "/api/metadata");
        console.log(result);
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
    if (data.price && !data.price.includes("-")) {
      if (data.price.startsWith(">")) {
        data.price = `${data.price.replace(">", "")}-Infinity`; // Convert to a range format
      }
    }

    dispatch(setFilterData(data));

    try {
      const response = await filterListings(data).unwrap();

      console.log("Filter response:", response);

      // Convert data to query string
      const queryString = Object.keys(data)
        .filter((key) => data[key] !== undefined && data[key] !== "")
        .map(
          (key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
        )
        .join("&");

    
    } catch (error) {
      console.error("Failed to filter listings:", error);
    }
  };

  return (
    <div className={cn("h-full", className)}>
      <div className="min-h-full h-full flex col-span-1 items-center">
        <div className="p-2 w-[350px] flex flex-col justify-center items-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Keyword */}
              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keyword</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Write your keyword"
                        className="w-[280px] bg-richblue-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Make */}
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleMakeChange(value);
                        }}
                      >
                        <SelectTrigger className="w-[280px] bg-richblue-50">
                          <SelectValue placeholder="Select a make" />
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

              {/* Model */}
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-[280px] bg-richblue-50">
                          <SelectValue placeholder="Select a model" />
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

              <div className="grid grid-cols-2 gap-2">
                {/* From Year */}
                <FormField
                  control={form.control}
                  name="fromyear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setFromYearSelected(Number(value)); // Update fromYear state
                          }}
                          value={field.value} // Use value directly from form state
                        >
                          <SelectTrigger className="bg-richblue-50">
                            <SelectValue placeholder="Select a year" />
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
                      <FormLabel>Till</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value} // Use value from form state
                        >
                          <SelectTrigger className="bg-richblue-50">
                            <SelectValue placeholder="Select a year" />
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

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Range</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-[280px] bg-richblue-50">
                          <SelectValue placeholder="Select a price range" />
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

              {/* Mileage */}
              <FormField
                control={form.control}
                name="kms_driven"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mileage (in km)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter mileage"
                        type="number"
                        {...field}
                        className="w-[280px] bg-richblue-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Body Type */}
              <FormField
                control={form.control}
                name="bodyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-[280px] bg-richblue-50">
                          <SelectValue placeholder="Select body type" />
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

              <Button type="submit" className="w-full">
                Apply Filters
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Filter;

