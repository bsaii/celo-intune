import { AppState } from './AppState';

export type ActionType =
  | { type: 'setTokenUri'; payload: string }
  | { type: 'setAudioUrl'; payload: string }
  | { type: 'setPlayed'; payload: number }
  | {
      type: 'setSong';
      payload: { artist: string; cover: string; title: string };
    };

export function appReducer(state: AppState, action: ActionType): AppState {
  const { payload, type } = action;
  switch (type) {
    case 'setTokenUri':
      return { ...state, tokenUri: payload };
    case 'setAudioUrl':
      return { ...state, audioUrl: payload };
    case 'setPlayed':
      return { ...state, played: payload };
    case 'setSong':
      return { ...state, song: payload };
    default:
      throw new Error('Unhandled action');
  }
}
