self.addEventListener("activate", async () => {});

self.addEventListener("push", function(event) {
  const title = "Your friendly journaling reminder";
  const options = {
    body: "If you can, take some time to journal.",
    icon: "/icon-512.png"
  };

  if ("actions" in Notification.prototype) {
    options.actions = [{ action: "write", title: "Write" }];
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener(
  "notificationclick",
  function(event) {
    event.notification.close();

    if (event.action === "write") {
      clients.openWindow("/entries/new");
    }
  },
  false
);
