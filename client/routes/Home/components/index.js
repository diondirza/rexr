import React, { useContext, useCallback } from 'react';

import { GlobalContext } from '@context/global';
import { Button } from '../styles';

const HomeView = () => {
  const [globalState, globalDispatch] = useContext(GlobalContext);
  const { count } = globalState;
  const incrementCounter = useCallback(() => {
    globalDispatch({ type: 'INCREMENT_COUNTER' });
  }, [globalDispatch]);

  return (
    <div>
      Hello world!
      <br />
      Current counter value: {count}
      <br />
      <Button type="button" onClick={incrementCounter}>
        Click me to increase counter by 1
      </Button>
    </div>
  );
};

export default HomeView;
