import styled from 'styled-components';

import plus from '../icons/plus.svg';

const Fab = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  position: fixed;
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

export default Fab;
