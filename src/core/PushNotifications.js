import { BehaviorSubject } from "rxjs";

class PushNotificationsC {
  constructor() {
    this.$ = new BehaviorSubject();
  }

  initialize(registration) {
    this._registration = registration;

    this.loadPushSubscription();
  }

  askForPermission() {
    const options = {
      userVisibleOnly: true,
      applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
    };

    return this._registration.pushManager
      .subscribe(options)
      .then(() => this.loadPushSubscription());
  }

  enabled() {
    return Notification.permission === "granted" && this._pushSubscription;
  }

  available() {
    return (
      "Notification" in window &&
      navigator.serviceWorker &&
      this._registration.pushManager
    );
  }

  loadPushSubscription() {
    return this._registration.pushManager.getSubscription().then(
      pushSubscription => {
        this._pushSubscription = pushSubscription;
        this.$.next(pushSubscription);
      },
      error => console.error(error)
    );
  }
}

export const PushNotifications = new PushNotificationsC();
