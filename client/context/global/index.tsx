import React, { ReactNode, FC, useReducer, useMemo } from 'react';

import { GlobalState, GlobalStore } from './types';
import reducer from './reducer';

const getInitialState = (): GlobalState => {
  const defaultState = {
    count: 0,
    lang: 'en',
  };

  if (typeof window !== 'undefined') {
    return (window as any).initialGlobalState || defaultState;
  }

  return defaultState;
};

export const GlobalContext = React.createContext([getInitialState(), (): void => {}] as GlobalStore);

type GlobalProviderProps = {
  children: ReactNode;
  initialState?: GlobalState;
};

const GlobalProvider: FC<GlobalProviderProps> = ({ children, initialState }) => {
  const initState = initialState || getInitialState();
  const [state, dispatch] = useReducer(reducer, initState);
  const store = useMemo(() => [state, dispatch], [state, dispatch]) as GlobalStore;

  return <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>;
};

export default GlobalProvider;
