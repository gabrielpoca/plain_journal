![Journal](./readme/banner.jpg)

Journal is an offline-first web application for journaling. It works out of the box in your device from the browser. Your entries are stored encrypted in your device. If you wish, you can create an account in a remote server to back-up your data and access from other devices. Only the encrypted data reaches the remote server, so your entries are safe. 



Here's a screenshot:

![A screenshot of the application](./readme/screenshot.png)

## For Developers

Journal is a PWA that built on top of React and RxDB. The back-end is CouchDB and an API server.

### Setup

The only requirment for this project is node. One of the recent versions should be enough.

First download the repo

```
git clone https://github.com/gabrielpoca/journal.git
```

Then install the dependencies

```
npm install
```

Now, just start the server:

```
npm start
```

The development url shoud be [https://localhost:3000](https://localhost:3000)
