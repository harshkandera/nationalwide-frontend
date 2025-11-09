import React from 'react';
import { Button } from "../ui/button";
import { AlertCircle, X, ChevronRight, UserCircle2 } from "lucide-react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProfileCompletionBanner = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const [isVisible, setIsVisible] = React.useState(true);

  // Check if profile is incomplete (missing required fields)
  const isProfileIncomplete = !user?.isProfileCompleted || 
    !user?.firstname || 
    !user?.lastname || 
    !user?.phone || 
    !user?.country || 
    !user?.city || 
    !user?.state || 
    !user?.street || 
    !user?.pincode;


  if (!isProfileIncomplete || !isVisible) {
    return null;
  }


  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 md:py-4">
          <div className="flex items-center flex-1 min-w-0">
            <div className="flex-shrink-0">
              <IoAlertCircleOutline className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3 flex md:flex-1 space-x-12 md:justify-between items-center">
              <p className="text-sm text-blue-900 truncate">
                <span className="hidden md:inline">Please complete your profile to access all features. </span>
                <span className="md:hidden">Complete your profile</span>
                <span className="font-medium hidden md:inline">
                  {user?.firstname ? ` Welcome ${user.firstname}!` : ''}
                </span>
              </p>
              <div className="mt-2 md:mt-0 md:ml-6 flex items-center space-x-2">
                <Button 
                  variant="default"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-1"
                  onClick={() => navigate(`/profile/${user?.email}`)}
                >
                  <FaRegUserCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Complete Profile</span>
                  <span className="sm:hidden">Profile</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:bg-blue-200"
                  onClick={() => setIsVisible(false)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Dismiss</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default ProfileCompletionBanner;