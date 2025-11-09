import React, { useState,useEffect, useRef } from "react";
import MaxWidthWrapper from "../../../component/MaxWidthWrapper";
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
import { FaCloudUploadAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useSelector, useDispatch } from 'react-redux'
import { setNewListing } from "../../../slices/listingSlice";
import {useNavigate ,useParams} from "react-router-dom"
import { useCreateListingMutation } from '../../../slices/apiSlices/carListingApiSlice'
import {toast} from '../../../component/ui/use-toast'


const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];

const imageUploadSchema = z.object({
    images: z
        .any()
        .refine((files) => files?.length > 0, "Please upload at least one image.")
        .refine(
            (files) => files && Array.from(files).every((file) => ALLOWED_FORMATS.includes(file.type)),
            "Only jpg, jpeg, and png formats are allowed."
        )
        .refine(
            (files) => files && Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
            "Each file should be less than 2MB."
        ),
});

const VehicleLooks = ( newListing ) => {
    const inputRef = useRef();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedFiles , setUploadedFiles] = useState([]);
    const navigate = useNavigate();
    const [createListing, { isLoading, isSuccess, isError , error, data }] = useCreateListingMutation();
    const {id} =useParams();

    useEffect(() => {
        console.log(newListing?.data?.images); // Check the structure here
        if (newListing?.data?.images) {
            setUploadedFiles(newListing?.data?.images);
        }
    }, [newListing]);
    
    const goBack = () => {
      navigate(-1); // This is equivalent to history.goBack()
    };

    const handleImagePreview = (files) => {
        const newFiles = Array.from(files);
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

        // Combine with existing files
        setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
        setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    };

    const handleFileChange = (files) => {
        handleImagePreview(files);
    };

    const handleFileRemove = (index) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    };

    const form = useForm({
        resolver: zodResolver(imageUploadSchema),
        // defaultValues: {
        //     ...newListing 
        //   }
    });

    const onSubmit = async (data) => {
        console.log(data);
    
        const formData = new FormData();
        
        // Append files from FileList
        Array.from(data.images).forEach((file) => {
            formData.append('images', file);
        });
    
        // Append other fields
        formData.append('id', id);
   
    
        try {
            const response = await createListing({ formData, step: '3' }).unwrap();

            
            if ( isSuccess) {
                toast({
                    title: "Success",
                    description: "Images uploaded successfully.",
                    status: "success",
                });
            }
            
            navigate(`/admin/all_listings/draft/vehicle/${id}`);


        } catch (error) {
            toast({
                title: "Error",
                description: error?.data?.message || "Failed to create the listing.",
                status: "error",
                variant: "destructive",
            });
        }
    };
    
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles && droppedFiles.length > 0) {
            handleFileChange(droppedFiles);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className="my-10">
            <div className="flex justify-center items-center flex-col gap-2">
                <div className="text-3xl font-bold font-inter">Set Vehicle Looks</div>
                <Separator className="mt-2 w-80" />
            </div>
            <div className="flex my-6 justify-center w-full items-center flex-col gap-2">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4 w-full font-normal text-base justify-center items-center"
                    >
                        <FormField
                            name="images"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="w-full flex flex-col gap-2 justify-center items-center">
                                    <FormLabel>Upload Images</FormLabel>
                                    <FormControl>
                                        <div className="w-2/3 flex flex-col justify-center items-center">
                                            <Input
                                                id="file-upload"
                                                type="file"
                                                className="sr-only w-20"
                                                ref={inputRef}
                                                multiple
                                                hidden
                                                accept="image/jpeg, image/png, image/jpg"
                                                onChange={(e) => {
                                                    handleFileChange(e.target.files);
                                                    field.onChange(e.target.files);
                                                }}
                                            />

                                            <div
                                                onClick={() => inputRef.current.click()}
                                                className={`h-52 w-full rounded-lg border p-4 ${dragActive ? "border-blue-500" : "border-gray-300"
                                                    }`}
                                                onDragEnter={handleDragEnter}
                                                onDragLeave={handleDragLeave}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => {
                                                    handleDrop(e);
                                                    field.onChange(e.dataTransfer.files);
                                                }}
                                            >
                                                <div className="mt-2 flex flex-col gap-2 justify-center">
                                                    <div className="text-center flex flex-col justify-center items-center">
                                                        <div className="mt-4 flex text-sm leading-6">
                                                            <label
                                                                htmlFor="file-upload"
                                                                className="cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                            >
                                                                <span className="z-0">Upload a file or drag and drop</span>
                                                            </label>
                                                        </div>
                                                        <p className="text-xs leading-5">PNG, JPG, up to 2MB</p>
                                                        <div>
                                                            <Button type='button' variant='btn' className='mt-6'>
                                                                <FaCloudUploadAlt className="mr-2" />
                                                                Upload Photos
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    <div className="mt-4 grid grid-cols-3 gap-4">
                                        {imagePreviews.map((src, index) => (
                                            <div key={index} className="relative bg-slate-100 rounded">
                                                <img
                                                    src={src}
                                                    alt={`preview-${index}`}
                                                    className="w-32 h-32 object-cover object-center rounded"
                                                />
                                                <div
                                                    className="absolute w-8 h-8 top-2 right-2 p-2 bg-indigo-500 text-white font-semibold flex justify-center items-center text-2xl rounded-lg cursor-pointer"
                                                    onClick={() => handleFileRemove(index)}
                                                >
                                                    <RxCross2 />
                                                </div>
                                            </div>
                                        ))}
                                        {uploadedFiles?.map((file, index) => (
                                            <div key={file?._id || index} className="relative bg-slate-100 rounded">
                                                <img
                                                    src={file.fileurl}
                                                    alt={`preview-${index}`}
                                                    className="w-32 h-32 object-cover object-center rounded"
                                                />
                                                <div
                                                    className="absolute w-8 h-8 top-2 right-2 p-2 bg-indigo-500 text-white font-semibold flex justify-center items-center text-2xl rounded-lg cursor-pointer"
                                                >
                                                    <RxCross2 />
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 w-96 gap-10 mt-8">
                            <Button type='button' onClick={goBack} variant="secondary">Back</Button>
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

export default VehicleLooks;




