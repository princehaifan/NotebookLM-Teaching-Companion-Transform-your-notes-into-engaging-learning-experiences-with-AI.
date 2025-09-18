export enum Tool {
  TIMELINE = 'Timeline',
  CROSSWORD = 'Crossword',
  STORYBOOK = 'Storybook',
  FLASHCARDS = 'Flashcards',
  LANGUAGE_TUTOR = 'Language Tutor',
  SUMMARY = 'Summary',
}

export interface TimelineEvent {
  date: string;
  event: string;
  description: string;
}

export type TimelineData = TimelineEvent[];

export type CrosswordData = string;

export interface StoryPage {
  pageNumber: number;
  text: string;
  imagePrompt: string;
  imageUrl?: string;
}

export type StorybookData = StoryPage[];

export interface Flashcard {
  term: string;
  definition: string;
  imagePrompt: string;
  imageUrl?: string;
}

export type FlashcardsData = Flashcard[];

export interface LanguageTutorSentence {
  original: string;
  translation: string;
  notes?: string;
}

export interface LanguageTutorData {
  title: {
    original: string;
    translation: string;
  };
  introduction: string;
  sentences: LanguageTutorSentence[];
}

export type SummaryData = string;

export type OutputData = TimelineData | CrosswordData | StorybookData | FlashcardsData | LanguageTutorData | SummaryData | null;