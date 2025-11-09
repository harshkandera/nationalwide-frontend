import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { apiConnector } from "../service/apiconnector";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../component/ui/use-toast";
import { setToken } from "../slices/authSlice";
import { setUser, setIstoken } from "../slices/profileSlice";
import Img3 from "../assests/img3.svg";
import { Button } from "../component/ui/button";
import { BiShowAlt, BiHide } from "react-icons/bi";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../component/ui/form";
import Profile from "../pages/Profile";
import { Input } from "../component/ui/input";
import { IoIosArrowBack } from "react-icons/io";
import "./signin.css";
import SEO from "../service/helmet";

// Zod validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const goBack = () => {
    navigate(-1);
  };

  // React Hook Form setup

  const form = useForm({ resolver: zodResolver(loginSchema) });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log(data);

      const result = await apiConnector(
        "POST",
        `${process.env.REACT_APP_BASE_URL}/api/login`,
        data
      );

      if (!result.data.success) {
        toast({
          variant: "destructive",
          title: result.data.message || "Failed to Login",
        });
        throw new Error(result.data.message);
      }

      toast({
        title: "Logged in successfully",
      });

      const sendData = {
        email: result.data.data?.email,
        username: result.data.data?.username,
        id: result.data.data?._id,
        image: result.data.data?.image,
        phone: result.data.data?.phone,
        accountType: result.data.data?.accountType,
        isProfileCompleted: result?.data?.data?.isProfileCompleted || false,
        isSubscribedToNotifications:
          result?.data?.data?.isSubscribedToNotifications,
        companyName: result?.data?.data?.companyName,
        street: result?.data?.data?.street,
        city: result?.data?.data?.city,
        state: result?.data?.data?.state,
        pincode: result?.data?.data?.pincode,
        country: result?.data?.data?.country,
        firstname: result?.data?.data?.firstname,
        lastname: result?.data?.data?.lastname,
      };

      dispatch(setUser(sendData));

      dispatch(setToken(result.data.data.token));

      dispatch(setIstoken(true));

      navigate("/");
    } catch (err) {
      setLoading(false);

      const errorMessage = err.response?.data?.message;

      if (errorMessage) {
        // Check if the error message mentions "email" or "password"
        if (errorMessage.toLowerCase().includes("email")) {
          form.setError("email", {
            type: "manual",
            message: errorMessage, // Set the error message for email
          });
        } else if (errorMessage.toLowerCase().includes("password")) {
          form.setError("password", {
            type: "manual",
            message: errorMessage, // Set the error message for password
          });
        } else {
          toast({
            variant: "destructive",
            title: errorMessage,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const title =
    "Log In to Your nationwide-motors Account | Secure Car Auction Platform";
  const description =
    "Log in to your nationwide-motors account to bid on cars, manage your listings, and access exclusive auction features. Join our community of car enthusiasts today!";
  const keywords =
    "log in nationwide-motors, nationwide-motors login page, car auction platform access, secure car auctions, online car auction login, user account login, nationwide-motors account access";
  const image =
    "https://res.cloudinary.com/dgty4nzfo/image/upload/v1730490306/ProfileImages/jcwqlpwopnb2cf9sdchr.png";
  const url = "https://nationwide-motors.com/sign-in";

  return (
    <>
      <SEO
        title={title}
        description={description}
        image={image}
        url={url}
        keywords={keywords}
      />

      <div className="max-w-screen h-screen bg-richblue-100 sm:bg-white w-full   mb-0 font-inter  ">
        <div className="p-6 sm:hidden">
          <Button
            variant="btn"
            onClick={goBack}
            className="font-bold p-0  h-10 w-10 rounded-md"
          >
            <IoIosArrowBack className="text-xl " />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-t-3xl justify-center md:justify-end h-full  items-center gap-8">
          <div className="flex flex-col justify-center items-center mt-20">
            {location.pathname === "/profile" ? (
              <Profile />
            ) : (
              <div className="flex flex-col justify-center items-center">
                <div className="text-richblue-200 font-normal flex flex-col justify-center items-center">
                  <h1 className="text-4xl font-bold">Welcome Back To</h1>
                  <h1>
                    <span className="text-richblue-300 text-4xl font-bold m-4 text-richblue-100">
                      nationwide-motors
                    </span>
                  </h1>
                </div>
                <div className="p-4">
                  <ul className="flex justify-end gap-2 pr-4 text-richblue-900 font-[400] text-lg">
                    <li>Don't have an account?</li>
                    <li className="text-richblue-100">
                      <Link to="/sendotp">Sign up</Link>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-wrap-reverse w-8/12 justify-center items-center mx-auto">
                  <div className="m-10 text-richblue-900">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-2 text-lg font-normal relative space-y-2"
                      >
                        <FormField
                          name="email"
                          control={form.control}
                          className="text-lg font-normal font-inter m-0"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-normal font-inter p-0 m-0">
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="Enter your email"
                                  className="border-[1px] ring-0 rounded-md p-2 w-72 focus:outline-0"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          name="password"
                          control={form.control}
                          className="text-lg font-normal font-inter m-0"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-normal font-inter p-0 m-0">
                                Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="border-[1px] rounded-md ring-0 p-2 w-72 focus:outline-0"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-4 pr-3 flex items-center"
                                  >
                                    {showPassword ? <BiHide /> : <BiShowAlt />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center justify-center mt-8">
                          <Button
                            type="submit"
                            disabled={loading}
                            variant="btn"
                            className="drop-shadow-xl w-72 py-0 px-0 text-lg"
                          >
                            {" "}
                            {loading ? (
                              <span className="loader"></span>
                            ) : (
                              "Submit"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                    <div className="p-2">
                      <ul className="flex justify-center gap-2 pr-4 text-richblue-900 font-[400] text-lg">
                        <li className="text-richblue-100">
                          <Link to="/forgot_password">Forgot password?</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
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

export default Login;
