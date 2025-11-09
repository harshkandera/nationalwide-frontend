const BASE_URL = process.env.REACT_APP_BASE_URL;

export const authentication ={

    SIGN_UP : BASE_URL + '/api/signup',
    SEND_OTP: BASE_URL + '/api/sendotp',
    LOGIN : BASE_URL + '/api/login',

}