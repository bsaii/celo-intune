import { AppState } from './AppState';

export type ActionType = { type: 'setTokenUri'; payload: string };

export function appReducer(state: AppState, action: ActionType): AppState {
  const { payload, type } = action;
  switch (type) {
    case 'setTokenUri':
      return { ...state, tokenUri: payload };
    default:
      throw new Error('Unhandled action');
  }
}
