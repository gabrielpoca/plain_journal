import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Root = styled.nav`
  align-items: center;
  background: ${({ light }) => (light ? 'rgba(0, 0, 0, 0.2)' : '#2B557C')};
  display: flex;
  height: 64px;
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
`;

const Title = styled.span`
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Right = styled.span`
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
`;

const Navbar = props => (
  <Root {...props}>
    {props.withBackButton ? <BackButton to="/">Back</BackButton> : null}
    <Title>Journal</Title>
    <Right>{props.children}</Right>
  </Root>
);

export default Navbar;
