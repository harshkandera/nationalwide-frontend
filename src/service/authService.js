import jwtDecode from 'jwt-decode';

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  
  
export const checkTokenValidity = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return currentTime < decodedToken.exp;
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
};


export const getUser = () => {
  const token = getCookie('token');
  if (!token) return null;
  return jwtDecode(token); // Assumes token contains user data
};
