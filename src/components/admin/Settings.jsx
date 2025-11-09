import Dashboard from "./Dashboard";
import MaxWidthWrapper from "../../component/MaxWidthWrapper";
import { Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "../../component/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../service/apiconnector";
import { Button } from "../../component/ui/button";
import { Icons } from "../../assests/Icons";
import { BiImage } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { setSignUpData } from "../../slices/otpSlice";
import { BiSolidUserCheck } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { usePasswordChangeMutation } from "../../slices/apiSlices/carListingApiSlice";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../component/ui/form";
import { setUser } from "../../slices/profileSlice";
import { Input } from "../../component/ui/input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import SearchAddress from "../../component/ui/search-address";
import { countries, getCountryData, getCountryCode } from "countries-list";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "../../component/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../component/ui/card";
import { AiOutlineUpload } from "react-icons/ai";
import { GrPowerReset } from "react-icons/gr";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../component/ui/accordion";
import { X, Plus, Trash2 } from "lucide-react";
import { Separator } from "../../component/ui/separator";
import { MdOutlineEdit } from "react-icons/md";
import { add, set } from "date-fns";
import AdminReview from "./AdminReview";
const signupSchema = z.object({
  firstname: z
    .string()
    .min(2, "First name should be at least 2 characters")
    .max(30, "First name is too long"),
  lastname: z
    .string()
    .min(2, "Last name should be at least 2 characters")
    .max(30, "Last name is too long"),
  username: z
    .string()
    .min(3, "Username should be at least 3 characters")
    .max(30, "Username is too long"),
  phone: z.string().min(1, "Phone number is required"),
  companyName: z.string().optional(),
  street: z.string().min(1, "Address is required"),
  state: z.string().min(3, "State is required"),
  pincode: z
    .string()
    .min(1, "Pincode is required")
    .max(10, "Enter a valid pincode"),
  city: z.string().min(3, "City is required"),
  country: z.string().min(1, "Please select a country."),
});

const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, "Old password must be at least 8 characters"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Points to the confirmPassword field
  });


const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { signUpData } = useSelector((state) => state.otp) || {};
  const [phone, setPhone] = useState(user?.phone);

  const email = signUpData || user?.email;

  const goBack = () => {
    navigate(-1);
  };
  const [PasswordChange, { isLoading }] = usePasswordChangeMutation();

  const [image, setImage] = useState(null);
  
  const [loading, setLoading] = useState(false);

  const [imageLoading, setImageLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      username: user?.username || "",
      phone: user?.phone || "",
      country: getCountryCode(user?.country) || "",
      companyName: user?.companyName || "",
      street: user?.street || "",
      city: user?.city || "",
      state: user?.state || "",
      pincode: user?.pincode || "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    setImage(file);
  };

  // const headers = {
  //   'Authorization': `Bearer ${token}`,
  // };

  const handleDeleteImage = () => {
    setImage(null);
    inputRef.current.value = "";
  };

  const ChangePasswordHandler = async (data) => {
    try {
      const response = await PasswordChange({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
        userId: user?.id,
      }).unwrap();
      console.log(response);

      if (response.success) {
        toast({
          title: "Password changed successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: response.message || "Failed to change password",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: error?.data?.message || "An error occurred",
      });
    }
  };

  const uploadImage = async () => {
    setImageLoading(true);
    try {
      const formData = new FormData();

      if (!image) {
        setImageLoading(false);
        return toast({
          variant: "destructive",
          title: "Please select an image",
        });
      }

      formData.append("image", image);
      formData.append("email", user?.email || email);

      const result = await apiConnector(
        "POST",
        process.env.REACT_APP_BASE_URL + `/api/profileupdate?updateImage=true`,
        formData
      );

      console.log(result);

      if (!result.data.success) {
        toast({
          variant: "destructive",
          title: result?.data?.message || "Failed to update",
        });

        throw new Error(result.data.message);
      }

      toast({
        title: "Profile Picture Updated Successfully",
      });
      const prevState = result?.data?.image;
      dispatch(
        setUser({
          image: prevState,
        })
      );
      setImageLoading(false);
    } catch (error) {
      setImageLoading(false);
      console.error("An error occurred:", error);
      toast({
        variant: "destructive",
        title: error.response?.data?.message || "Failed to update",
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const countryData = await getCountryData(data.country);

      const countryName = countryData.name;

      const formData = {
        ...data,
        email: user?.email || email,
        country: countryName,
      };

      const formDataToSend = new FormData();

      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      if (image) {
        formDataToSend.append(`image`, image);
      }

      const result = await apiConnector(
        "POST",
        process.env.REACT_APP_BASE_URL + "/api/profileupdate",
        formDataToSend
      );

      if (!result.data.success) {
        toast({
          variant: "destructive",
          title: result?.data?.message || "Failed to update",
        });

        throw new Error(result.data.message);
      }

      toast({
        title: "Profile Updated Successfully",
      });

      const prevState = result?.data?.user;
      dispatch(
        setUser({
          firstname: prevState?.firstname,
          lastname: prevState?.lastname,
          username: prevState?.username,
          phone: prevState?.phone,
          country: prevState?.country,
          companyName: prevState?.companyName,
          street: prevState?.street,
          city: prevState?.city,
          state: prevState?.state,
          pincode: prevState?.pincode,
          image: prevState?.image,
          isProfileCompleted: prevState?.isProfileCompleted,
        })
      );
    } catch (error) {
      console.error("An error occurred:", error);
      toast({
        variant: "destructive",
        title: error.response?.data?.message || "Failed to update",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard>
      <header className="relative ">
        <div className="flex h-16 p-2 justify-between items-center">
          <div className="ml-4 text-3xl font-inter font-bold flex lg:ml-0">
            Settings
          </div>
        </div>
      </header>

      <div className="w-full h-20 mt-4 bg-richblue-100 rounded-xl max-w-screen">
        <div className="p-6 flex gap-2 items-center">
          <Button
            variant="secondary"
            onClick={goBack}
            className="font-bold p-0 text-foreground-muted h-10 w-10 rounded-md"
          >
            <IoIosArrowBack className="text-lg text-muted-foreground" />
          </Button>

          <div className="text-xl font-bold font-inter text-white">
            Update your profile here!
          </div>
        </div>
      </div>

      <div className="max-w-screen overflow-hidden font-inter">
        <div className="grid grid-cols-1 mt-8 md:grid-cols-2 gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Change Profile</CardTitle>
              <CardDescription>
                Change your profile picture from here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Image Upload Section */}
              <div className="flex flex-col justify-center items-center gap-12 mb-6">
                <div>
                  <input
                    id="file-upload"
                    name="file"
                    type="file"
                    className="sr-only"
                    ref={inputRef}
                    multiple
                    hidden
                    onChange={handleImageChange}
                  />
                  {image || user?.image ? (
                    <img
                      src={image ? URL.createObjectURL(image) : user?.image}
                      className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover cursor-pointer object-center"
                      alt=""
                    />
                  ) : (
                    <Icons.photo
                      className="w-20 h-20 md:w-28 md:h-28 cursor-pointer rounded-full"
                      onClick={() => inputRef.current.click()}
                    />
                  )}
                </div>

                <div className=" flex items-center gap-10 justify-between">
                  <Button
                    variant=""
                    size="lg"
                    className="border-[1px]"
                    onClick={uploadImage}
                    disabled={imageLoading}
                  >
                    <AiOutlineUpload className="me-2" />
                    {imageLoading ? (
                      <>
                        <span className="loader"></span>
                        <span>Uploading..</span>
                      </>
                    ) : (
                      "Upload"
                    )}
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    className="border-[1px]"
                    onClick={() => inputRef.current.click()}
                  >
                    <GrPowerReset className="me-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full ">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Change your password from here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="col-span-1 ">
                <div className="flex  flex-col items-center mx-auto">
                  <div className="m-2 w-full">
                    <Form {...passwordForm}>
                      <form
                        onSubmit={passwordForm.handleSubmit(
                          ChangePasswordHandler
                        )}
                        className="flex flex-col w-full font-inter space-y-4 text-gray-900 text-sm font-[400]"
                      >
                        <FormField
                          name="oldPassword"
                          control={passwordForm.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-inter p-0 m-0">
                                Old Password
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Enter your old password"
                                  className="border-[1px] ring-0 rounded-md p-2 w-full focus:outline-0"
                                  {...field}
                                  autocomplete="old-password"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="newPassword"
                          control={passwordForm.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-inter p-0 m-0">
                                New Password
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Enter your new password"
                                  className="border-[1px] ring-0 rounded-md p-2 w-full focus:outline-0"
                                  {...field}
                                  autocomplete="new-password"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="confirmPassword"
                          control={passwordForm.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-inter p-0 m-0">
                                Confirm Password
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Enter your password again"
                                  className="border-[1px] ring-0 rounded-md p-2 w-full focus:outline-0"
                                  {...field}
                                  autocomplete="Confirm-password"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex items-center justify-center mt-10">
                          <Button
                            type="submit"
                            disabled={isLoading}
                            variant="btn"
                            size="lg"
                            className="w-full py-0 px-0"
                          >
                            {isLoading ? (
                              <span className="loader"></span>
                            ) : (
                              "Change Password"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full mt-8 mb-8">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>
              Changer your personal details from here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className=" grid m-0">
              <div className="flex flex-col mt-6 md:mt-10 justify-start items-center w-full">
                {/* Form Section */}
                <div className="w-full max-w-5xl px-4">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col font-inter space-y-6 text-gray-900 text-sm font-[400]"
                    >
                      {/* Form Grid Container */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email */}
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <div className="flex relative items-center">
                            <Input
                              type="text"
                              placeholder="Enter your email"
                              className="border-[1px] ring-0 font-semibold rounded-md p-2 w-full focus:outline-0"
                              value={user?.email || ""}
                              readOnly
                            />
                            {user?.email && (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <BiSolidUserCheck className="text-richblue-100 text-lg" />
                              </div>
                            )}
                          </div>
                        </FormItem>

                        {/* Username */}
                        <FormField
                          name="username"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Enter your username"
                                  className="border-[1px] ring-0 rounded-md p-2 w-full focus:outline-0"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* First Name */}
                        <FormField
                          name="firstname"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Enter your first name"
                                  className="border-[1px] ring-0 rounded-md p-2 w-full focus:outline-0"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Last Name */}
                        <FormField
                          name="lastname"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Enter your last name"
                                  className="border-[1px] ring-0 rounded-md p-2 w-full focus:outline-0"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Phone */}
                        <FormField
                          name="phone"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <PhoneInput
                                  country="us"
                                  value={phone}
                                  onChange={(phone) => {
                                    setPhone(phone);
                                    field.onChange(phone);
                                  }}
                                  inputProps={{
                                    name: "phone",
                                    required: true,
                                    autoFocus: true,
                                  }}
                                  containerClass="w-full"
                                  inputClass="w-full h-10 px-4 border-1 py-2 focus:outline-none focus:ring-0 border-1 rounded-md"
                                  inputStyle={{
                                    width: "100%",
                                    height: "41px",
                                    border: "1px solid #e5e7eb",
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {/* Company Name */}
                        <FormField
                          name="companyName"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name (optional)</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Enter your company name"
                                  className="border-[1px] ring-0 rounded-md p-2 w-full focus:outline-0"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          name="country"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Select
                                  {...field}
                                  value={field.value}
                                  onValueChange={(value) =>
                                    field.onChange(value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a country">
                                      {field.value
                                        ? countries[field.value]?.name
                                        : "Select a country"}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Countries</SelectLabel>
                                      {Object.entries(countries).map(
                                        ([code, country]) => (
                                          <SelectItem key={code} value={code}>
                                            {country.name}
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* City */}
                        <FormField
                          name="city"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Enter your city"
                                  className="border-[1px] ring-0 rounded-md p-2 w-full focus:outline-0"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* State/Province */}
                        <FormField
                          name="state"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Enter your state/province"
                                  className="border-[1px] ring-0 rounded-md p-2 w-full focus:outline-0"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Pincode */}
                        <FormField
                          name="pincode"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal Code</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Enter your Postal Code"
                                  className="border-[1px] ring-0 rounded-md p-2 w-full focus:outline-0"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Country Selection - Full Width on Mobile */}
                        <div className="md:col-span-2">
                          {/* Street Address */}
                          <FormField
                            name="street"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                  <SearchAddress
                                    onSelectLocation={(location) => {
                                      if (location) {
                                        field.onChange(location.label);
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* <SearchAddress onSelectLocation={(location) => console.log(location)} /> */}

                      {/* Submit Button */}
                      <div className="flex flex-col items-center justify-end mt-8 gap-4 sm:flex-row">
                        <Button
                          variant="secondary"
                          type="button"
                          size="lg"
                          onClick={() => {
                            navigate("/");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={loading}
                          variant="btn"
                          size="lg"
                        >
                          {loading ? <span className="loader"></span> : "Save"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <MetadataForm />

        <AdminReview />
      </div>
    </Dashboard>
  );
};

export default Signup;

export const MetadataForm = () => {
  const [formData, setFormData] = useState({
    MakesModels: [{ Make: "", Models: [""] }],
    ConstructionMakesModels: [
      {
        type: "",
        makes: [{ Make: "", Models: [""] }],
      },
    ],
    BodyColors: [""],
    BodyTypes: [""],
  });
  const { toast } = useToast();

  const [existingMetadata, setExistingMetadata] = useState({
    MakesModels: [],
    ConstructionMakesModels: [],
    BodyColors: [],
    BodyTypes: [],
  });
  const [Makes, setMakes] = useState("");
  const [Models, setModels] = useState([]);
  const [addModel, setAddModel] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [constructionFormData, setConstructionFormData] = useState({
    constructionType: "",
    ConstructionMakes: [],
    ConstructionModels: [],
    constructionMake: "",
    addConstructionModel: "",
    editConstructionMode: false,
    editConstructionMake: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiConnector(
          "GET",
          process.env.REACT_APP_BASE_URL + "/api/metadata"
        );
        if (result && result.data) {
          const data = result.data.data[0]; // Assuming the first item contains the metadata
          setExistingMetadata({
            MakesModels: data.MakesModels || [],
            ConstructionMakesModels: data.ConstructionMakesModels || [],
            BodyColors: data.BodyColors || [],
            BodyTypes: data.BodyTypes || [],
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const cleanConstructionMakesModels = (data) => {
        if (!Array.isArray(data)) return [];

        return data
          .filter((item) => item.type && item.type.trim() !== "") // Keep objects with valid `type`
          .map((item) => ({
            ...item,
            makes: Array.isArray(item.makes)
              ? item.makes
                  .map((makeObj) => ({
                    ...makeObj,
                    Models: Array.isArray(makeObj.Models)
                      ? makeObj.Models.filter((model) => model.trim() !== "") // Remove empty strings from `Models`
                      : [],
                  }))
                  .filter(
                    (makeObj) => makeObj.Make && makeObj.Make.trim() !== ""
                  ) // Keep objects with non-empty `Make`
              : [],
          }));
      };

      const cleanMakesModels = (data) => {
        if (!Array.isArray(data)) return [];

        return data
          .filter((item) => item.Make && item.Make.trim() !== "") // Keep objects with non-empty `Make`
          .map((item) => ({
            ...item,
            Models: Array.isArray(item.Models)
              ? item.Models.filter((model) => model.trim() !== "") // Remove empty strings from `Models`
              : [],
          }));
      };

      const CleanBodyTypeAndColor = (data) => {
        if (!Array.isArray(data)) return [];
        return data.filter((item) => item.trim() !== "");
      };

      const sendData = {
        existingMakeAndModels: {
          Make: Makes,
          Models: Models,
        },
        existingConstructionMakeAndModels: {
          type: constructionFormData.constructionType,
          Make: constructionFormData.constructionMake,
          Models: constructionFormData.ConstructionModels,
          Makes: constructionFormData.ConstructionMakes,
        },
        MakesModels: cleanMakesModels(formData.MakesModels),
        ConstructionMakesModels: cleanConstructionMakesModels(
          formData.ConstructionMakesModels
        ),
        BodyColors: CleanBodyTypeAndColor(formData.BodyColors),
        BodyTypes: CleanBodyTypeAndColor(formData.BodyTypes),
      };

      const response = await apiConnector(
        "POST",
        process.env.REACT_APP_BASE_URL + "/api/metadata",
        sendData
      );

      if (response && response.data.success) {
        toast({
          title: "Success",
          description: "Metadata submitted successfully.",
          variant: "success",
        });
      }
      setLoading(false)

    } catch (error) {
      setLoading(false)
      toast({
        title: "Error",
        description: "Error submitting metadata.",
        variant: "destructive",
      });
      console.error("Error submitting metadata:", error);
    }
  };

  const selectExistingMake = (selectedMake) => {
    const models = existingMetadata.MakesModels.find(
      (m) => m.Make === selectedMake
    );

    // console.log(models);
    setModels(models ? models.Models : []);
    setMakes(selectedMake);
  };

  const selectExistingConstructionMake = (selectedType) => {
    console.log("Selected Type:", selectedType);

    const matchedType = existingMetadata.ConstructionMakesModels.find(
      (m) => m.type === selectedType
    );

    // console.log("Matched Type:", matchedType);

    setConstructionFormData((prevState) => ({
      ...prevState,
      constructionType: selectedType,
      ConstructionMakes: matchedType ? matchedType.makes : [],
      constructionMake: "",
      ConstructionModels: [],
    }));
  };

  const selectExistingConstructionModel = (selectedMake) => {
    const matchedMake = constructionFormData.ConstructionMakes.find(
      (m) => m.Make === selectedMake
    );
    console.log("Selected Make:", selectedMake, "Matched Data:", matchedMake);

    setConstructionFormData((prevState) => ({
      ...prevState,
      constructionMake: selectedMake,
      ConstructionModels: matchedMake ? matchedMake.Models : [],
      editConstructionMode: false,
    }));
  };

  // All delete handlers remain the same
  const deleteMake = (index) => {
    const newMakesModels = formData.MakesModels.filter((_, i) => i !== index);
    setFormData((prevState) => ({
      ...prevState,
      MakesModels:
        newMakesModels.length > 0
          ? newMakesModels
          : [{ Make: "", Models: [""] }],
    }));
  };

  const deleteModel = (makeIndex, modelIndex) => {
    const newMakesModels = [...formData.MakesModels];
    newMakesModels[makeIndex].Models = newMakesModels[makeIndex].Models.filter(
      (_, i) => i !== modelIndex
    );
    setFormData((prevState) => ({
      ...prevState,
      MakesModels: newMakesModels,
    }));
  };

  const deleteConstructionType = (index) => {
    const newConstructionMakesModels = formData.ConstructionMakesModels.filter(
      (_, i) => i !== index
    );
    setFormData((prevState) => ({
      ...prevState,
      ConstructionMakesModels:
        newConstructionMakesModels.length > 0
          ? newConstructionMakesModels
          : [{ type: "", makes: [{ Make: "", Models: [""] }] }],
    }));
  };

  const deleteConstructionMake = (constructionIndex, makeIndex) => {
    const newConstructionMakesModels = [...formData.ConstructionMakesModels];
    newConstructionMakesModels[constructionIndex].makes =
      newConstructionMakesModels[constructionIndex].makes.filter(
        (_, i) => i !== makeIndex
      );
    setFormData((prevState) => ({
      ...prevState,
      ConstructionMakesModels: newConstructionMakesModels,
    }));
  };

  const deleteConstructionModel = (
    constructionIndex,
    makeIndex,
    modelIndex
  ) => {
    const newConstructionMakesModels = [...formData.ConstructionMakesModels];
    newConstructionMakesModels[constructionIndex].makes[makeIndex].Models =
      newConstructionMakesModels[constructionIndex].makes[
        makeIndex
      ].Models.filter((_, i) => i !== modelIndex);
    setFormData((prevState) => ({
      ...prevState,
      ConstructionMakesModels: newConstructionMakesModels,
    }));
  };

  const deleteBodyColor = (index) => {
    const newBodyColors = formData.BodyColors.filter((_, i) => i !== index);
    setFormData((prevState) => ({
      ...prevState,
      BodyColors: newBodyColors.length > 0 ? newBodyColors : [""],
    }));
  };

  const deleteBodyType = (index) => {
    const newBodyTypes = formData.BodyTypes.filter((_, i) => i !== index);
    setFormData((prevState) => ({
      ...prevState,
      BodyTypes: newBodyTypes.length > 0 ? newBodyTypes : [""],
    }));
  };

  // All update methods remain the same
  const updateMakesModels = (makeIndex, field, value) => {
    const newMakesModels = [...formData.MakesModels];
    newMakesModels[makeIndex][field] = value;
    setFormData((prevState) => ({
      ...prevState,
      MakesModels: newMakesModels,
    }));
  };

  const updateModels = (makeIndex, modelIndex, value) => {
    const newMakesModels = [...formData.MakesModels];
    newMakesModels[makeIndex].Models[modelIndex] = value;
    setFormData((prevState) => ({
      ...prevState,
      MakesModels: newMakesModels,
    }));
  };

  const updateConstructionMakesModels = (constructionIndex, field, value) => {
    const newConstructionMakesModels = [...formData.ConstructionMakesModels];
    newConstructionMakesModels[constructionIndex][field] = value;
    setFormData((prevState) => ({
      ...prevState,
      ConstructionMakesModels: newConstructionMakesModels,
    }));
  };

  const updateConstructionMake = (
    constructionIndex,
    makeIndex,
    field,
    value
  ) => {
    const newConstructionMakesModels = [...formData.ConstructionMakesModels];
    newConstructionMakesModels[constructionIndex].makes[makeIndex][field] =
      value;
    setFormData((prevState) => ({
      ...prevState,
      ConstructionMakesModels: newConstructionMakesModels,
    }));
  };

  const updateConstructionModels = (
    constructionIndex,
    makeIndex,
    modelIndex,
    value
  ) => {
    const newConstructionMakesModels = [...formData.ConstructionMakesModels];
    newConstructionMakesModels[constructionIndex].makes[makeIndex].Models[
      modelIndex
    ] = value;
    setFormData((prevState) => ({
      ...prevState,
      ConstructionMakesModels: newConstructionMakesModels,
    }));
  };

  const updateBodyColors = (index, value) => {
    const newBodyColors = [...formData.BodyColors];
    newBodyColors[index] = value;
    setFormData((prevState) => ({
      ...prevState,
      BodyColors: newBodyColors,
    }));
  };

  const updateBodyTypes = (index, value) => {
    const newBodyTypes = [...formData.BodyTypes];
    newBodyTypes[index] = value;
    setFormData((prevState) => ({
      ...prevState,
      BodyTypes: newBodyTypes,
    }));
  };

  return (
    <div className="max-w-full mx-auto mb-20">
      <form className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Makes and Models Section */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="makes-models">
                <AccordionTrigger>Makes and Models</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4 mt-2 px-2">
                      {/* Dropdown for existing makes */}
                      <Select
                        value={Makes || ""} // Ensure Makes has a valid value
                        onValueChange={(value) => selectExistingMake(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Make" />
                        </SelectTrigger>
                        <SelectContent>
                          {existingMetadata.MakesModels.map((existingMake) => (
                            <SelectItem
                              key={existingMake.Make}
                              value={existingMake.Make}
                              placeholder="Add Make"
                            >
                              {existingMake.Make}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Dropdown for models */}
                      <Select value={Models?.length > 0 ? Models[0] : ""}>
                        {" "}
                        {/* Handle empty model */}
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Model" />
                        </SelectTrigger>
                        <SelectContent>
                          {Models?.length > 0 ? (
                            Models.map((Model) => (
                              <SelectItem key={Model} value={Model}>
                                {Model}
                              </SelectItem>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm text-center">
                              No models available
                            </p>
                          )}
                        </SelectContent>
                      </Select>

                      {Makes &&
                        (editMode ? (
                          <Button
                            variant="link"
                            onClick={(e) => {
                              e.preventDefault();
                              const machType =
                                existingMetadata.MakesModels.find(
                                  (make) => make.Make === Makes
                                );
                              if (machType) {
                                setModels(machType.Models);
                              }

                              setEditMode(false);
                            }}
                            className="flex justify-start items-start"
                          >
                            <Trash2 className="h-3 w-3 mr-2 mt-1" />
                            Cancel
                          </Button>
                        ) : (
                          <Button
                            variant="link"
                            className="flex justify-start items-start"
                            onClick={(e) => {
                              e.preventDefault();
                              setEditMode(true);
                            }}
                          >
                            Edit {Makes} Models
                            <MdOutlineEdit className="ml-2" />
                          </Button>
                        ))}
                    </div>

                    {/* Section for inputting models */}
                    {editMode && (
                      <div>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mt-2 my-4">
                              {/* Make Input */}
                              <Select
                                value={Makes || ""} // Ensure Makes has a valid value
                                onValueChange={(value) =>
                                  selectExistingMake(value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Make" />
                                </SelectTrigger>
                                <SelectContent>
                                  {existingMetadata.MakesModels.map(
                                    (existingMake) => (
                                      <SelectItem
                                        key={existingMake.Make}
                                        value={existingMake.Make}
                                        placeholder="Add Make"
                                      >
                                        {existingMake.Make}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="pl-4 space-y-2">
                              <h4 className="font-medium mb-2">Models</h4>

                              {/* Map through Models */}

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
                                {Models?.map((model, modelIndex) => (
                                  <div
                                    key={modelIndex}
                                    className="flex items-center gap-2"
                                  >
                                    {/* Model Input */}
                                    <Button
                                      variant="outline"
                                      className="w-60 h-8 flex   "
                                    >
                                      {model}
                                    </Button>

                                    {Models.length > 0 && (
                                      <Button
                                        variant="destructive"
                                        size={"icon"}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          const updatedModels = Models.filter(
                                            (_, idx) => idx !== modelIndex
                                          );
                                          setModels(updatedModels);
                                        }}
                                        className="p-1 h-8 w-8"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Add Model Button */}

                              <h4 className="font-medium mt-4 my-2">
                                Add Model
                              </h4>
                              <Input
                                placeholder="Add new model"
                                value={addModel}
                                onChange={(e) => {
                                  setAddModel(e.target.value);
                                }}
                                className="my-2"
                              />

                              {addModel && (
                                <Button
                                  type="button"
                                  variant="secondary"
                                  onClick={(e) => {
                                    e.preventDefault();

                                    if (!addModel) return;

                                    setModels((prevModels) => [
                                      ...prevModels,
                                      addModel,
                                    ]);

                                    setAddModel("");
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Model
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    <div>
                      {formData.MakesModels.map((makeModel, makeIndex) => (
                        <Card key={makeIndex} className="my-4">
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mt-2 my-4">
                              <Input
                                placeholder="Make"
                                value={makeModel.Make}
                                onChange={(e) =>
                                  updateMakesModels(
                                    makeIndex,
                                    "Make",
                                    e.target.value
                                  )
                                }
                              />
                              {formData.MakesModels.length > 1 && (
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => deleteMake(makeIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <div className="pl-4 space-y-2">
                              <h4 className="font-medium mb-2">Models</h4>

                              {makeModel.Models.map((model, modelIndex) => (
                                <div
                                  key={modelIndex}
                                  className="flex items-center gap-2"
                                >
                                  <Input
                                    placeholder={`Model ${modelIndex + 1}`}
                                    value={model}
                                    onChange={(e) =>
                                      updateModels(
                                        makeIndex,
                                        modelIndex,
                                        e.target.value
                                      )
                                    }
                                  />
                                  {makeModel.Models.length > 1 && (
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      onClick={() =>
                                        deleteModel(makeIndex, modelIndex)
                                      }
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  const newMakesModels = [
                                    ...formData.MakesModels,
                                  ];
                                  newMakesModels[makeIndex].Models.push("");
                                  setFormData((prevState) => ({
                                    ...prevState,
                                    MakesModels: newMakesModels,
                                  }));
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Model
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Button
                      type="button"
                      onClick={() =>
                        setFormData((prevState) => ({
                          ...prevState,
                          MakesModels: [
                            ...prevState.MakesModels,
                            { Make: "", Models: [""] },
                          ],
                        }))
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Make
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Construction Makes and Models Section */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="construction">
                <AccordionTrigger>
                  Construction Makes and Models
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Card>
                        <CardContent className="pt-6">
                          {/* Construction Type Select */}
                          <Select
                            value={constructionFormData.constructionType}
                            onValueChange={(value) =>
                              selectExistingConstructionMake(value)
                            }
                          >
                            <SelectTrigger className="w-full mb-4">
                              <SelectValue placeholder="Select Construction Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {existingMetadata.ConstructionMakesModels.map(
                                (existingConstruction, index) => (
                                  <SelectItem
                                    key={index}
                                    value={existingConstruction.type}
                                  >
                                    {existingConstruction.type}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>

                          <Select
                            value={constructionFormData.constructionMake}
                            onValueChange={(value) =>
                              selectExistingConstructionModel(value)
                            }
                          >
                            <SelectTrigger className="w-full mb-4">
                              <SelectValue placeholder="Select Make" />
                            </SelectTrigger>
                            <SelectContent>
                              {constructionFormData.ConstructionMakes.length >
                              0 ? (
                                constructionFormData.ConstructionMakes.map(
                                  (model, index) => (
                                    <SelectItem key={index} value={model.Make}>
                                      {model.Make}
                                    </SelectItem>
                                  )
                                )
                              ) : (
                                <p className="text-gray-500 text-sm text-center">
                                  No makes available
                                </p>
                              )}
                            </SelectContent>
                          </Select>

                          {!constructionFormData.constructionMake &&
                            constructionFormData.constructionType &&
                            (constructionFormData.editConstructionMode ? (
                              <Button
                                variant="link"
                                onClick={(e) => {
                                  e.preventDefault();
                                  const matchedType =
                                    existingMetadata.ConstructionMakesModels.find(
                                      (item) =>
                                        item.type ===
                                        constructionFormData.constructionType
                                    );
                                  if (matchedType) {
                                    setConstructionFormData((prevState) => ({
                                      ...prevState,
                                      editConstructionMode: false,
                                      ConstructionMakes: matchedType
                                        ? matchedType.makes
                                        : [],
                                    }));
                                  }
                                }}
                                className="flex justify-start items-start"
                              >
                                <Trash2 className="h-3 w-3 mr-2 mt-1" />
                                Cancel
                              </Button>
                            ) : (
                              <Button
                                variant="link"
                                className="flex justify-start items-start"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setConstructionFormData((prevState) => ({
                                    ...prevState,
                                    editConstructionMode: true,
                                  }));
                                }}
                              >
                                Edit {constructionFormData.constructionType}{" "}
                                Makes <MdOutlineEdit className="ml-2" />
                              </Button>
                            ))}

                          {constructionFormData.constructionMake &&
                            (constructionFormData.editConstructionMake ? (
                              <Button
                                variant="link"
                                onClick={(e) => {
                                  e.preventDefault();
                                  const matchedType =
                                    constructionFormData.ConstructionMakes.find(
                                      (item) =>
                                        item.Make ===
                                        constructionFormData.constructionMake
                                    );

                                  if (matchedType) {
                                    setConstructionFormData((prevState) => ({
                                      ...prevState,
                                      editConstructionMake: false,
                                      ConstructionModels: matchedType
                                        ? matchedType.Models
                                        : [], // Handle undefined `matchedType` safely
                                    }));
                                  }
                                }}
                                className="flex justify-start items-start"
                              >
                                <Trash2 className="h-3 w-3 mr-2 mt-1" />
                                Cancel
                              </Button>
                            ) : (
                              <Button
                                variant="link"
                                className="flex justify-start items-start"
                                onClick={(e) => {
                                  e.preventDefault();

                                  setConstructionFormData((prevState) => ({
                                    ...prevState,
                                    editConstructionMake: true,
                                  }));
                                }}
                              >
                                Edit {constructionFormData.constructionMake}{" "}
                                Models <MdOutlineEdit className="ml-2" />
                              </Button>
                            ))}

                          {constructionFormData.editConstructionMode && (
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
                                {constructionFormData.ConstructionMakes?.map(
                                  (model, modelIndex) => (
                                    <div
                                      key={modelIndex}
                                      className="flex items-center gap-2"
                                    >
                                      {/* Model Input */}
                                      <Button
                                        variant="outline"
                                        className="w-60 h-8 flex   "
                                      >
                                        {model.Make}
                                      </Button>

                                      {constructionFormData.ConstructionMakes
                                        .length > 1 && (
                                        <Button
                                          variant="destructive"
                                          size={"icon"}
                                          onClick={() => {
                                            const updatedMakes =
                                              constructionFormData.ConstructionMakes.filter(
                                                (_, idx) => idx !== modelIndex
                                              );
                                            setConstructionFormData(
                                              (prevState) => ({
                                                ...prevState,
                                                ConstructionMakes: updatedMakes,
                                              })
                                            );
                                          }}
                                          className="p-1 h-8 w-8"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                              <h4 className="font-medium mt-4 my-2">
                                Add Makes
                              </h4>
                              <Input
                                value={
                                  constructionFormData.addConstructionModel
                                }
                                onChange={(e) =>
                                  setConstructionFormData((prevState) => ({
                                    ...prevState,
                                    addConstructionModel: e.target.value,
                                  }))
                                }
                                placeholder="Add Make"
                                className="my-2"
                              />

                              <Button
                                variant="outline"
                                className="mb-2"
                                onClick={() => {
                                  if (
                                    !constructionFormData.addConstructionModel
                                  )
                                    return;

                                  const newMake =
                                    constructionFormData.addConstructionModel.toUpperCase();

                                  // Check if Make already exists
                                  const exists =
                                    constructionFormData.ConstructionMakes.some(
                                      (item) => item.Make === newMake
                                    );

                                  if (!exists) {
                                    setConstructionFormData((prevState) => ({
                                      ...prevState,
                                      ConstructionMakes: [
                                        ...prevState.ConstructionMakes,
                                        { Make: newMake, Models: [] },
                                      ],
                                    }));
                                  } else {
                                    toast({
                                      title: "Make already exists",
                                      description:
                                        "Please enter a different make.",
                                      variant: "destructive",
                                    });
                                  }

                                  setConstructionFormData((prevState) => ({
                                    ...prevState,
                                    addConstructionModel: "",
                                  }));
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Make
                              </Button>
                            </>
                          )}

                          {constructionFormData.editConstructionMake && (
                            <>
                              <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {constructionFormData.ConstructionModels?.map(
                                  (model, modelIndex) => (
                                    <div
                                      key={modelIndex}
                                      className="flex items-center gap-2"
                                    >
                                      {/* Model Input */}
                                      <Button
                                        variant="outline"
                                        className="w-60 h-8 flex   "
                                      >
                                        {model}
                                      </Button>

                                      {constructionFormData.ConstructionModels
                                        .length > 0 && (
                                        <Button
                                          variant="destructive"
                                          size={"icon"}
                                          onClick={() => {
                                            const updatedModels =
                                              constructionFormData.ConstructionModels.filter(
                                                (_, idx) => idx !== modelIndex
                                              );
                                            setConstructionFormData(
                                              (prevState) => ({
                                                ...prevState,
                                                ConstructionModels:
                                                  updatedModels,
                                              })
                                            );
                                          }}
                                          className="p-1 h-8 w-8"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>

                              {constructionFormData.constructionMake && (
                                <>
                                  <h4 className="font-medium mt-4 my-2">
                                    Add Model
                                  </h4>
                                  <Input
                                    value={
                                      constructionFormData.addConstructionModel
                                    }
                                    onChange={(e) =>
                                      setConstructionFormData((prevState) => ({
                                        ...prevState,
                                        addConstructionModel: e.target.value,
                                      }))
                                    }
                                    placeholder="Add Model"
                                    className="my-2"
                                  />

                                  <Button
                                    variant="outline"
                                    className="mb-2"
                                    onClick={() => {
                                      if (
                                        !constructionFormData.addConstructionModel
                                      )
                                        return;

                                      setConstructionFormData((prevState) => ({
                                        ...prevState,
                                        ConstructionModels: [
                                          ...prevState.ConstructionModels,
                                          constructionFormData.addConstructionModel,
                                        ],
                                        addConstructionModel: "",
                                      }));
                                    }}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Model
                                  </Button>
                                </>
                              )}
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {formData.ConstructionMakesModels.map(
                      (construction, constructionIndex) => (
                        <Card key={constructionIndex}>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-4">
                              <Input
                                placeholder="Construction Type"
                                value={construction.type}
                                onChange={(e) =>
                                  updateConstructionMakesModels(
                                    constructionIndex,
                                    "type",
                                    e.target.value
                                  )
                                }
                                required
                              />
                              {formData.ConstructionMakesModels.length > 1 && (
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() =>
                                    deleteConstructionType(constructionIndex)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            <div className="space-y-4">
                              {construction.makes.map((makeMdl, makeIndex) => (
                                <div key={makeIndex} className="pl-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <Input
                                      placeholder="Make"
                                      value={makeMdl.Make}
                                      onChange={(e) =>
                                        updateConstructionMake(
                                          constructionIndex,
                                          makeIndex,
                                          "Make",
                                          e.target.value
                                        )
                                      }
                                      required
                                    />
                                    {construction.makes.length > 1 && (
                                      <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() =>
                                          deleteConstructionMake(
                                            constructionIndex,
                                            makeIndex
                                          )
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                  <div className="pl-4 space-y-2">
                                    <h4 className="font-medium mb-2">Models</h4>
                                    {makeMdl.Models.map((model, modelIndex) => (
                                      <div
                                        key={modelIndex}
                                        className="flex items-center gap-2"
                                      >
                                        <Input
                                          placeholder={`Model ${
                                            modelIndex + 1
                                          }`}
                                          value={model}
                                          onChange={(e) =>
                                            updateConstructionModels(
                                              constructionIndex,
                                              makeIndex,
                                              modelIndex,
                                              e.target.value
                                            )
                                          }
                                        />
                                        {makeMdl.Models.length > 1 && (
                                          <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() =>
                                              deleteConstructionModel(
                                                constructionIndex,
                                                makeIndex,
                                                modelIndex
                                              )
                                            }
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => {
                                        const newConstructionMakesModels = [
                                          ...formData.ConstructionMakesModels,
                                        ];
                                        newConstructionMakesModels[
                                          constructionIndex
                                        ].makes[makeIndex].Models.push("");
                                        setFormData((prevState) => ({
                                          ...prevState,
                                          ConstructionMakesModels:
                                            newConstructionMakesModels,
                                        }));
                                      }}
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add Model
                                    </Button>
                                  </div>
                                  <Separator className="my-4" />
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  const newConstructionMakesModels = [
                                    ...formData.ConstructionMakesModels,
                                  ];
                                  newConstructionMakesModels[
                                    constructionIndex
                                  ].makes.push({ Make: "", Models: [""] });
                                  setFormData((prevState) => ({
                                    ...prevState,
                                    ConstructionMakesModels:
                                      newConstructionMakesModels,
                                  }));
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Make
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}

                    <Button
                      type="button"
                      onClick={() =>
                        setFormData((prevState) => ({
                          ...prevState,
                          ConstructionMakesModels: [
                            ...prevState.ConstructionMakesModels,
                            { type: "", makes: [{ Make: "", Models: [""] }] },
                          ],
                        }))
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Construction Type
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Body Colors Section */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="colors">
                <AccordionTrigger>Body Colors</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Make" />
                      </SelectTrigger>
                      <SelectContent>
                        {existingMetadata.BodyColors.map((color) => (
                          <SelectItem
                            key={color}
                            value={color}
                            placeholder="Add Make"
                          >
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {formData.BodyColors.map((color, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder={`Color ${index + 1}`}
                          value={color}
                          onChange={(e) =>
                            updateBodyColors(index, e.target.value)
                          }
                        />
                        {formData.BodyColors.length > 1 && (
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteBodyColor(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() =>
                        setFormData((prevState) => ({
                          ...prevState,
                          BodyColors: [...prevState.BodyColors, ""],
                        }))
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Color
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Body Types Section */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="types">
                <AccordionTrigger>Body Types</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <Select>
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="Select Make" />
                      </SelectTrigger>
                      <SelectContent>
                        {existingMetadata.BodyTypes.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            placeholder="Add Make"
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.BodyTypes.map((bodyType, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder={`Body Type ${index + 1}`}
                          value={bodyType}
                          onChange={(e) =>
                            updateBodyTypes(index, e.target.value)
                          }
                        />
                        {formData.BodyTypes.length > 1 && (
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteBodyType(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() =>
                        setFormData((prevState) => ({
                          ...prevState,
                          BodyTypes: [...prevState.BodyTypes, ""],
                        }))
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Body Type
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button type="submit" disabled={loading} onClick={handleSubmit} size="lg">
            {loading ? <span className="loader"></span> : "Submit"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
