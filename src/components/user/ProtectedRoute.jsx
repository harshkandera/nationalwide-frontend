import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { Navigate, Outlet } from 'react-router-dom';
import { setToken } from '../../slices/authSlice'
import { setIstoken, setUser } from '../../slices/profileSlice'
import { useToast } from "../../component/ui/use-toast";
// Utility function to get a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { user , istoken } = useSelector((state) => state.profile);
const {token:localToken} = useSelector((state) => state.auth);


  useEffect(() => {

    const token = getCookie('token') || localToken;

    console.log("token:",getCookie('token'));

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        const tokenValid = currentTime < decodedToken.exp;
        dispatch(setIstoken(tokenValid));
      } catch (error) {
        console.error('Error decoding token:', error);
        dispatch(setIstoken(false));
      }
    } else {
      handleInvalidToken();
    }

    function handleInvalidToken() {
      dispatch(setIstoken(false));
      dispatch(setToken(null));
      dispatch(setUser(null));
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem('persist:root');
    }

  }, [dispatch]);

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  if (user.accountType !== 'User') {
    return <Navigate to="/" />;
  }

  if (!istoken) {
    return <Navigate to="/sign-in" />;
  }

  if ( !user.username || !user.phone || !user.isProfileCompleted) {
toast({
  variant: "destructive",

  title: "Profile Incomplete",
  description: "Please complete your profile to access this page.",
})
    return <Navigate to={`/profile/${encodeURIComponent(user.email)}`} />;
  }


  return <Outlet />;
};

export default ProtectedRoute;
