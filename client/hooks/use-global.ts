import { useContext } from 'react';

import { GlobalContext } from '@context';
import { UPDATE_LANGUAGE, INCREMENT_COUNTER, GlobalState, GlobalStore } from '@context/global/types';

type GlobalHook = {
  state: GlobalState;
  dispatch: Function;
  incrementCounter: () => void;
  updateLanguage: (language: string) => void;
};

export default function useGlobal(): GlobalHook {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error(`useGlobal must be used within a GlobalProvider`);
  }

  const [state, dispatch] = context as GlobalStore;
  const incrementCounter = () => dispatch({ type: INCREMENT_COUNTER });
  const updateLanguage = (language: string) => dispatch({ type: UPDATE_LANGUAGE, payload: language });

  return {
    state,
    dispatch,
    incrementCounter,
    updateLanguage,
  };
}
