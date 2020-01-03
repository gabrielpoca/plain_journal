import React, { useState, useEffect } from "react";

import "./Database/sync";
import { db$ } from "./Database/setup";

export { db$ } from "./Database/setup";

export const DBContext = React.createContext({ db: null, loading: true });

export function DBContextProvider(props) {
  const [state, setState] = useState({
    db: null,
    loading: true
  });

  useEffect(() => {
    const subscription = db$.subscribe({
      next: db => {
        if (db) setState(state => ({ ...state, db, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (state.loading) return null;

  return (
    <DBContext.Provider value={state}>{props.children}</DBContext.Provider>
  );
}
