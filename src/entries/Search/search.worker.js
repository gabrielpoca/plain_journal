/* eslint no-restricted-globals: 0 */
import lunr from "lunr";
import localForage from "localforage";
import stripHtml from "string-strip-html";

let ready = false;
let idx;

const init = async docs => {
  try {
    if (docs) {
      idx = lunr(function() {
        this.ref("id");
        this.field("body");

        docs.forEach(doc => {
          this.add({ id: doc.id, body: stripHtml(doc.body) });
        });
      });

      setImmediate(() => {
        localForage.setItem("index", JSON.stringify(idx));
      });
    } else {
      const index = await localForage.getItem("index");

      if (!index) return;

      idx = lunr.Index.load(JSON.parse(index));
    }

    ready = true;
  } catch (e) {
    console.warn(e);
  }
};

const search = async query => {
  const res = idx.search(query);

  postMessage({ res });
};

init();

self.addEventListener("message", ({ data }) => {
  if (data.docs) {
    init(data.docs);
  } else if (ready && data.q) {
    search(data.q);
  } else {
    console.error("could not handle message", data);
  }
});
