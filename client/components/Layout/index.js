import React from 'react';
import { node } from 'prop-types';
import { container } from './styles';

const Layout = props => {
  const { children } = props;

  return <div css={container}>{children}</div>;
};

Layout.propTypes = {
  children: node.isRequired,
};

export default Layout;
