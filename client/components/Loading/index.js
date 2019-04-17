import React from 'react';
import { string } from 'prop-types';

function Loading({ error }) {
  if (error) throw error;

  return <div>Loading ...</div>;
}

Loading.propTypes = {
  error: string,
};

Loading.defaultProps = {
  error: '',
};

export default Loading;
