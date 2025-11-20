// pages/admin/testimonials.jsx

import React, { useState, useEffect } from "react";
import { Button } from "../../component/ui/button";
import { Input } from "../../component/ui/input";
import { Label } from "../../component/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../component/ui/select";
import { Textarea } from "../../component/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../component/ui/card";
import { Switch } from "../../component/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../component/ui/table";
import { toast } from "../../component/ui/use-toast";
import MaxWidthWrapper from "../../component/MaxWidthWrapper";
import { Trash2, Edit, Plus, Eye, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../component/ui/dialog";
import { apiConnector } from "../../service/apiconnector";

// Star Rating Component
const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`text-lg ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

// TestimonialForm Component
const TestimonialForm = ({
  formData,
  handleInputChange,
  handleMediaUpload,
  previewUrl,
  isEdit = false,
  onSubmit,
  onCancel,
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Customer Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="type">Review Type</Label>
        <Select
          name="type"
          value={formData.type}
          onValueChange={(value) =>
            handleInputChange({
              target: { name: "type", value },
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text Only</SelectItem>
            <SelectItem value="image">With Image</SelectItem>
            <SelectItem value="video">With Video</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="rating">Rating</Label>
        <Select
          name="rating"
          value={formData.rating.toString()}
          onValueChange={(value) =>
            handleInputChange({
              target: { name: "rating", value: Number(value) },
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((rating) => (
              <SelectItem key={rating} value={rating.toString()}>
                {rating} Star{rating > 1 ? "s" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    {formData.type === "image" && (
      <div className="space-y-2">
        <Label htmlFor="media">Upload Image</Label>
        <Input
          id="media"
          type="file"
          accept="image/*"
          onChange={handleMediaUpload}
        />
        {(previewUrl || formData.media) && (
          <div className="mt-2">
            <img
              src={previewUrl || formData.media}
              alt="Preview"
              className="max-h-40 rounded-md"
            />
          </div>
        )}
      </div>
    )}

    {formData.type === "video" && (
      <div className="space-y-2">
        <Label htmlFor="videoUrl">Video URL (YouTube/Vimeo)</Label>
        <Input
          id="videoUrl"
          name="videoUrl"
          type="url"
          value={formData.videoUrl}
          onChange={handleInputChange}
          placeholder="https://youtube.com/..."
        />
      </div>
    )}
    <div className="space-y-2">
      <Label htmlFor="dateOfExperience">Date of Experience *</Label>
      <Input
        id="date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleInputChange}
        max={new Date().toISOString().split("T")[0]} // Prevents future dates
        required
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="title">Review Title *</Label>
      <Input
        id="title"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        required
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="content">Review Content *</Label>
      <Textarea
        id="content"
        name="content"
        value={formData.content}
        onChange={handleInputChange}
        required
        rows={4}
      />
    </div>

    <div className="flex items-center space-x-2">
      <Switch
        id="verified"
        checked={formData.verified}
        onCheckedChange={(checked) => {
          handleInputChange({
            target: {
              name: "verified",
              type: "checkbox",
              checked,
            },
          });
        }}
      />
      <Label htmlFor="verified">
        Verified Review {formData.verified ? "(Verified)" : "(Unverified)"}
      </Label>
    </div>

    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">{isEdit ? "Update" : "Save"} Testimonial</Button>
    </div>
  </form>
);
// Continuing from the previous part...

export default function TestimonialsAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previousTestimonials, setPreviousTestimonials] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    rating: 5,
    title: "",
    content: "",
    type: "text",
    verified: false,
    media: null,
    videoUrl: "",
    date: new Date().toISOString().split("T")[0], // Add date of experience
  });

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await apiConnector(
          "GET",
          process.env.REACT_APP_BASE_URL + "/api/v2/get_reviews"
        );

        console.log(response);
        if (response?.data) {
          setTestimonials(
            response.data?.testimonials.map((t) => ({ ...t, id: t._id }))
          );
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Failed to fetch testimonials",
          variant: "destructive",
        });
      }
    };

    fetchTestimonials(); // Call the async function
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({
        ...prev,
        media: file,
      }));
    }
  };

  const isValidVideoUrl = (url) => {
    const videoUrlPattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com|vimeo\.com|youtu\.be)\/.*$/;
    return videoUrlPattern.test(url);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      rating: 5,
      title: "",
      content: "",
      type: "text",
      verified: false,
      media: null,
      videoUrl: "",
      date: new Date().toISOString().split("T")[0],
    });
    setPreviewUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.name || !formData.title || !formData.content) {
        throw new Error("Please fill in all required fields");
      }

      if (formData.type === "video" && !isValidVideoUrl(formData.videoUrl)) {
        throw new Error("Please enter a valid video URL");
      }

      // Create FormData object
      const formDataToSend = new FormData();

      // Add all the basic fields
      // formDataToSend.append('id', Date.now().toString());
      formDataToSend.append("name", formData.name);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("rating", formData.rating);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("verified", Boolean(formData.verified));
      formDataToSend.append("date", formData.date);
      formDataToSend.append("reviewCount", "1");
      formDataToSend.append("videoUrl", formData.videoUrl || "");

      // Append the file if it exists
      if (formData.media instanceof File) {
        formDataToSend.append("media", formData.media);
      }

      const result = await apiConnector(
        "POST",
        `${process.env.REACT_APP_BASE_URL}/api/v2/review`,
        formDataToSend,
        {
          "Content-Type": "multipart/form-data", // Important for file upload
        }
      );
      if (result.data.success) {
        const newTestimonial = {
          id: result.data.testimonial._id,
          ...formData,
          verified: Boolean(formData.verified),
          date: new Date().toISOString().split("T")[0],
          reviewCount: 1,
        };

        setTestimonials((prev) => [...prev, newTestimonial]);
        setIsAddDialogOpen(false);
        resetForm();
        toast({
          title: "Success",
          description: "Testimonial added successfully",
        });
      } else {
        throw new Error(result.message || "Failed to add testimonial");
      }

      // Make API call with FormData

      console.log(result);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (testimonial) => {
    setSelectedTestimonial(testimonial);

    setFormData({
      name: testimonial.name,
      location: testimonial.location,
      rating: testimonial.rating,
      title: testimonial.title,
      content: testimonial.content,
      type: testimonial.type,
      verified: Boolean(testimonial.verified),
      media: testimonial.media,
      videoUrl: testimonial.videoUrl || "",
      date:
        new Date(testimonial.date).toISOString().split("T")[0] ||
        testimonial.date,
    });
    setPreviewUrl(testimonial.media);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name || !formData.title || !formData.content) {
        throw new Error("Please fill in all required fields");
      }

      if (formData.type === "video" && !isValidVideoUrl(formData.videoUrl)) {
        throw new Error("Please enter a valid video URL");
      }

      // Create FormData object
      const formDataToSend = new FormData();

      // Add all the basic fields
      // formDataToSend.append('id', Date.now().toString());
      formDataToSend.append("name", formData.name);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("rating", formData.rating);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("verified", Boolean(formData.verified));
      formDataToSend.append("date", formData.date);

      formDataToSend.append("reviewCount", "1");
      formDataToSend.append("videoUrl", formData.videoUrl || "");

      // Append the file if it exists
      if (formData.media instanceof File) {
        formDataToSend.append("media", formData.media);
      }

      const result = await apiConnector(
        "POST",
        `${process.env.REACT_APP_BASE_URL}/api/v2/update_review/${selectedTestimonial._id}`,
        formDataToSend,
        {
          "Content-Type": "multipart/form-data", // Important for file upload
        }
      );

      if (result.data.success) {
        setTestimonials((prev) =>
          prev.map((item) =>
            item.id === selectedTestimonial.id
              ? {
                  ...item,
                  ...formData,
                  verified: Boolean(formData.verified),
                }
              : item
          )
        );

        toast({
          title: "Success",
          description: "Testimonial updated successfully",
        });
      } else {
        throw new Error(result.message || "Failed to updated testimonial");
      }

      setIsEditDialogOpen(false);
      resetForm();
      setSelectedTestimonial(null);

      toast({
        title: "Success",
        description: "Testimonial updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);

    try {
      const result = await apiConnector(
        "POST",
        process.env.REACT_APP_BASE_URL +
          `/api/v2/delete_review/${selectedTestimonial._id}`
      );

      if (!result.data.success) {
        throw new Error(result.data.message || "Failed to delete testimonial");
      }

      setPreviousTestimonials([...testimonials]);

      setTestimonials((prev) =>
        prev.filter((item) => item.id !== selectedTestimonial.id)
      );

      setIsDeleteDialogOpen(false);
      setSelectedTestimonial(null);

      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
    } catch (error) {
      setTestimonials(previousTestimonials);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Testimonials</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" /> Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Testimonial</DialogTitle>
                <DialogDescription>
                  Add a new customer testimonial to your website
                </DialogDescription>
              </DialogHeader>
              <TestimonialForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleMediaUpload={handleMediaUpload}
                previewUrl={previewUrl}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Testimonials</CardTitle>
            <CardDescription>
              Manage and edit your customer testimonials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">
                          {testimonial.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {testimonial.type}
                    </TableCell>
                    <TableCell>
                      <StarRating rating={testimonial.rating} />
                    </TableCell>
                    <TableCell>{testimonial.title}</TableCell>
                    <TableCell>
                      {new Date(testimonial.date).toISOString().split("T")[0]}
                    </TableCell>
                    <TableCell>
                      {testimonial.verified === true ? (
                        <span className="text-green-600">Verified</span>
                      ) : (
                        <span className="text-gray-500">Unverified</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(testimonial)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(testimonial)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {/* {(testimonial.type === "video" ||
                          testimonial.type === "image") && (
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )} */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Testimonial</DialogTitle>
              <DialogDescription>
                Update the testimonial information
              </DialogDescription>
            </DialogHeader>
            <TestimonialForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleMediaUpload={handleMediaUpload}
              previewUrl={previewUrl}
              isEdit={true}
              onSubmit={handleUpdate}
              onCancel={() => {
                setIsEditDialogOpen(false);
                resetForm();
                setSelectedTestimonial(null);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Testimonial</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this testimonial? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setSelectedTestimonial(null);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
