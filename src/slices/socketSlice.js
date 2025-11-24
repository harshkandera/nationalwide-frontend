// src/slices/socketSlice.js
import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";
import { toast } from "../component/ui/use-toast";
import { ToastAction } from "../component/ui/toast";
import { formatPrice } from "../lib/utils";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}



// Initialize socket connection
export const socket = io("https://nationwide-motors-llc.com", {
  path: "/socket.io/", // Specify the path for the WebSocket
  auth: {
    token: getCookie("token"), // Send token from cookies
  },
  withCredentials: true, 
  transports: ['websocket'], // Ensure using WebSockets, not polling
});

// export const socket = io("http://localhost:8000/", {
//   auth: {
//     token: getCookie("token"), // Send token from cookies
//   },
//   withCredentials: true, 
//   transports: ['websocket'],
// });



const socketSlice = createSlice({

  name: "socket",
  initialState: {
    notifications: [], 
    unreadCount: 0,
  },

  reducers: {
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
      state.unreadCount += 1; // Increment unread message count
    },
    markAllAsRead: (state) => {
      state.unreadCount -= 1;
    },
    clearNotifications: (state) => {
      state.notifications = []; // Clear all notifications
      state.unreadCount = 0; // Reset unread count
    },
  },
});

export const { addNotification, markAllAsRead, clearNotifications } =
  socketSlice.actions;
export default socketSlice.reducer;



export const setupSocketListeners = () => (dispatch) => {

  socket.on("connection", () => {
    console.log("Connected to server", socket.id);
  });

  socket.on("notify", (notification) => {
    console.log("Received notification:", notification);
    toast({
      title: `New Bid on ${notification.title}`,
      description: (
        <div className="flex flex-col justify-center mt-2 space-x-2">
          <div className="grid grid-cols-8 gap-2 justify-center mt-2">
            <div className="h-16 w-16 col-span-2 rounded-md overflow-hidden">
              <img
                src={notification?.image}
                alt="Car"
                className="object-cover object-center"
              />
            </div>

            <div className="text-sm col-span-6 font-inter">
              New highest bid placed on {notification?.title} for{" "}
              <strong>{formatPrice(notification?.bidAmount)}</strong>
            </div>
          </div>

          <ToastAction
            altText="Mark as Read"
            onClick={() => dispatch(markAllAsRead())}
          >
            Mark as Read
          </ToastAction>
        </div>
      ),
    });
    dispatch(addNotification(notification));
  });


  socket.on("newHighestBid", (data) => {
    console.log("Received new highest bid:", data);
  });

  // socket.on('updateHighestBid',(data)=>{
  //   console.log("Received new highest bid:", data);

  // })

  return () => {
    socket.off("connection");
    socket.off("notify");
    socket.off("newHighestBid");
  };

};
// Emit event to join a specific car room
export const joinCarRoom = (carId) => {
  socket.emit("joinCarRoom", carId);
};

// Emit event for a new highest bid
export const emitNewHighestBid = (title, carId, bidAmount, image) => {
  socket.emit("newHighestBid", {
    title,
    carId,
    bidAmount,
    image,
  });
};
