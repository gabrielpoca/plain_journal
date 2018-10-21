import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';

import plus from '../icons/plus.svg';

const Fab = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 20px;
  width: 56px;
  height: 56px;
  color: white;
  border-radius: 50%;
  background: ${({ disabled }) => (disabled ? '#82A6C8' : '#3d78af')};
  background-image: url(${({ icon }) => icon || plus});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 32px;
  border: 0;
  padding: 0;
`;

class FabButton extends React.PureComponent {
  constructor() {
    super();
    this.el = document.createElement('div');
  }

  componentDidMount() {
    this.actionsRoot = document.getElementById('layout-main');
    this.actionsRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    this.actionsRoot.removeChild(this.el);
  }

  render() {
    return ReactDom.createPortal(<Fab {...this.props} />, this.el);
  }
}

export default FabButton;
