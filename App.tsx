import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { ToolSelector } from './components/ToolSelector';
import { OutputDisplay } from './components/OutputDisplay';
import { Tool, OutputData } from './types';
import * as geminiService from './services/geminiService';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedTool, setSelectedTool] = useState<Tool>(Tool.TIMELINE);
  const [outputData, setOutputData] = useState<OutputData>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to generate content.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutputData(null);

    try {
      let result: OutputData = null;
      switch (selectedTool) {
        case Tool.TIMELINE:
          result = await geminiService.generateTimeline(inputText);
          break;
        case Tool.CROSSWORD:
          result = await geminiService.generateCrosswordClues(inputText);
          break;
        case Tool.STORYBOOK:
          result = await geminiService.generateStorybook(inputText);
          break;
        case Tool.FLASHCARDS:
          result = await geminiService.generateFlashcards(inputText);
          break;
        case Tool.LANGUAGE_TUTOR:
          result = await geminiService.generateLanguageTutorReport(inputText);
          break;
        case Tool.SUMMARY:
          result = await geminiService.generateSummary(inputText);
          break;
        default:
          throw new Error('Invalid tool selected');
      }
      setOutputData(result);
    } catch (err) {
      console.error('Generation failed:', err);
      let errorMessage = 'An unknown error occurred. Please check the console.';
      if (err instanceof Error) {
        if (err.message.includes('429') || err.message.includes('RESOURCE_EXHAUSTED')) {
            errorMessage = 'The service is busy. Please wait a moment and try again.';
        } else {
            errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, selectedTool]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header />
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-6">
            <InputArea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
            <ToolSelector
              selectedTool={selectedTool}
              onSelectTool={setSelectedTool}
              disabled={isLoading}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !inputText.trim()}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'Generating...' : `Generate ${selectedTool}`}
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 min-h-[600px] border border-slate-200">
            <OutputDisplay
              isLoading={isLoading}
              error={error}
              outputData={outputData}
              selectedTool={selectedTool}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;