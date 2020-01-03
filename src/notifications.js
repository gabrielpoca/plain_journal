import { BehaviorSubject } from "rxjs";

let serviceWorkerRegistration = null;

export const subscription$ = new BehaviorSubject();

export const initialize = registration => {
  serviceWorkerRegistration = registration;
};

export const askForPermissioToReceiveNotifications = async () => {
  const options = {
    userVisibleOnly: true,
    applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
  };

  serviceWorkerRegistration.pushManager.subscribe(options).then(
    pushSubscription => subscription$.next(pushSubscription),
    error => console.error(error)
  );
};
