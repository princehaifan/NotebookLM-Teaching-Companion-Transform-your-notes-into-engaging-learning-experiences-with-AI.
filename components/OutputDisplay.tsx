import React from 'react';
import { Tool, OutputData } from '../types';
import { Loader } from './Loader';
import { TimelineOutput } from './TimelineOutput';
import { CrosswordOutput } from './CrosswordOutput';
import { StorybookOutput } from './StorybookOutput';
import { FlashcardOutput } from './FlashcardOutput';
import { LanguageTutorOutput } from './LanguageTutorOutput';
import { SummaryOutput } from './SummaryOutput';

interface OutputDisplayProps {
  isLoading: boolean;
  error: string | null;
  outputData: OutputData;
  selectedTool: Tool;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ isLoading, error, outputData, selectedTool }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader />
        <p className="mt-4 text-slate-600">Generating your content... this may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md">
          <p className="font-bold">An error occurred</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!outputData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        <h3 className="text-xl font-semibold">Your creative classroom awaits</h3>
        <p className="mt-2 max-w-sm">Enter some text, choose a tool, and click "Generate" to create your first learning activity.</p>
      </div>
    );
  }

  switch (selectedTool) {
    case Tool.TIMELINE:
      return <TimelineOutput data={outputData as any} />;
    case Tool.CROSSWORD:
      return <CrosswordOutput data={outputData as any} />;
    case Tool.STORYBOOK:
      return <StorybookOutput data={outputData as any} />;
    case Tool.FLASHCARDS:
        return <FlashcardOutput data={outputData as any} />;
    case Tool.LANGUAGE_TUTOR:
      return <LanguageTutorOutput data={outputData as any} />;
    case Tool.SUMMARY:
      return <SummaryOutput data={outputData as any} />;
    default:
      return <p>Select a tool to begin.</p>;
  }
};