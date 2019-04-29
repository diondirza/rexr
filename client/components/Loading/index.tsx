import React, { SFC } from 'react';

type LoadingProps = {
  error: string;
};

const Loading: SFC<LoadingProps> = ({ error }) => {
  if (error) throw error;

  return <div>Loading ...</div>;
};

export default Loading;
