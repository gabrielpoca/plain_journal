import React from 'react';
import styled from 'styled-components/macro';

const Root = styled.div`
  height: 100%;
  background-color: #fafafa;
`;

const Main = styled.main`
  max-width: var(--max-width);
  margin: 0 auto;
  width: 100%;
  background-color: white;
  height: 100%;
  border-left: 1px solid #e5e5e5;
  border-right: 1px solid #e5e5e5;
  position: relative;
`;

class Layout extends React.PureComponent {
  render() {
    return (
      <Root>
        <aside />
        <Main id="layout-main">{this.props.children}</Main>
      </Root>
    );
  }
}

export default Layout;
