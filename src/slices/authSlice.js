import { createSlice } from "@reduxjs/toolkit";

// Utility function to get a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const initialState = {
  token: getCookie('token') || null,  // Retrieve token from cookie
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload; 
    },
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
