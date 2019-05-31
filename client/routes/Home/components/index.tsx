import React, { SFC, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';

import useGlobal from '@hooks/use-global';
import { Button } from '../styles';

const HomeView: SFC = () => {
  const { state, incrementCounter } = useGlobal();
  const { count } = state;
  const handleClick = useCallback(() => {
    incrementCounter();
  }, [incrementCounter]);

  return (
    <>
      <Helmet>
        <title>Hello World</title>
        <link rel="canonical" href="https://www.rexr.com/" />
      </Helmet>
      <div>
        Hello world!
        <br />
        Current counter value: <span data-tid="counter">{count}</span>
        <br />
        <Button data-tid="increment" type="button" onClick={handleClick}>
          Click me to increase counter by 1
        </Button>
      </div>
    </>
  );
};

export default HomeView;
