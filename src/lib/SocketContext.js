import React, { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setupSocketListeners,
  emitNewHighestBid,
  joinCarRoom,
  socket 

} from "../slices/socketSlice";

// Create context
const SocketContext = createContext();

// Custom hook for consuming the context
export const useSocket = () => {
  return useContext(SocketContext);
};

// Context provider component
export const SocketProvider = ({ children }) => {
  
  const dispatch = useDispatch();
  const { savedCars, biddingHistory } = useSelector((state) => state.listing);

  useEffect(() => {
    const savedCarIds = savedCars.map((car) => car.carId);
    const bidIds = biddingHistory.map((bid) => bid.bidId);

    const combinedCarIds = [...new Set([...savedCarIds, ...bidIds])];

    const cleanupListeners = dispatch(setupSocketListeners());

    combinedCarIds.forEach((carId) => {
      joinCarRoom(carId);
    });

    return () => {
      cleanupListeners();
    };
  }, [dispatch, savedCars, biddingHistory]);

  // Context value that will be passed to the provider
  const socketFunctions = {
    emitNewHighestBid,
    socket
  };

  return (
    <SocketContext.Provider value={socketFunctions}>
      {children}
    </SocketContext.Provider>
  );
};
