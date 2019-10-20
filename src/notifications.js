import firebase from "firebase/app";
import "firebase/messaging";
import { BehaviorSubject } from "rxjs";

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

export const token$ = new BehaviorSubject();

export const initializeFirebase = () => {
  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();
  window.messaging = messaging;

  messaging
    .getToken()
    .then(token => token$.next(token))
    .catch(() => console.log("token not available yet"));

  messaging.onTokenRefresh(() => {
    messaging
      .getToken()
      .then(refreshedToken => {
        token$.next(refreshedToken);
      })
      .catch(err => {
        console.log("Unable to retrieve refreshed token ", err);
      });
  });
};

export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    const token = await messaging.getToken();
    token$.next(token);
  } catch (error) {
    console.error(error);
  }
};

export { firebase };
