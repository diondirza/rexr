import React, { ReactNode, SFC } from 'react';
import { Link } from 'react-router-dom';

import { container } from './styles';

type LayoutProps = {
  children: ReactNode;
};

const Layout: SFC<LayoutProps> = props => {
  const { children } = props;

  return (
    <div css={container}>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
