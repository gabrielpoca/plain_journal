import React, { useState, useEffect } from "react";
import { BehaviorSubject } from "rxjs";
import localForage from "localforage";

import * as api from "./Session/api";

export const user$ = new BehaviorSubject();

localForage.getItem("currentUser").then(user => user$.next(user));

const initialState = { user: null, loading: true };
export const UserContext = React.createContext(initialState);

user$.subscribe({
  next: user => {
    if (!user) {
      localForage.setItem("currentUser", undefined);
    } else {
      localForage.setItem("currentUser", user);
    }
  }
});

const signIn = async (email, password) => {
  const { data } = await api.signIn({ email, password });
  user$.next(data);
};

const signUp = async (email, password) => {
  const { data } = await api.signUp({ email, password });
  user$.next(data);
};

const signOut = async () => {
  user$.next(undefined);
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
      next: user => {
        setState({ ...state, user, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [state]);

  if (state.loading) return null;

  return (
    <UserContext.Provider value={state}>{props.children}</UserContext.Provider>
  );
}
