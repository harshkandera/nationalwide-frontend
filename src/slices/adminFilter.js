import { createSlice } from "@reduxjs/toolkit";
import { set } from "date-fns";

const initialState = {

 adminFilter:{ 
  upcomingAuctionsLimit : 10,
  draftListingsLimit : 10,
  recentBidsLimit : 10,
  newUsersLimit : 10,
  recentWinnersLimit : 10,}
  ,
  category: "cars",
  allAuctionCategory: "cars",
  allAuctionStatus: "all",
  browseAuctionCategory: "cars",

};

const adminfilterSlice = createSlice({
    
  name: "adminfilterSlice",
  initialState,
  reducers: {


    setAdminFilterData(state, action) {
      if (state.adminFilter) {
        state.adminFilter = { 
          ...state.adminFilter,
          ...action.payload,
        };
      } else {
        state.adminFilter = action.payload;
      }
    },
    setCategory(state, action) {
      state.category = action.payload;
    },

    setAllAuctionCategory(state, action) {
      state.allAuctionCategory = action.payload;
    },

    setAllAuctionStatus(state, action) {
      state.allAuctionStatus = action.payload;
    },

    setBrowseAuctionCategory(state, action) {
      state.browseAuctionCategory = action.payload;
    },



  },
});

export const { setAdminFilterData , setCategory , setAllAuctionCategory , setAllAuctionStatus , setBrowseAuctionCategory} = adminfilterSlice.actions;

export default adminfilterSlice.reducer;
