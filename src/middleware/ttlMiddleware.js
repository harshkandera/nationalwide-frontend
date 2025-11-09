// middleware/ttlMiddleware.js
import { checkExpiry, clearListing } from '../slices/listingSlice';

const ttlMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action);

  // Dispatch checkExpiry action
  // storeAPI.dispatch(checkExpiry());

  // const state = storeAPI.getState();
  // const currentTime = new Date().getTime();

  // // Check if TTL has expired and clear the listing if needed
  // if (state.listing.expiry && currentTime > state.listing.expiry) {
  //   storeAPI.dispatch(clearListing());
  // }

  return result;
};

export default ttlMiddleware;
