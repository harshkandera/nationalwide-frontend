// reducer/index.js
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage or sessionStorage for persistence

// Import your reducers
import otpReducer from '../slices/otpSlice';
import listingReducer from '../slices/listingSlice';
import authReducer from '../slices/authSlice';
import profileReducer from '../slices/profileSlice';
import { listingApiSlice } from '../slices/apiSlices/carListingApiSlice'; 
import filterReducer from '../slices/filterSlice';
import firebaseReducer from '../slices/fireBaseSlice';
import socket from "../slices/socketSlice";
import adminFilter from '../slices/adminFilter';

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  otp: otpReducer,
  listing: listingReducer,
  [listingApiSlice.reducerPath]: listingApiSlice.reducer,
  bid: firebaseReducer ,
  socket:socket,
  filter: filterReducer,
  adminFilter: adminFilter
});

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  whitelist: ['auth', 'profile', 'otp', 'listing' ,'adminFilter'],
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
