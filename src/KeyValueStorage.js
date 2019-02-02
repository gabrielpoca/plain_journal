import React from 'react';

const KeyValueStorageContext = React.createContext();

class Provider extends React.PureComponent {
  constructor() {
    super();
    this.state = { getItem: this.getItem, setItem: this.setItem };
  }

  setItem = (key, value) => {
    if (key === 'getItem' || key === 'setItem')
      throw new Error('Cannot use getItem or setItem as keys');
    localStorage.setItem(key, value);
    this.setState({ [key]: value });
  };

  getItem = key => {
    if (key === 'getItem' || key === 'setItem')
      throw new Error('Cannot use getItem or setItem as keys');
    if (this.state[key]) return this.state[key];
    const value = JSON.parse(localStorage.getItem(key));
    setImmediate(() => this.setState({ [key]: value }));
    return value;
  };

  render() {
    return (
      <KeyValueStorageContext.Provider value={this.state}>
        {this.props.children}
      </KeyValueStorageContext.Provider>
    );
  }
}

export const KeyValueStorage = KeyValueStorageContext.Consumer;
export default Provider;
