import React from "react";

import Session from "../core/Session";

const UserContext = React.createContext({ user: null, loading: true });

class UserContextProvider extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
      loading: true,
      signIn: Session.signIn,
      signUp: Session.signUp,
      signOut: Session.signOut
    };
  }

  componentDidMount() {
    Session.onChange(this.onChange);
    Session.load();
  }

  componentWillUnmount() {
    Session.off(this.onChange);
  }

  onChange = () => {
    this.setState({ loading: Session.loading, user: Session.currentUser });
  };

  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export { UserContextProvider };
export default UserContext;
