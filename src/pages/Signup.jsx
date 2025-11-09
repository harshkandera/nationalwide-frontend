import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Img3 from "../assests/img3.svg";
import { Button } from "../component/ui/button";
import { FiSend } from "react-icons/fi";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../component/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../component/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../component/ui/input-otp";
import { IoIosArrowBack } from "react-icons/io";

// import OtpInput from 'react-otp-input';
import { apiConnector } from "../service/apiconnector";

const Signup = () => {
  const location = useLocation();

  const { signUpData:email } = useSelector((state) => state.otp) || {};
  
  const goBack = () => {
    navigate(-1);
  };
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const signupSchema = z.object({
    otp: z
      .string()
      .min(6, { message: "OTP must be 6 digits" })
      .regex(/^\d+$/, { message: "OTP must only contain numbers" }),
  });

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const { otp } = data;
      setLoading(true);
      const formData = {
        email,
        otp,
      };

      const endpoint =
        location.pathname === "/change_password"
          ? "/api/change_password"
          : "/api/signup";

      const result = await apiConnector(
        "POST",
        `${process.env.REACT_APP_BASE_URL}${endpoint}`,
        formData
      );

      if (!result.data.success) {
        toast({
          variant: "destructive",
          title: result.data.message || "Failed to sign up",
        });
        throw new Error(result.data.message);
      }

      navigate(`/profile/${encodeURIComponent(email)}`);

      toast({
        title: "Sign up successful",
        description: "your account create successfully",
      });
      
    } catch (err) {
      const errorMessage = err.response?.data?.message;

      if (errorMessage.toLowerCase().includes("otp")) {
        form.setError("email", {
          type: "manual",
          message: errorMessage, // Set the error message for email
        });
      } else {
        toast({
          variant: "destructive",
          title: errorMessage,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-screen bg-richblue-100 sm:bg-white h-screen w-full   mb-0 font-inter  ">
        <div className="p-6 sm:hidden">
          <Button
            variant="btn"
            onClick={goBack}
            className="font-bold p-0  h-10 w-10 rounded-md"
          >
            <IoIosArrowBack className="text-xl " />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 bg-white justify-center rounded-t-3xl md:justify-end h-full  items-center gap-8">
          <div className="flex flex-col justify-center items-center m-0">
            <div className="mb-2 text-richblue-200 font-normal text-center ">
              <h1 className="text-4xl font-bold">
                {location.pathname === "/change_password"
                  ? "Change your"
                  : "Create your Account"}
                <span className="font-bold text-4xl text-richblue-100">
                  {location.pathname === "/change_password" ? " Password" : ""}{" "}
                </span>
              </h1>

              <h1>
                <div className="font-bold text-4xl text-richblue-100">
                  {location.pathname === "/forgot_password"
                    ? ""
                    : "For nationwide-motors"}
                </div>
              </h1>
            </div>

            <div className="p-4">
              <ul className="flex justify-end gap-2 pr-4 text-richblue-200 font-[400] text-lg">
                <li>Already a member?</li>
                <li className="text-richblue-100">
                  <Link to="/sign-in">Log in</Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap-reverse w-8/12 justify-center items-center mx-auto">
              <div className="m-10 flex flex-col ">
                <div className="flex flex-col  justify-center text-richblue-200 m-2 ">
                  <FiSend />
                  <p className="text-xl font-semibold">Check your email</p>
                  <p className="text-muted-foreground text-sm">
                    we've have sent a code to
                  </p>
                  <p className="text-richblue-100 text-sm underline">{email}</p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      name="otp"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-inter font-normal">
                            Enter OTP
                          </FormLabel>
                          <FormControl>
                            <InputOTP
                              maxLength={6}
                              {...field}
                              className="w-full"
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
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
                        {loading ? <span className="loader"></span> : "verify"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>

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
            <img src={Img3} alt="" className="h-[100vh] hidden md:block" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;



{
  /* <OtpInput
                            value={otp}
                            onChange={(value) => {
                              field.onChange(value);
                              setOtp(value);
                            }}
                            numInputs={6}
                            renderInput={(props) => (
                              <input
                                {...props}
                                type='text'
                                inputMode='numeric'
                                pattern='[0-9]*'
                              />
                            )}
                            inputStyle={{
                              border: '2px solid #0361FF',
                              borderRadius: '4px',
                              width: '2.5rem',
                              height: '2.5rem',
                              margin: '0 0.5rem',
                              fontSize: '1.5rem',
                              textAlign: 'center',
                              padding: '2px',
                            }}
                          /> */
}
