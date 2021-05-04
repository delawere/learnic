import { ColorSchemes } from '../enums';

export type ColorScheme = ColorSchemes | 'default';

export type Language = 'en' | 'ru' | 'default';

export type UserOptions = {
  colorScheme: ColorScheme;
  language: Language;
};

export type Word = {
  id: string;
  word: string;
  translate: string;
  date: string | null;
  repeat: string | null;
  step: number;
  examples?: string[];
  audio: string;
};

export type Words = Word[];

export type GetWordsQueryResult = {
  user: {
    uid: string;
    words: Words;
  };
};
