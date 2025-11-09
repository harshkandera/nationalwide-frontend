import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "../component/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiConnector } from "../service/apiconnector";
import { Button } from "../component/ui/button";
import { BiImage } from "react-icons/bi";
import { Icons } from "../assests/Icons";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSolidUserCheck } from "react-icons/bi";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../component/ui/form";
import { Input } from "../component/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "../component/ui/select";
import "./signin.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { setUser } from "../slices/profileSlice";
import SearchAddress from "../component/ui/search-address";
import { countries, getCountryData, getCountryCode } from "countries-list";

// Updated Zod schema for validation
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

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { signUpData } = useSelector((state) => state.otp) || {};
  const [phone, setPhone] = useState(user?.phone);

  const email = signUpData?.email || user?.email;

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
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
        formDataToSend.append("image", image);
      }
      const result = await apiConnector(
        "POST",
        `${process.env.REACT_APP_BASE_URL}/api/profileupdate`,
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

      if (!token) {
        navigate("/sign-in");
      } else {
        navigate("/");
      }
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

  const handleDeleteImage = () => {
    setImage(null);
    inputRef.current.value = "";
  };

  return (
    <div className="font-inter min-h-screen mb-20 mt-10 sm:mb-10 sm:mt-0 w-full flex justify-center items-center p-4">
      <div className="flex flex-col justify-center items-center w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-richblue-200 font-normal text-center md:text-start w-full">
          <h1 className="text-2xl md:text-4xl font-bold text-center">
            Complete Your
            <span className="text-richblue-100 font-bold"> Profile</span>
          </h1>
        </div>

        <div className="flex flex-col mt-6 md:mt-10 justify-start items-center w-full">
          {/* Image Upload Section */}
          <div className="flex justify-start items-center gap-2 mb-6">
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
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover cursor-pointer object-center"
                  alt=""
                  onClick={() => inputRef.current.click()}
                />
              ) : (
                <Icons.photo
                  className="w-16 h-16 md:w-20 md:h-20 cursor-pointer rounded-full"
                  onClick={() => inputRef.current.click()}
                />
              )}
            </div>

            <div className="flex-col flex">
              {image && (
                <Button
                  variant=""
                  size="sm"
                  className="border-[1px]"
                  onClick={handleDeleteImage}
                >
                  <AiOutlineDelete className="" />
                </Button>
              )}
            </div>
          </div>

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
                            onValueChange={(value) => field.onChange(value)}
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

                      navigate('/');

                    }}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    variant="btn"
                    size="lg"
                  >
                    {loading ? <span className="loader"></span> : "Submit"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

// export default function StepperDemo() {
//    return (
//       <div className="flex w-full flex-col gap-4">
//          <Stepper initialStep={0} steps={steps}>
//             {steps.map((stepProps, index) => {
//                return (
//                   <Step key={stepProps.label} {...stepProps}>

//                   </Step>
//                )
//             })}
//             <Footer />
//          </Stepper>
//       </div>
//    )
// }

// function Footer() {
//    const {
//       nextStep,
//       prevStep,
//       resetSteps,
//       isDisabledStep,
//       hasCompletedAllSteps,
//       isLastStep,
//       isOptionalStep,
//    } = useStepper()
//    return (
//       <>
//          {hasCompletedAllSteps && (
//             <div className="bg-secondary text-primary my-2 flex h-40 items-center justify-center rounded-md border">
//                <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
//             </div>
//          )}
//          <div className="flex w-full justify-end gap-2">
//             {hasCompletedAllSteps
//                ? (
//                      <Button size="sm" onClick={resetSteps}>
//                         Reset
//                      </Button>
//                   )
//                : (
//                      <>
//                         <Button
//                            disabled={isDisabledStep}
//                            onClick={prevStep}
//                            size="sm"
//                            variant="secondary"
//                         >
//                            Prev
//                         </Button>
//                         <Button size="sm" onClick={nextStep}>
//                            {isLastStep ? 'Finish' : isOptionalStep ? 'Skip' : 'Next'}
//                         </Button>
//                      </>
//                   )}
//          </div>
//       </>
//    )
// }
