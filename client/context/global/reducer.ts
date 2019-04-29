import { GlobalActions, GlobalState } from './types';

const cases = {
  INCREMENT_COUNTER: (state: GlobalState, payload: number = 1) => ({
    ...state,
    count: state.count + payload,
  }),
  UPDATE_LANG: (state: GlobalState, payload: string) => ({
    ...state,
    lang: payload,
  }),
};

const reducer = (state: GlobalState, action: GlobalActions): GlobalState => {
  const actionCase: Function = cases[action.type];

  if (typeof actionCase !== 'function') {
    throw new Error(`Unsupported action type: ${action.type}`);
  }

  return actionCase(state, action.payload);
};

export default reducer;
