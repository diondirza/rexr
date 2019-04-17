import React from 'react';
import { node } from 'prop-types';
import { Link } from 'react-router-dom';

import { container } from './styles';

const Layout = props => {
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

Layout.propTypes = {
  children: node.isRequired,
};

export default Layout;
