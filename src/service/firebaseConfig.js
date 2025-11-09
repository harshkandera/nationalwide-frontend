// src/notifications/firebase-config.js

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken, onMessage ,isSupported } from 'firebase/messaging';

// Use environment variables for Firebase configuration
const firebaseConfig = {
  
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let messaging;

// Initialize messaging only if supported
(async () => {
  
  const messagingSupported = await isSupported();

  if (messagingSupported) {
    messaging = getMessaging(app);
  } else {
    console.warn("Firebase Messaging is not supported in this environment.");
  }
})();

// Export services
export { app, database, messaging, getToken, onMessage };