import React, { useState, useEffect } from "react";
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
import { Checkbox } from "../../../component/ui/checkbox";
import { Label } from "../../../component/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../component/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../component/ui/select";
import { useSelector, useDispatch } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateListingMutation } from "../../../slices/apiSlices/carListingApiSlice";
import { toast } from "../../../component/ui/use-toast";
import { apiConnector } from "../../../service/apiconnector";
import { useListingByIdQuery } from "../../../slices/apiSlices/carListingApiSlice";
import { set } from "date-fns";

const vehicleSchema = z.object({
  registration_year: z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === "") return undefined;
      return typeof val === "string" ? Number(val) : val;
    },
    z
      .number()
      .optional()
      .refine((val) => val === undefined || val > 1885, {
        message: "Registration year must be valid",
      })
  ),
  
  make: z.string().optional(),
  model: z.string().optional(),
  trim: z.string().optional(),
  kms_driven: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z
      .number()
      .optional()
      .refine(
        (val) => val === undefined || (Number.isInteger(val) && val >= 0),
        {
          message: "KMs driven must be a non-negative integer",
        }
      )
  ),
  no_of_owners: z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === "") return undefined;
      return typeof val === "string" ? Number(val) : val;
    },
    z
      .number()
      .optional()
      .refine((val) => val === undefined || val >= 1, {
        message: "Minimum owner should be one",
      })
  ),
  
  
  fuel_type: z.string().optional(),
  transmission: z.string().optional(),
  body_type: z.string().optional(),
  color: z.string().optional(),
  location: z.string().optional(),
  mileage: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z
      .number()
      .optional()
      .refine((val) => val === undefined || val >= 0, {
        message: "Mileage must be a non-negative number",
      })
  ),
});

const VehicleDetails = () => {
  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Lpg"];
  const transmissions = ["Manual", "Automatic"];

  const [bodyTypes, setBodyTypes] = useState([]);
  const [bodyColors, setBodyColors] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [newListing, setNewListing] = useState();
  const [constructionMakesModels, setConstructionMakesModels] = useState([]);
  const [carsMakesModels, setCarsMakesModels] = useState([]);
  const [constructionType, setConstructionType] = useState(null);

  const handleMakeChange = (makeId) => {
    const selected = makes.find((make) => make.Make === makeId);
    setModels(selected ? selected.Models : []);
    // setSelectedMake(selected?.Make);
  };

  const navigate = useNavigate();

  const { id } = useParams();
  const [createListing, { isLoading , isSuccess, isError, error, data }] =
    useCreateListingMutation();
  const { data: carData } = useListingByIdQuery(id);

  useEffect(() => {
    setNewListing(carData?.Listing);
  }, [carData]);

  const [showInputs, setShowInputs] = useState({
    registration_year: false,
    make: false,
    model: false,
    trim: false,
    kms_driven: false,
    no_of_owners: false,
    fuel_type: false,
    transmission: false,
    body_type: false,
    color: false,
    location: false,
    mileage: false,
  });

  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState("");
  const [newValue, setNewValue] = useState("");
  const [techfeatures, setTechFeatures] = useState([]);
  const [damages, SetDamages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiConnector(
          "GET",
          process.env.REACT_APP_BASE_URL + "/api/metadata"
        );

        const data = result.data.data[0];

        setConstructionMakesModels(data.ConstructionMakesModels);
        setCarsMakesModels(data.MakesModels);

        setBodyColors(data.BodyColors);
        setBodyTypes(data.BodyTypes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {

    if (newListing?.category) {
      const type = newListing?.category?.type;
      if (type === "construction") {
        const selected = constructionMakesModels.find((make) => 
          make.type?.trim().toLowerCase() === newListing?.category?.subcategory?.trim().toLowerCase()
        );
        setMakes(selected ? selected.makes : []);
      }
      if(type === "cars"){
        setMakes(carsMakesModels)
      }

    }

  }, [newListing , constructionMakesModels , carsMakesModels]);



  useEffect(() => {
    if (newListing?.vehicleFeatures?.vehicleInformation) {
      const updatedShowInputs = { ...showInputs };

      Object.keys(newListing.vehicleFeatures.vehicleInformation).forEach(
        (key) => {
          if (updatedShowInputs.hasOwnProperty(key)) {
            updatedShowInputs[key] = true;
          }
        }
      );
      setShowInputs(updatedShowInputs);
    }

    if (newListing?.vehicleFeatures?.vehicleInformation?.make) {
      const make = newListing?.vehicleFeatures?.vehicleInformation?.make;
      handleMakeChange(make);
    }

    if (newListing?.vehicleFeatures?.optionsFeature) {
      setFeatures(newListing?.vehicleFeatures?.optionsFeature);
    }

    if (newListing?.vehicleFeatures?.technicalFeature) {
      setTechFeatures(newListing?.vehicleFeatures?.technicalFeature);
    }
    

    if(newListing?.vehicleFeatures?.vehicleInformation?.make){
      const selected = makes?.find((make) => make.Make.trim().toLowerCase() === newListing?.vehicleFeatures?.vehicleInformation?.make.trim().toLowerCase() );
      setModels(selected ? selected.Models : []);   
     }

    if (newListing?.vehicleFeatures?.damages) {
      SetDamages(newListing?.vehicleFeatures?.damages);
    }
  }, [newListing, carData , makes]);

  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };

  const handleAddFeature = (e) => {
    e.stopPropagation();
    if (newFeature && newValue) {
      setFeatures([...features, { feature: newFeature, value: newValue }]);
      setNewFeature(""); // Clear the input after adding
      setNewValue("");
    }
  };

  const handleAddTechFeature = (e) => {
    e.stopPropagation();
    if (newFeature && newValue) {
      setTechFeatures([
        ...techfeatures,
        { feature: newFeature, value: newValue },
      ]);
      setNewFeature("");
      setNewValue("");
    }
  };

  const handleAddDamages = (e) => {
    e.stopPropagation();
    if (newFeature && newValue) {
      SetDamages([...damages, { feature: newFeature, value: newValue }]);
      setNewFeature("");
      setNewValue("");
    }
  };

  const form = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      ...newListing?.vehicleFeatures?.vehicleInformation,
    },
  });

  const { setValue } = form;

  useEffect(() => {
    if (newListing) {
      setValue(
        "registration_year",
        newListing?.vehicleFeatures?.vehicleInformation.registration_year || ""
      );
      setValue(
        "make",
        newListing?.vehicleFeatures?.vehicleInformation.make || ""
      );
      setValue(
        "model",
        newListing?.vehicleFeatures?.vehicleInformation.model || ""
      );
      setValue(
        "trim",
        newListing?.vehicleFeatures?.vehicleInformation.trim || ""
      );
      setValue(
        "kms_driven",
        newListing?.vehicleFeatures?.vehicleInformation.kms_driven || ""
      );
      setValue(
        "no_of_owners",
        newListing?.vehicleFeatures?.vehicleInformation.no_of_owners || ""
      );
      setValue(
        "fuel_type",
        newListing?.vehicleFeatures?.vehicleInformation.fuel_type || ""
      );
      setValue(
        "transmission",
        newListing?.vehicleFeatures?.vehicleInformation.transmission || ""
      );
      setValue(
        "body_type",
        newListing?.vehicleFeatures?.vehicleInformation.body_type || ""
      );
      setValue(
        "color",
        newListing?.vehicleFeatures?.vehicleInformation.color || ""
      );
      setValue(
        "location",
        newListing?.vehicleFeatures?.vehicleInformation.location || ""
      );
      setValue(
        "mileage",
        newListing?.vehicleFeatures?.vehicleInformation.mileage || ""
      );
    }
  }, [newListing, setValue]);

  const onSubmit = async (data) => {

  const cleanedData = Object.fromEntries(
  Object.entries(data).filter(([_, value]) => value !== "" && value !== undefined && value !== 0)
);


    console.log(data)
    console.log(cleanedData)

    const updatedListing = {
      vehicleInformation: cleanedData,
      features,
      techfeatures,
      damages,
      id,
    };

    console.log(updatedListing);

    try {
      // Call the mutation and wait for the response
      const response = await createListing({
        formData: updatedListing,
        step: "2",
      }).unwrap();

      // Check if the response was successful
      toast({
        title: "Car Feature Created Successfully",
      });

      navigate(`/admin/all_listings/draft/vehicle/${id}`);

      // console.log(response);
    } catch (err) {
      // Handle errors and display a toast notification
      toast({
        title: "Failed to Submit Feature",
        description:
          err.message ||
          data.message ||
          "An error occurred while Creating the Feature. Please try again later.",
        variant: "destructive",
      });

      console.error(err);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex w-full justify-center items-center flex-col gap-2">
        <div className="text-3xl font-bold font-inter">
          Set Vehicle Features
        </div>
        <Separator className="my-4 w-80" />
      </div>

      <div className="flex w-full my-6  justify-center items-center flex-col gap-2">
        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 font-normal w-80 text-base"
          >
            {/* Render checkboxes and input fields dynamically */}
            {Object.keys(showInputs).map((field) => (
              <div key={field}>
                {/* Checkbox */}
                <Label className="flex mb-2 items-center">
                  <Checkbox
                    checked={showInputs[field]}
                    onCheckedChange={(checked) => {
                      setShowInputs((prev) => ({
                        ...prev,
                        [field]: checked,
                      }));
                    }}
                    className="mr-2"
                  />
                  <span
                    className={`${
                      showInputs[field] ? "" : "text-muted-foreground"
                    }`}
                  >
                    Show {field.replace("_", " ")}
                  </span>
                </Label>

                {/* Conditionally Render Input Field */}
                {showInputs[field] && (
                  <FormField
                    control={form.control}
                    name={field}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormControl>
                          {field === "fuel_type" ? (
                            <Select
                              value={form.watch(field)}
                              onValueChange={formField.onChange}
                              // {...formField}
                              className="border-[1px] ring-0 mt-2 rounded-md p-2  focus:outline-0"
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={`Select ${field.replace(
                                    "_",
                                    " "
                                  )}`}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {fuelTypes.map((type) => (
                                    <SelectItem
                                      key={type}
                                      value={type.toLowerCase()}
                                    >
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          ) : field === "transmission" ? (
                            <Select
                              // {...formField}
                              onValueChange={formField.onChange}
                              value={form.watch(field)}
                              className="border-[1px] ring-0 mt-2 rounded-md p-2  focus:outline-0"
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={`Select ${field.replace(
                                    "_",
                                    " "
                                  )}`}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {transmissions.map((type) => (
                                    <SelectItem
                                      key={type}
                                      value={type.toLowerCase()}
                                    >
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          ) : field === "body_type" ? (
                            <Select
                              value={form.watch(field)} // Watch the field to dynamically reflect the value
                              onValueChange={formField.onChange} // Update form state on change
                              className="border-[1px] ring-0 mt-2 rounded-md p-2 focus:outline-0"
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={`Select ${field.replace(
                                    "_",
                                    " "
                                  )}`}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {bodyTypes.map((type) => (
                                    <SelectItem
                                      key={type}
                                      value={type.toLowerCase()}
                                    >
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          ) : field === "make" ? (
                            <Select
                              // {...formField}
                              // onValueChange={formField.onChange}
                              onValueChange={(value) => {
                                formField.onChange(value);
                                handleMakeChange(value);
                              }}
                              value={form.watch(field) }
                              className="border-[1px] ring-0 mt-2 rounded-md p-2   focus:outline-0"
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={`Select ${field.replace(
                                    "_",
                                    " "
                                  )}`}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {makes.map((type) => (
                                    <SelectItem
                                      key={type._id}
                                      value={type.Make}
                                    >
                                      {type.Make}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          ) : field === "model" ? (
                            <Select
                              // {...formField}
                              onValueChange={formField.onChange}
                              value={form.watch(field)}
                              className="border-[1px] ring-0 mt-2 rounded-md p-2  focus:outline-0"
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={`Select ${field.replace(
                                    "_",
                                    " "
                                  )}`}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {models.map((model) => (
                                    <SelectItem key={model} value={model}>
                                      {model}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              type={
                                [
                                  "registration_year",
                                  "kms_driven",
                                  "mileage",
                                  "no_of_owners",
                                ].includes(field)
                                  ? "number"
                                  : "text"
                              }
                              {...formField}
                              className="mt-2"
                              placeholder={`Enter ${field.replace("_", " ")}`}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            ))}

            <Separator className="my-4 w-80" />

            <div>
              <Tabs defaultValue="options" className="w-96">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="options">Options Features</TabsTrigger>
                  <TabsTrigger value="technical">Technical Feature</TabsTrigger>
                  <TabsTrigger value="damages">Damages</TabsTrigger>
                </TabsList>

                <TabsContent value="options">
                  <div className="grid grid-cols-9 w-96 mt-8 justify-center items-center gap-2">
                    <div className="col-span-1 flex h-full justify-center items-center">
                      <Button
                        variant="rounded"
                        type="button"
                        className="w-8 h-8"
                        onClick={(e) => handleAddFeature(e)}
                      >
                        {/* <FaPlus /> */}+
                      </Button>
                    </div>
                    <Input
                      type="text"
                      placeholder="Enter Feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="border-[1px] col-span-4 ring-0 mt-2 rounded-md p-6 focus:outline-0"
                    />
                    <Input
                      type="text"
                      placeholder="Enter Value"
                      className="border-[1px] col-span-4 ring-0 mt-2 rounded-md p-6 focus:outline-0"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                    />
                  </div>
                  {features?.length > 0 && (
                    <div className=" mt-8 relative">
                      <table className="table-fixed font-inter min-w-full ">
                        <thead>
                          <tr>
                            <th className="px-4 py-2  border-b border-gray-300">
                              Feature
                            </th>
                            <th className=" px-4 py-2 border-b border-gray-300">
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {features.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-sm font-medium border-b border-gray-300">
                                {item.feature}
                              </td>
                              <td className="px-4 py-2 border-b text-sm font-semibold border-gray-300">
                                {item.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="absolute top-0 right-0">
                        <Button
                          variant="rounded"
                          type="button"
                          className="w-8 h-8 p-0"
                          onClick={(e) => setFeatures([])}
                        >
                          <RxCross2 className="text-white font-semibold text-2xl" />
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="technical">
                  <div className="grid grid-cols-9 w-96 mt-8 justify-center items-center gap-2">
                    <div className="col-span-1 flex h-full justify-center items-center">
                      <Button
                        variant="rounded"
                        type="button"
                        className="w-8 h-8"
                        onClick={(e) => handleAddTechFeature(e)}
                      >
                        {/* <FaPlus /> */}+
                      </Button>
                    </div>
                    <Input
                      type="text"
                      placeholder="Enter Feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="border-[1px] col-span-4 ring-0 mt-2 rounded-md p-6 focus:outline-0"
                    />
                    <Input
                      type="text"
                      placeholder="Enter Value"
                      className="border-[1px] col-span-4 ring-0 mt-2 rounded-md p-6 focus:outline-0"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                    />
                  </div>
                  {techfeatures?.length > 0 && (
                    <div className=" mt-8 relative">
                      <table className="table-fixed font-inter min-w-full ">
                        <thead>
                          <tr>
                            <th className="px-4 py-2  border-b border-gray-300">
                              Feature
                            </th>
                            <th className=" px-4 py-2 border-b border-gray-300">
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {techfeatures.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-sm font-medium border-b border-gray-300">
                                {item.feature}
                              </td>
                              <td className="px-4 py-2 border-b text-sm font-semibold border-gray-300">
                                {item.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="absolute top-0 right-0">
                        <Button
                          variant="rounded"
                          type="button"
                          className="w-8 h-8 p-0"
                          onClick={(e) => setTechFeatures([])}
                        >
                          <RxCross2 className="text-white font-semibold text-2xl" />
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="damages">
                  <div className="grid grid-cols-9 w-96 mt-8 justify-center items-center gap-2">
                    <div className="col-span-1 flex h-full justify-center items-center">
                      <Button
                        variant="rounded"
                        type="button"
                        className="w-8 h-8"
                        onClick={(e) => handleAddDamages(e)}
                      >
                        {/* <FaPlus /> */}+
                      </Button>
                    </div>
                    <Input
                      type="text"
                      placeholder="Enter Feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="border-[1px] col-span-4 ring-0 mt-2 rounded-md p-6 focus:outline-0"
                    />
                    <Input
                      type="text"
                      placeholder="Enter Value"
                      className="border-[1px] col-span-4 ring-0 mt-2 rounded-md p-6 focus:outline-0"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                    />
                  </div>
                  {damages?.length > 0 && (
                    <div className=" mt-8 relative">
                      <table className="table-fixed font-inter min-w-full ">
                        <thead>
                          <tr>
                            <th className="px-4 py-2  border-b border-gray-300">
                              Feature
                            </th>
                            <th className=" px-4 py-2 border-b border-gray-300">
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {damages.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-sm font-medium border-b border-gray-300">
                                {item.feature}
                              </td>
                              <td className="px-4 py-2 border-b text-sm font-semibold border-gray-300">
                                {item.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="absolute top-0 right-0">
                        <Button
                          variant="rounded"
                          type="button"
                          className="w-8 h-8 p-0"
                          onClick={(e) => SetDamages([])}
                        >
                          <RxCross2 className="text-white font-semibold text-2xl" />
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            <div className="grid grid-cols-2 w-96 gap-10 mt-8">
              <Button type="button" onClick={goBack} variant="secondary">
                Back
              </Button>
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

{
  /* <Input
type="text"
placeholder={Enter ${field.replace("_", " ")}}
className="border-[1px] ring-0 mt-2 rounded-md p-2 w-80 focus:outline-0"
{...formField}
/> */
}
