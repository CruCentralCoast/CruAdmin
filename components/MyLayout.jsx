import * as React from 'react';
import Header from './heading/Heading';

const Layout = (props) => {
  const { children } = props;
  return (
    <div style={{ display: 'flex' }}>
      <Header>
        {children}
      </Header>
    </div>
  );
};

export default Layout;
