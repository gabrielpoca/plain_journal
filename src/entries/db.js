import database from '../db';

import { decrypt, encrypt, enabled } from '../core/EncryptionKey';

export const db = database;

const convertEncrypted = async doc => {
  if (doc.encrypted) return { ...doc, body: await decrypt(doc.body) };
  else return doc;
};

export const all = async () => {
  return Promise.all(
    (await db.find({
      selector: {
        doc_type: 'journal',
      },
    })).docs.map(convertEncrypted)
  );
};

export const get = async id => {
  const doc = await db.get(id, {
    attachments: true,
  });

  return convertEncrypted(doc);
};

export const remove = async doc => {
  await db.remove(doc._id, doc._rev);
};

export const put = async changes => {
  const encryptionEnabled = await enabled();
  changes.encrypted = changes.encrypted || encryptionEnabled;
  changes.doc_type = 'journal';
  if (changes.encrypted)
    return db.put({ ...changes, body: await encrypt(changes.body) });
  else return db.put(changes);
};
