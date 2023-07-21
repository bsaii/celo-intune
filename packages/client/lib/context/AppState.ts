export interface AppState {
  tokenUri: string;
  audioUrl: string;
  played: number;
  song: { artist: string; cover: string; title: string };
}

export const initialState: AppState = {
  tokenUri: '',
  audioUrl: '',
  played: 0,
  song: { artist: '', cover: '', title: '' },
};
