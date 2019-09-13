import firebase from "firebase/app";
import "firebase/messaging";

window.firebase = firebase;

const firebaseConfig = {
  apiKey: "AIzaSyAPj6p8DQLx9er2mSUHgHQb1aZK2HmDxAw",
  authDomain: "diary-5ef53.firebaseapp.com",
  databaseURL: "https://diary-5ef53.firebaseio.com",
  projectId: "diary-5ef53",
  storageBucket: "diary-5ef53.appspot.com",
  messagingSenderId: "223437832654",
  appId: "1:223437832654:web:289e30e4892bcd45c72b9f"
};

export const initializeFirebase = () => {
  firebase.initializeApp(firebaseConfig);
};

export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    window.messaging = messaging;
    await messaging.requestPermission();
    return await messaging.getToken();
  } catch (error) {
    console.error(error);
  }
};
