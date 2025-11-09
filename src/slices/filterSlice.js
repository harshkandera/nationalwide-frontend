import { createSlice } from "@reduxjs/toolkit";

// Initial filter state
const initialState = {

  filter:{
    keyword: "",
    make: "",
    model: "",
    fromyear: undefined,
    tillyear: undefined,
    price: '',
    kms_driven: '',
    bodyType: ''
  },
  searchBox:{
    keyword: "",
    status:'all'
  }
  ,

};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
   
    setFilterData(state, action) {
      state.filter = action.payload;
    },

    setSearchBoxData(state, action) {
        state.searchBox = action.payload;
    },

    clearFilterData(state) {
      state.filter = {
        keyword: "",
        make: "",
        model: "",
        fromyear: undefined,
        tillyear: undefined,
        price: '',
        kms_driven: '',
        bodyType: ""
      };
    },


  },
});

// Export actions
export const { setFilterData, clearFilterData ,setSearchBoxData  } = filterSlice.actions;

export default filterSlice.reducer;
