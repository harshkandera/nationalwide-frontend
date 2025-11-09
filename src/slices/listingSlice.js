// listingSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useGetUsersBidsQuery } from "./apiSlices/carListingApiSlice";
import {useEffect} from 'react'

const listingSlice = createSlice({
  name: "saved",
  initialState: {
    savedCars: [],
    biddingHistory: [],


  },
  reducers: {
    setSavedCar(state, action) {
      state.savedCars = action.payload;
    },
    setBiddingHistory(state, action) {
      state.biddingHistory = action.payload;
    },

  },
});

export const { setSavedCar , setBiddingHistory ,setFilterData} = listingSlice.actions;

export default listingSlice.reducer;

export const useFetchAndSaveUserBids = (userId) => {
  const dispatch = useDispatch();
  const { data: userBidsData, error, isLoading } = useGetUsersBidsQuery(userId);

  useEffect(() => {
    if (userBidsData) {
      const savedCars = userBidsData?.data?.cart?.map((car) => ({
        carId: car.carId._id,
        name: car.carId.name,
        price: car.carId.price,
        addedAt: car.addedAt,
      }));

      const biddingHistory = userBidsData?.data?.biddingHistory?.map((bid) => ({
        bidId: bid.bidId.car_id._id,
      }));

      

      dispatch(setBiddingHistory(biddingHistory));
      dispatch(setSavedCar(savedCars));
    }
  }, [userBidsData, dispatch]);

  return { userBidsData, error, isLoading };
};
