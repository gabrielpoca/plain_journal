import React from "react";

import { DBContext } from "./Database";
import SearchWorker from "../search.worker";

const worker = new SearchWorker();
window.worker = worker;

export const SearchContext = React.createContext({});

export class SearchContextProvider extends React.Component {
  static contextType = DBContext;

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

    setTimeout(async () => {
      worker.postMessage(await this.context.db.entries.dump(true));
    }, 5000);
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
