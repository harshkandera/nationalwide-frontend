import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiConnector } from "../service/apiconnector";
import { useToast } from "../component/ui/use-toast";
import { useDispatch } from "react-redux";
import { setSignUpData } from "../slices/otpSlice";
import Img3 from "../assests/img3.svg";
import { Button } from "../component/ui/button";
import { Input } from "../component/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../component/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BiShowAlt, BiHide } from "react-icons/bi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "../component/ui/select";
import { countries } from "countries-list";
import { IoIosArrowBack } from "react-icons/io";
import SEO from "../service/helmet";

const formSchema = z
  .object({
    email: z
      .string()
      .min(3, "Email is required")
      .email("Please enter a valid email address")
      .max(255, "Email is too long"),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores, and hyphens"
      )
      .transform((val) => val.toLowerCase()),

    phone: z
      .string()
      .min(5, "Phone number must be at least 5 digits")
      .max(15, "Phone number is too long")
      .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password is too long"),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    firstname: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name is too long")
      .regex(
        /^[a-zA-Z\s-]+$/,
        "First name can only contain letters, spaces, and hyphens"
      ),

    lastname: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name is too long")
      .regex(
        /^[a-zA-Z\s-]+$/,
        "Last name can only contain letters, spaces, and hyphens"
      ),

    country: z.string().min(1, "Please select your country"),

    preferredLanguage: z
      .string()
      .min(1, "Please select your preferred language"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const languages = [
  { code: "en", name: "English" },
  { code: "de", name: "German" },
  { code: "pl", name: "Polish" },
  { code: "ro", name: "Romanian" },
  { code: "it", name: "Italian" },
  { code: "fr", name: "French" },
];

const Sendotp = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState("");
  const { toast } = useToast();

  const goBack = () => {
    navigate(-1);
  };

  // SEO configuration
  const title = "Create Your nationwide-motors Account | Secure Car Auction Platform";
  const description =
    "Join nationwide-motors's car auction platform. Create your account to start bidding on cars, manage listings, and explore exclusive deals.";
  const keywords =
    "create account nationwide-motors, car auction signup, vehicle auction registration, online car bidding account, nationwide-motors registration";
  const image =
    "https://res.cloudinary.com/dgty4nzfo/image/upload/v1730490025/ProfileImages/hnk0cn9pv6bz3tnaadnb.png";
  const url = "https://nationwide-motors.com/sendotp";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      phone: "",
      password: "",
      confirmPassword: "",
      firstname: "",
      lastname: "",
      country: "",
      preferredLanguage: "",
    },
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const email = data.email.toLowerCase();
      // console.log(data)
      // dispatch(setSignUpData(email));

      const result = await apiConnector(
        "POST",
        `${process.env.REACT_APP_BASE_URL}/api/sendotp`,
        data
      );

      if (!result.data.success) {
        throw new Error(result.data.message);
      }

      toast({
        title: "User created successfully",
        description: "Login to continue",
      });

      navigate("/sign-up");

      form.reset();
      
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      toast({
        variant: "destructive",
        title: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title={title}
        description={description}
        image={image}
        url={url}
        keywords={keywords}
      />

      <div className="max-w-screen bg-richblue-100   md:bg-white min-h-screen w-full mb-0 font-inter">
        <div className="p-6 sm:hidden">
          <Button
            variant="btn"
            onClick={goBack}
            className="font-bold p-0  h-10 w-10 rounded-md"
          >
            <IoIosArrowBack className="text-xl " />
          </Button>
        </div>
        <div className="grid grid-cols-1 pt-20 sm:pt-0 p-2 bg-white rounded-t-3xl md:grid-cols-2 justify-center md:justify-end h-full items-center gap-8">
          <div className="flex flex-col justify-center items-center m-0">
            <div className="mb-2 text-richblue-200 font-normal text-center">
              <h1 className="text-4xl font-bold">Create your Account</h1>
              <span className="font-bold text-4xl text-richblue-100">
                {" "}
                For nationwide-motors
              </span>
            </div>

            <div className="p-4">
              <ul className="flex justify-end gap-2 pr-4 text-richblue-200 font-[400] text-lg">
                <li>Already a member?</li>
                <li className="text-richblue-100">
                  <Link to="/sign-in">Log in</Link>
                </li>
              </ul>
            </div>

            <div className="w-full max-w-xl px-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              className="border-[1px] ring-0 rounded-md p-2 w-full  focus:outline-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Username Field */}
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Choose a username"
                              className="border-[1px] ring-0 rounded-md p-2 w-full focus:outline-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* First Name Field */}
                    <FormField
                      control={form.control}
                      name="firstname"
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

                    {/* Last Name Field */}
                    <FormField
                      control={form.control}
                      name="lastname"
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

                    {/* Phone Field */}
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
                                required: true,
                                className:
                                  "w-full p-2 border-[1px] rounded-md focus:outline-0",
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Country Selection */}
                    <FormField
                      name="country"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your country" />
                              </SelectTrigger>
                            </FormControl>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password Field */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={
                                  showPassword.password ? "text" : "password"
                                }
                                placeholder="Enter your password"
                                className="border-[1px] rounded-md ring-0 p-2 w-full focus:outline-0"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  togglePasswordVisibility("password")
                                }
                                className="absolute inset-y-0 right-4 pr-3 flex items-center"
                              >
                                {showPassword.password ? (
                                  <BiHide />
                                ) : (
                                  <BiShowAlt />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Confirm Password Field */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={
                                  showPassword.confirmPassword
                                    ? "text"
                                    : "password"
                                }
                                placeholder="Confirm your password"
                                className="border-[1px] rounded-md ring-0 p-2 w-full focus:outline-0"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  togglePasswordVisibility("confirmPassword")
                                }
                                className="absolute inset-y-0 right-4 pr-3 flex items-center"
                              >
                                {showPassword.confirmPassword ? (
                                  <BiHide />
                                ) : (
                                  <BiShowAlt />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Preferred Language */}
                    <FormField
                      name="preferredLanguage"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Language</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Languages</SelectLabel>
                                {languages.map((lang) => (
                                  <SelectItem key={lang.code} value={lang.code}>
                                    {lang.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-center mt-8">
                    <Button
                      type="submit"
                      disabled={loading}
                      variant="btn"
                      className="drop-shadow-xl w-[300px] py-0 px-0 text-lg"
                    >
                      {loading ? (
                        <span className="loader"></span>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            <div className="flex gap-4 justify-center mt-6">
              <Link to="/footer/terms">
                <p className="text-richblue-100">Terms of Use</p>
              </Link>
              <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
              <Link to="/footer/privacy">
                <p className="text-richblue-100">Privacy Policy</p>
              </Link>
            </div>
          </div>

          <div>
            <img
              src={Img3}
              alt="Background"
              className="h-[100vh] hidden md:block"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sendotp;

{
  /* <form onSubmit={location.pathname === '/forgot_password' ? SubmitHandler1 : SubmitHandler} className='flex flex-col text-lg font-normal relative'>

                  <label htmlFor="emailInput">Enter Your Email</label>
                  <input type="email" className='border-[1px] rounded-md p-2 w-72 focus:outline-0' placeholder='Email' name="email" value={email} onChange={changehandler} />
                  <label htmlFor='passwordInput'>Password</label>
                  <input
                    type={showPassword1 ? 'text' : 'password'}
                    className='border-[1px] rounded-md p-2 w-72 focus:outline-0'
                    placeholder='Password'
                    name='password'
                    value={password}
                    onChange={changeHandler}
                  />

                  {showPassword1 ? (
                    <BiHide className='absolute top-[112px] left-[255px] cursor-pointer' onClick={toggleHandler1} />
                  ) : (
                    <BiShowAlt className='absolute top-[112px] left-[255px] cursor-pointer' onClick={toggleHandler1} />
                  )}

                  <label htmlFor='passwordInput'>Confirm password</label>
                  <input
                    type={showPassword2 ? 'text' : 'password'}
                    className='border-[1px] rounded-md p-2 w-72 focus:outline-0'
                    placeholder='Confirm Password'
                    name='confirmPassword'
                    value={confirmPassword}
                    onChange={changeHandler}
                  />

                  {showPassword2 ? (
                    <BiHide className='absolute top-[180px] left-[255px] cursor-pointer' onClick={toggleHandler2} />
                  ) : (
                    <BiShowAlt className='absolute top-[180px] left-[255px] cursor-pointer' onClick={toggleHandler2} />
                  )}

                  <div className='flex items-center justify-center mt-8'>


                    <Button variant='btn' className='drop-shadow-xl w-full py-0 px-0 text-lg'>Next</Button>

                  </div>
                </form> */
}
