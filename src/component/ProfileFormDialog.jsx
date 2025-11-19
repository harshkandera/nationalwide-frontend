import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiConnector } from "../service/apiconnector";
import { Button } from "./ui/button";
import { Icons } from "../assests/Icons";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSolidUserCheck } from "react-icons/bi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "./ui/select";
import { ScrollArea } from "../component/ui/scroll-area";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { setUser } from "../slices/profileSlice";
import SearchAddress from "./ui/search-address";
import { countries, getCountryData, getCountryCode } from "countries-list";

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

const ProfileFormDialog = ({
  trigger,
  open,
  onOpenChange,
  onSuccess,
  allowSkip,
  onSkip,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { signUpData } = useSelector((state) => state.otp) || {};
  const [phone, setPhone] = useState(user?.phone || "");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(open || false);

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

  const handleDeleteImage = () => {
    setImage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const countryData = await getCountryData(data.country);
      const countryName = countryData.name;

      const formData = {
        ...data,
        email: user?.email || signUpData?.email,
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

      // Close dialog
      setIsOpen(false);
      if (onOpenChange) onOpenChange(false);
      if (onSuccess) onSuccess(prevState);

      if (!token) {
        navigate("/sign-in");
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

  return (
    <Dialog
      open={open !== undefined ? open : isOpen}
      onOpenChange={onOpenChange || setIsOpen}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold">
                Complete Your <span className="text-richblue-100">Profile</span>
              </DialogTitle>
              <DialogDescription>
                Fill in your details to complete your profile
              </DialogDescription>
            </DialogHeader>

            {/* Image Upload Section */}
            <div className="flex justify-center items-center gap-3 mb-6">
              <div>
                <input
                  id="file-upload"
                  name="file"
                  type="file"
                  className="sr-only"
                  ref={inputRef}
                  hidden
                  onChange={handleImageChange}
                  accept="image/*"
                />
                {image || user?.image ? (
                  <img
                    src={image ? URL.createObjectURL(image) : user?.image}
                    className="w-20 h-20 rounded-full object-cover cursor-pointer object-center border-2 border-gray-200"
                    alt="Profile"
                    onClick={() => inputRef.current?.click()}
                  />
                ) : (
                  <Icons.photo
                    className="w-20 h-20 cursor-pointer rounded-full"
                    onClick={() => inputRef.current?.click()}
                  />
                )}
              </div>

              {image && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteImage}
                  className="h-8"
                >
                  <AiOutlineDelete className="mr-1" />
                  Remove
                </Button>
              )}
            </div>

            {/* Form Section */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="flex relative items-center">
                      <Input
                        type="text"
                        className="font-semibold pr-10"
                        value={user?.email || signUpData?.email || ""}
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
                          <Input placeholder="Enter username" {...field} />
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
                          <Input placeholder="Enter first name" {...field} />
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
                          <Input placeholder="Enter last name" {...field} />
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
                            }}
                            containerClass="w-full"
                            inputStyle={{
                              width: "100%",
                              height: "40px",
                              border: "1px solid #e5e7eb",
                              borderRadius: "0.375rem",
                            }}
                          />
                        </FormControl>
                        <FormMessage />
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
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Country */}
                  <FormField
                    name="country"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
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
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* State */}
                  <FormField
                    name="state"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter state/province"
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
                          <Input placeholder="Enter postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Street Address - Full Width */}
                <FormField
                  name="street"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className="flex justify-between items-center gap-3 pt-4">
                  
                  {/* {allowSkip && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        if (onSkip) onSkip();
                        onOpenChange(false);
                      }}
                    >
                      Skip & Continue
                    </Button>
                  )} */}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <span className="loader"></span>
                      ) : (
                        "Save Profile"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileFormDialog;
