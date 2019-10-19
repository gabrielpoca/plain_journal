import React from "react";
import { filter, switchMap } from "rxjs/operators";

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

export const SearchContext = React.createContext({});

export class SearchContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doSearch: this.doSearch,
      toggle: this.toggle,
      enabled: false,
      res: []
    };
  }

  async componentDidMount() {
    this.listener = worker.addEventListener("message", this.onResult);
  }

  componentWillUnmount() {
    worker.removeEventListener(this.listener);
  }

  doSearch = query => {
    worker.postMessage({ q: query });
  };

  onResult = ({ data }) => {
    this.setState({ res: [...data.res] });
  };

  toggle = () => {
    this.setState({ enabled: !this.state.enabled });
  };

  render() {
    return (
      <SearchContext.Provider value={this.state}>
        {this.props.children}
      </SearchContext.Provider>
    );
  }
}
