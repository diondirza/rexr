import React, { SFC, useContext, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';

import { GlobalContext } from '@context/global';
import { Button } from '../styles';

const HomeView: SFC = () => {
  const [globalState, globalDispatch] = useContext(GlobalContext);
  const { count } = globalState;
  const incrementCounter = useCallback(() => {
    globalDispatch({ type: 'INCREMENT_COUNTER' });
  }, [globalDispatch]);

  return (
    <>
      <Helmet>
        <title>Hello World</title>
        <link rel="canonical" href="https://www.rexr.com/" />
      </Helmet>
      <div>
        Hello world!
        <br />
        Current counter value: {count}
        <br />
        <Button type="button" onClick={incrementCounter}>
          Click me to increase counter by 1
        </Button>
      </div>
    </>
  );
};

export default HomeView;
