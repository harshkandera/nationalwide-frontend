import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { Navigate, Outlet } from 'react-router-dom';
import { setIstoken } from '../../slices/profileSlice';



function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}




const ProtectedRouteAdmin = ({ allowedRoles = ['Admin'] }) => {

  const dispatch = useDispatch();
  const { user, istoken } = useSelector((state) => state.profile);
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
      dispatch(setIstoken(false));
    }
  }, [dispatch]);


  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  if (!allowedRoles.includes(user.accountType)) {
    return <Navigate to="/" />;
  }

  if (!istoken) {
    return <Navigate to="/sign-in" />;
  }


  // Uncomment this block if you want to redirect to profile update if the profile is incomplete
  if (!user.username || !user.phone) {
    return <Navigate to="/profile" />;
  }

  return <Outlet />;
};

export default ProtectedRouteAdmin;