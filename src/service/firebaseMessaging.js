
import { getToken, onMessage, isSupported } from 'firebase/messaging';
import { messaging } from './firebaseConfig';
import { apiConnector } from './apiconnector';


export const requestNotificationPermission = async () => {

  if ('Notification' in window) {

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.warn('Notification permission not granted.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  } else {
    console.warn('Notifications are not supported in this browser.');
  }

};

export const requestFirebaseToken = async () => {

  if ('Notification' in window) {

    const messagingSupported = await isSupported();

    if (!messagingSupported) {
      console.warn('Firebase Messaging is not supported in this environment.');
      return;
    }

    try {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
      });

      if (token) {
        console.log("FCM Token:", token);

        // Send the token to your server for registration
        const res = await apiConnector('POST', `${process.env.REACT_APP_BASE_URL}/api/register_token`, { fcmtoken: token });
        console.log(res);
      } else {
        console.warn("No registration token available. Request permission to generate one.");
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  } else {
    console.warn('Notifications are not supported in this browser.');
  }
};


const initializeOnMessageHandler = async () => {

  const messagingSupported = await isSupported();

  if (!messagingSupported) {
    console.warn('Firebase Messaging is not supported in this environment.');
    return;
  }

  onMessage(messaging, (payload) => {
    console.log('Message received.', payload);

    if (!('Notification' in window)) {
      console.warn('Notifications are not supported in this browser.');
      return;
    }

    const { title, body, image } = payload.notification || {};
    if (title && body) {
      try {
        new Notification(title, {
          body,
          icon: image,
        });
      } catch (error) {
        console.error("Error displaying notification:", error);
      }
    } else {
      console.warn('Invalid notification payload:', payload);
    }
  });
};

initializeOnMessageHandler();
