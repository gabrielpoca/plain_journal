import firebase from 'firebase/app';
import 'firebase/messaging';

export const initializeFirebase = () => {
  firebase.initializeApp({
    messagingSenderId: process.env.REACT_APP_SENDER_ID,
  });
};

export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    return await messaging.getToken();
  } catch (error) {
    console.error(error);
  }
};
