import React, { FC } from 'react';

type LoadingProps = {
  error: string;
};

const Loading: FC<LoadingProps> = ({ error }) => {
  if (error) throw new Error(error);

  return <div>Loading ...</div>;
};

export default Loading;
