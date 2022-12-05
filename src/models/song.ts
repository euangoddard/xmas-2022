export interface Song {
  id: number;
  prompt: string;
  song: string;
}

export type Songs = readonly Song[];
