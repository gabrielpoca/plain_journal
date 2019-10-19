import React, { useState, useEffect } from "react";

import { EncryptionPassword } from "../account/EncryptionPassword";

import "./Database/sync";
import { setup as setupDB } from "./Database/setup";
export { db$ } from "./Database/setup";

export const DBContext = React.createContext({ db: null, loading: true });

export function DBContextProvider(props) {
  const [state, setState] = useState({
    db: null,
    loading: true,
    wrongPassword: false
  });

  useEffect(() => {
    (async () => {
      const password = localStorage.getItem("enc_key");

      if (!password) return setState({ loading: false });

      try {
        const db = await setupDB(password);
        setState({ db, loading: false });
      } catch (e) {
        if (e.code === "DB1") {
          setState({ loading: false, wrongPassword: true });
        }

        throw e;
      }
    })();
  }, []);

  const setPassword = async password => {
    localStorage.setItem("enc_key", password);

    if (!password) setState({ loading: false });

    try {
      const db = await setupDB(password);
      setState({ db });
    } catch (e) {
      if (e.code === "DB1") {
        setState({ wrongPassword: true });
      }

      throw e;
    }
  };

  if (state.loading) return null;
  if (!state.db)
    return (
      <EncryptionPassword
        wrongPassword={state.wrongPassword}
        onSubmit={setPassword}
      />
    );

  return (
    <DBContext.Provider value={state}>{props.children}</DBContext.Provider>
  );
}
