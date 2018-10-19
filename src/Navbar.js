import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';

import back from './arrow-left.svg';

const Root = styled.nav`
  align-items: center;
  background: ${({ light }) =>
    light
      ? 'rgba(0, 0, 0, 0.2)'
      : 'linear-gradient(180deg, #2B557C 0%, #396CA1 100%)'};
  display: flex;
  height: 56px;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  padding: 0 16px;
  z-index: 1;
  transition: all 0.4s ease-out;
`;

const BackButton = styled(Link)`
  color: white;
  text-decoration: none;
  width: 40px;
  height: 40px;
  background-image: url(${back});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 32px;
`;

const Title = styled.span`
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.16);
`;

const Right = styled.span`
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
`;

class Navbar extends React.PureComponent {
  render() {
    return (
      <Root {...this.props}>
        {this.props.withBackButton ? <BackButton to="/" /> : null}
        <Title>Journal</Title>
        <Right>{this.props.children}</Right>
      </Root>
    );
  }
}

export default Navbar;
