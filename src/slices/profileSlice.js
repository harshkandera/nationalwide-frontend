import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  istoken: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,

  reducers: {
    setUser(state, action) {
      if (state.user) {
        state.user = { 
          ...state.user,
          ...action.payload,
        };
      } else {
        // If there's no user yet, set the user state directly
        state.user = action.payload;
      }
    },

    setIstoken: (state, action) => {
      state.istoken = action.payload;
    },
  },
});

export const { setUser, setIstoken } = profileSlice.actions;

export default profileSlice.reducer;
