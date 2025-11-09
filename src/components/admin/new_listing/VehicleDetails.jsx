import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import { Button } from "../../../component/ui/button";
import { Separator } from "../../../component/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../component/ui/form";
import { Input } from "../../../component/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../component/ui/select";
import { useCreateListingMutation } from "../../../slices/apiSlices/carListingApiSlice";
import { toast } from "../../../component/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Checkbox } from "../../../component/ui/checkbox";

// Updated Zod schema to include category and subcategory
const vehicleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((value) => !isNaN(Number(value)), "Price must be a number"),
  category: z
    .union([
      z.enum(["cars", "construction"]),
      z.literal(""), // Allow an empty string initially
    ])
    .refine((value) => value !== "", { message: "Category is required" }),
  subcategory: z.string().optional(),
  isBuyNow: z.boolean().optional(),
  isForUsa: z.boolean().optional(),
  buyNowPrice: z.string().optional(),
  startTime: z
    .string()
    .min(1, "Start Time is required")
    .refine(
      (value) => {
        const today = new Date();
        const startTimeDate = new Date(value);
        return startTimeDate >= today;
      },
      { message: "Start Time cannot be in the past" }
    ),
  endTime: z
    .string()
    .min(1, "End Time is required")
    .refine(
      (value, ctx) => {
        const startTime = ctx?.parent?.startTime
          ? new Date(ctx.parent.startTime)
          : null;
        const endTimeDate = new Date(value);
        return startTime ? endTimeDate > startTime : true;
      },
      { message: "End Time must be after Start Time" }
    ),
  minimumBidDifference: z
    .string()
    .min(1, "Minimum Bid Difference is required")
    .refine(
      (value) => !isNaN(Number(value)) && Number(value) > 0,
      "Minimum Bid Difference must be a positive number"
    ),
});

// Subcategory options for construction equipment
const constructionSubcategories = [
  "Skid Steers",
  "Mini Excavators",
  "Excavators",
  "Forklifts",
  "Lifts",
  "Dozers",
  "Wheel Loaders",
  "Loader Backhoes",
];

const VehicleDetails = (newListing) => {
  const editor = useRef(null);
  const { id } = useParams();
  const [buyNow, setBuyNow] = useState(
    newListing?.data?.buyNow?.isBuyNow || false
  );
  const [selectedCategory, setSelectedCategory] = useState(
    newListing?.data?.category?.type || ""
  );

  // JoditEditor config
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
      toolbar: true,
      toolbarSticky: false,
      toolbarButtonSize: "middle",
      removeButtons: [
        "print",
        "about",
        "fullsize",
        "source",
        "image",
        "video",
        "file",
        "cut",
        "copy",
        "paste",
        "selectall",
        "redo",
        "undo",
      ],
      height: 300,
      width: 384,
      fontFamily: "arial",
      buttons: ["bold", "italic", "underline", "link", "ul", "ol"],
    }),
    []
  );

  const [createListing, { isLoading, isSuccess, isError, error, data }] =
    useCreateListingMutation();
  const navigate = useNavigate();

  // React Hook Form setup with Zod validation
  const form = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: newListing?.data?.name || "",
      description: newListing?.data?.description || "",
      price: String(newListing?.data?.price) || "",
      category: newListing?.data?.category?.type || "",
      subcategory: newListing?.data?.category?.subcategory || "",
      isBuyNow: newListing?.data?.buyNow?.isBuyNow || false,
      isForUsa: newListing?.data?.isForUsa || false,
      buyNowPrice: newListing?.data?.buyNow?.buyNowPrice
        ? String(newListing?.data?.buyNow?.buyNowPrice)
        : "" || "",
      startTime: newListing?.data?.startTime
        ? new Date(newListing.data.startTime).toISOString().slice(0, -8)
        : "",
      endTime: newListing?.data?.endTime
        ? new Date(newListing.data.endTime).toISOString().slice(0, -8)
        : "",
      minimumBidDifference:
        String(newListing?.data?.minimumBidDifference) || "100",
    },
  });

  // Form submission handler
  const onSubmit = async (data) => {
    console.log(data);

    if (id) {
      data.id = id;
    }

    //validate the subCategory
    if (data.category === "construction" && !data.subcategory) {
      form.setError("subcategory", {
        type: "manual",
        message: "Subcategory is required",
      });
      return;
    }

    // Validate time fields
    if (
      data.endTime &&
      data.startTime &&
      new Date(data.endTime) <= new Date(data.startTime)
    ) {
      form.setError("endTime", {
        type: "manual",
        message: "End Time must be later than Start Time",
      });
      return;
    }

    if (data.isBuyNow && (!data.buyNowPrice || data.buyNowPrice === "")) {
      form.setError("buyNowPrice", {
        type: "manual",
        message: "Buy Now Price is required",
      });
      return;
    }

    if (!data.isBuyNow) {
      data.buyNowPrice = "";
    }

    try {
        await createListing({
        formData: data,
        step: "1",
      }).unwrap();

      toast({
        title: "Car listing created successfully",
        description: "See the listing in draft in all listings",
      });

      form.reset();

      navigate("/admin/all_listings");
    } catch (err) {
      toast({
        title: "Failed to create listing",
        description:
          err?.data.message ||
          data.message ||
          "An error occurred while creating the listing. Please try again later.",
        variant: "destructive",
      });

      console.error(err);
    }
  };



  return (
    <div className="my-10">
      <div className="flex w-full justify-center items-center flex-col gap-2">
        <div className="text-3xl font-bold font-inter">Set Vehicle Details</div>
        <Separator className="mt-2 w-80" />
      </div>

      <div className="flex w-full my-6 justify-center items-center flex-col gap-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 font-normal text-base justify-center items-center"
          >
            {/* Category Field */}
            <FormField
              name="category"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Category</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCategory(value);
                      // Reset subcategories when category changes
                      form.setValue("subcategories", []);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-96">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cars">Cars</SelectItem>
                      <SelectItem value="construction">
                        Construction Equipment
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subcategory Field (only show for construction) */}
            {selectedCategory === "construction" && (
              <FormField
                name="subcategory"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Construction Equipment Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-96">
                          <SelectValue placeholder="Select equipment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {constructionSubcategories.map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {subcategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-start w-full">
              {/* Price Field */}
              <FormField
                name="isForUsa"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex justify-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          setBuyNow(checked);
                        }}
                      />
                    </FormControl>
                    <FormLabel>
                      List in USA (This listing will be visible on the USA site)
                    </FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Remaining fields remain the same as in the original code */}
            {/* Name Field */}
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter vehicle name"
                      className="border-[1px] ring-0 rounded-md p-6 w-96 focus:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <JoditEditor
                      ref={editor}
                      value={field.value || ""}
                      config={config}
                      tabIndex={1}
                      onBlur={(newContent) => field.onChange(newContent)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Field */}
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price"
                      className="border-[1px] ring-0 rounded-md p-6 w-96 focus:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Time Field */}
            <FormField
              name="startTime"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      min={new Date().toISOString().slice(0, -8)}
                      className="border-[1px] ring-0 rounded-md p-6 w-96 focus:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Time Field */}
            <FormField
              name="endTime"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className="border-[1px] ring-0 rounded-md p-6 w-96 focus:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Minimum Bid Difference Field */}
            <FormField
              name="minimumBidDifference"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Bid Difference</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      className="border-[1px] ring-0 rounded-md p-6 w-96 focus:outline-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-start w-full">
              {/* Price Field */}
              <FormField
                name="isBuyNow"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex justify-start space-x-3 space-y-0">
                    <FormLabel>Buy Now</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          setBuyNow(checked);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {buyNow && (
              <FormField
                name="buyNowPrice"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Buy Now Price</FormLabel> */}
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter price for buy now"
                        className="border-[1px] ring-0 rounded-md p-6 w-96 focus:outline-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="grid grid-cols-2 w-96 gap-10 mt-8">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <span className="loader"></span> : "Next"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VehicleDetails;
