import React from "react";

import { DBContext } from "./core/Database";
import SearchWorker from "./search.worker";
import { setInterval } from "timers";

const worker = new SearchWorker();
window.worker = worker;

export const SearchContext = React.createContext({});

export class SearchContextProvider extends React.Component {
  static contextType = DBContext;

  constructor(props) {
    super(props);
    this.state = {
      search: this.search,
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

  search = query => {
    worker.postMessage({ q: query });
  };

  onResult = ({ data }) => {
    this.setState({ res: [...data.res] });
  };

  render() {
    return (
      <SearchContext.Provider value={this.state}>
        {this.props.children}
      </SearchContext.Provider>
    );
  }
}
