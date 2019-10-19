import React, { useState, useEffect, useContext } from "react";

import { UserContext } from "./User";
import { EncryptionPassword } from "../account/EncryptionPassword";

import setupDB from "./Database/setup";
import setupSync from "./Database/sync";

export const DBContext = React.createContext({ db: null, loading: true });

export function DBContextProvider(props) {
  const { user } = useContext(UserContext);
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

  useEffect(() => {
    if (!user || !state.db) return;

    setupSync(state.db, user).catch(e => console.error(e));
  }, [user, state.db]);

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
