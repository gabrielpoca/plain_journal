import localForage from 'localforage';

import db from '../db';

const ab2str = buf => {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

const str2ab = str => {
  var buf = new ArrayBuffer(str.length); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

export const setup = async (username, password) => {
  const inputKey = await crypto.subtle.importKey(
    'raw',
    str2ab(password + username),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      hash: { name: 'SHA-256' },
      iterations: 1000,
      salt: str2ab(username),
    },
    inputKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt']
  );

  await localForage.setItem('encryptionKey', key);
  await localForage.setItem('username', username);

  return await Promise.all(
    (await db.allDocs({ include_docs: true })).rows
      .map(r => r.doc)
      .filter(doc => doc.doc_type === 'journal' && !doc.encrypted)
      .map(async doc => {
        const encrypted = await encrypt(doc.body);
        return await db.put({ ...doc, body: encrypted, encrypted: true });
      })
  );
};

export const destroy = async () => {
  await Promise.all(
    (await db.allDocs({ include_docs: true })).rows
      .map(r => r.doc)
      .filter(doc => doc.doc_type === 'journal' && doc.encrypted)
      .map(async doc => {
        const decrypted = await decrypt(doc.body);
        return await db.put({ ...doc, body: decrypted, encrypted: false });
      })
  );

  await localForage.setItem('encryptionKey', false);
  return await localForage.setItem('username', false);
};

export const encrypt = async data => {
  return ab2str(
    await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: str2ab(await localForage.getItem('username')),
      },
      await localForage.getItem('encryptionKey'),
      str2ab(data)
    )
  );
};

export const decrypt = async data => {
  return ab2str(
    await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: str2ab(await localForage.getItem('username')),
      },
      await localForage.getItem('encryptionKey'),
      str2ab(data)
    )
  );
};

export const enabled = () => {
  return localForage.getItem('encryptionKey');
};
