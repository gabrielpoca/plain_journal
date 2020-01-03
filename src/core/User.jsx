import React, { useState, useEffect } from "react";
import { BehaviorSubject } from "rxjs";
import localForage from "localforage";

import * as api from "./Session/api";

export const user$ = new BehaviorSubject({ loading: true });

localForage
  .getItem("currentUser")
  .then(user => user$.next({ loading: false, user }));

const initialState = { user: null, loading: true };
export const UserContext = React.createContext(initialState);

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
  const { data } = await api.signIn({ email, password });
  user$.next({ user: { ...data, password: password }, loading: false });
};

const signUp = async (email, password) => {
  const { data } = await api.signUp({ email, password });
  user$.next({ user: { ...data, password: password }, loading: false });
};

const signOut = async () => {
  user$.next({ user: undefined, loading: false });
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
