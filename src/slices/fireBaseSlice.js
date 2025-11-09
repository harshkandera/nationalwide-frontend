import { createSlice } from '@reduxjs/toolkit';
import { getDatabase, ref, onValue } from 'firebase/database';
import { database } from '../service/firebaseConfig';

const bidSlice = createSlice({
  name: 'bid',
  initialState: {
    highestBid: null,
    loading: true,
    error: null,
    bids: {}, 
  },
  
  reducers: {

    setHighestBid(state, action) {
      state.highestBid = action.payload;
      state.loading = false;
    },
    setBid(state, action) {
      const { carId, carData } = action.payload;
      state.cars[carId] = carData; 
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    }
  }

});

export const listenToHighestBid = ({carId}) => (dispatch) => {
  if (!carId) {
    dispatch(setError('Invalid car ID'));
    return;
  }

  const carBidRef = ref(database, `cars/${carId}/highestBid`);

  dispatch(setLoading(true));

  const unsubscribe = onValue(carBidRef, (snapshot) => {
    const data = snapshot.val();
    dispatch(setHighestBid(data));
  }, (error) => {
    dispatch(setError(error.message));
  });

  return unsubscribe; // Return unsubscribe function to clean up listener
};


export const listenToMultipleCars = (carIds) => (dispatch) => {
  
  if (!carIds || carIds.length === 0) {
    dispatch(setError('Invalid car IDs'));
    return;
  }

  dispatch(setLoading(true));

  const listeners = [];

  carIds.forEach(carId => {
    const carRef = ref(database, `cars/${carId}`);

    const unsubscribe = onValue(carRef, (snapshot) => {
      const carData = snapshot.val();
      if (carData) {
        dispatch(  setBid({ carId, carData }));
      }
    }, (error) => {
      dispatch(setError(error.message));
    });

    listeners.push(unsubscribe); // Keep track of unsubscribers
  });

  return () => {
    // Clean up listeners when the component is unmounted or IDs change
    listeners.forEach(unsubscribe => unsubscribe());
  };
};



export default bidSlice.reducer;
export const { setHighestBid, setLoading,  setBid , setError } = bidSlice.actions;
