import React, { useContext } from "react";
import { BehaviorSubject, combineLatest } from "rxjs";
import { filter, map } from "rxjs/operators";
import { useObservable } from "rxjs-hooks";

import { DBContext } from "./Database";

const promptEvent$ = new BehaviorSubject();
const installed$ = new BehaviorSubject(false);

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  promptEvent$.next(e);
});

window.addEventListener("appinstalled", () => {
  installed$.next(true);
});

if (process.env.NODE_ENV === "development") promptEvent$.next("gogogo");

export function Installer(props) {
  const { db } = useContext(DBContext);
  const installed = useObservable(() => installed$);
  const promptEvent = useObservable(() =>
    combineLatest(promptEvent$, db.entries.findOne().$).pipe(
      filter(([event, entry]) => event && entry),
      map(([event]) => event)
    )
  );

  if (installed) return null;
  if (!promptEvent) return null;

  const onInstall = async () => {
    installed$.next(true);
    promptEvent.prompt();

    const res = await promptEvent.userChoice;

    if (res.outcome === "accepted") {
      console.log("User accepted the A2HS prompt");
    } else {
      console.log("User dismissed the A2HS prompt");
    }
  };

  return props.children({ onInstall });
}
