import React, { useReducer } from 'react';
import { node, object } from 'prop-types';

import reducer from './reducer';

const getInitialState = () => {
  if (typeof window !== 'undefined' && window.initialGlobalState) {
    return window.initialGlobalState;
  }

  return {
    count: 0,
  };
};

export const GlobalContext = React.createContext(getInitialState());

const GlobalProvider = ({ children, initialState }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <GlobalContext.Provider value={[state, dispatch]}>{children}</GlobalContext.Provider>;
};

GlobalProvider.propTypes = {
  children: node.isRequired,
  initialState: object,
};

GlobalProvider.defaultProps = {
  initialState: getInitialState(),
};

export default GlobalProvider;
