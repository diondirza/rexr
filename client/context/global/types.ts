export type GlobalState = {
  count: number;
  lang: string;
};

export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const UPDATE_LANGUAGE = 'UPDATE_LANG';

interface IncreaseAction {
  type: typeof INCREMENT_COUNTER;
  payload: number;
}

interface UpdateLanguage {
  type: typeof UPDATE_LANGUAGE;
  payload: string;
}

export type GlobalActions = IncreaseAction | UpdateLanguage;
export type GlobalStore = [GlobalState, Function];
