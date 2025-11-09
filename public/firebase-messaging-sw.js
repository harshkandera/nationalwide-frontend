importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = { 
    apiKey: "AIzaSyBQ-5IH0i_mWCL4SB8HHrYXuKQ2t_VO7P4",
    authDomain: "movie-e7e4e.firebaseapp.com",
    databaseURL:"https://movie-e7e4e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId:"movie-e7e4e",
    storageBucket: "movie-e7e4e.appspot.com",
    messagingSenderId:"586418239627",
    appId: "1:586418239627:web:7e47656aa5c5039d3ffc8e",
    measurementId:"G-DL6W225Q17" 
};


const initializeMessaging = async () => {

  try {
      const isSupportedBrowser = await firebase.messaging.isSupported();

      console.log('sw: isSupportedBrowser', isSupportedBrowser);
      
      if (isSupportedBrowser) {

          const messaging = firebase.messaging();
          messaging.onBackgroundMessage((payload) => {
              console.log("[firebase-messaging-sw.js] Received background message", payload);
              const notificationTitle = payload.notification.title;
              const notificationOptions = {
                  body: payload.notification.body,
                  icon: payload.notification.image,
              };
              self.registration.showNotification(notificationTitle, notificationOptions);
          });

      } else {

          console.warn("Firebase Messaging is not supported in this browser.");

      }
  } catch (err) {

      console.error("Error checking Firebase Messaging support:", err);

  }
};

initializeMessaging();


// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.image,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
  
// });


