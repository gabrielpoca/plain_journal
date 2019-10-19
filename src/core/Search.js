import React, { useState, useEffect } from "react";
import { filter, switchMap, startWith, debounce } from "rxjs/operators";
import { useObservable } from "rxjs-hooks";
import { BehaviorSubject, interval } from "rxjs";

import { db$ } from "./Database";
import SearchWorker from "../search.worker";

const worker = new SearchWorker();

db$
  .pipe(
    filter(db => !!db),
    switchMap(db => db.entries.dump(true))
  )
  .subscribe(entries => {
    worker.postMessage(entries);
  });

const results$ = new BehaviorSubject([]);

worker.addEventListener("message", ({ data }) => {
  results$.next([...data.res]);
});

const query$ = new BehaviorSubject("");
const debouncedQuery$ = query$.pipe(debounce(() => interval(300)));
const enabled$ = new BehaviorSubject(false);

debouncedQuery$
  .pipe(filter(q => !!q))
  .subscribe(q => worker.postMessage({ q }));

enabled$.subscribe(enabled => {
  if (!enabled) query$.next("");
});

export const SearchContext = React.createContext({});

export function SearchContextProvider(props) {
  const enabled = useObservable(() => enabled$);
  const q = useObservable(() => query$);
  const debouncedQuery = useObservable(() => debouncedQuery$);
  const res = useObservable(() => results$);

  const state = {
    q,
    debouncedQuery,
    res,
    toggle: () => enabled$.next(!enabled),
    setQuery: newQuery => query$.next(newQuery),
    enabled
  };

  return (
    <SearchContext.Provider value={state}>
      {props.children}
    </SearchContext.Provider>
  );
}
