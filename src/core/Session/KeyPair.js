import localForage from "localforage";

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

export const set = async (email, password) => {
  if (await localForage.getItem("KeyPair"))
    throw new Error("encryption is already setup");

  const inputKey = await crypto.subtle.importKey(
    "raw",
    str2ab(password + email),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: { name: "SHA-256" },
      iterations: 1000,
      salt: str2ab(email)
    },
    inputKey,
    {
      name: "AES-GCM",
      length: 256
    },
    false,
    ["encrypt", "decrypt"]
  );

  return await localForage.setItem("KeyPair", { key, email });
};

export const unset = async () => {
  return await localForage.setItem("KeyPair", false);
};

export const encrypt = async data => {
  const { key, email } = await localForage.getItem("KeyPair");

  return ab2str(
    await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: str2ab(email)
      },
      key,
      str2ab(data)
    )
  );
};

export const decrypt = async data => {
  const { key, email } = await localForage.getItem("KeyPair");

  return ab2str(
    await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: str2ab(email)
      },
      key,
      str2ab(data)
    )
  );
};
