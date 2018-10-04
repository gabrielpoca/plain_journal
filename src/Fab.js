import styled from 'styled-components';

const Fab = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-size: 20px;
  width: 70px;
  height: 70px;
  color: white;
  border-radius: 50%;
  background: ${({ disabled }) => (disabled ? '#82A6C8' : '#3d78af')};
  border: 0;
  padding: 0;
`;

export default Fab;
