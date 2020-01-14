import React, { useState, useEffect } from "react";
import { BehaviorSubject } from "rxjs";
import localForage from "localforage";
import Axios from "axios";

import { clearLocalDBToSyncDB } from "./Database/setup";

export const user$ = new BehaviorSubject({ loading: true });
const initialState = { user: null, loading: true };
export const UserContext = React.createContext(initialState);
const axios = Axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4000/"
      : "https://log.gabrielpoca.com"
});

localForage
  .getItem("currentUser")
  .then(user => user$.next({ loading: false, user }));

user$.subscribe({
  next: ({ user, loading }) => {
    if (loading) return;

    if (!user) {
      localForage.setItem("currentUser", undefined);
    } else {
      localForage.setItem("currentUser", user);
    }
  }
});

const signIn = async (email, password) => {
  const { data } = await axios.post("/sign_in", { email, password });
  clearLocalDBToSyncDB();
  user$.next({ user: { ...data, password: password }, loading: false });
};

const signUp = async (email, password) => {
  const { data } = await axios.post("/sign_up", { email, password });
  clearLocalDBToSyncDB();
  user$.next({ user: { ...data, password: password }, loading: false });
};

const signOut = async () => {
  user$.next({ user: undefined, loading: false });
  clearLocalDBToSyncDB();
};

export function UserContextProvider(props) {
  const [state, setState] = useState({
    ...initialState,
    signIn,
    signUp,
    signOut
  });

  useEffect(() => {
    const subscription = user$.subscribe({
      next: ({ user, loading }) => {
        if (loading) return;

        setState(state => ({ ...state, user, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (state.loading) return null;

  return (
    <UserContext.Provider value={state}>{props.children}</UserContext.Provider>
  );
}
