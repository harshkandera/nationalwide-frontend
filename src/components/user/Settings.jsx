import Dashboard from "./Dashboard";
import MaxWidthWrapper from "../../component/MaxWidthWrapper";
import { Link } from "react-router-dom";
import React, { useState, useRef } from "react";
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
                      className="w-20 h-20 md:w-32 md:h-32 cursor-pointer rounded-full"
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

        <Card className="w-full mt-8 mb-20">
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
      </div>
    </Dashboard>
  );
};

export default Signup;
