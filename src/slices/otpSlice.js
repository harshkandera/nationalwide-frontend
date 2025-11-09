import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    signUpData: null,
}

const otpSlice = createSlice({
    name: "otp",
    initialState: initialState,
    reducers: {
        
        setSignUpData(state, value) {
            state.signUpData = value.payload
        },

    },
}
)
export const { setSignUpData } = otpSlice.actions;
export default otpSlice.reducer;  