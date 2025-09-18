import React from 'react';
import { Tool } from '../types';
import { TimelineIcon, CrosswordIcon, StorybookIcon, FlashcardsIcon, LanguageTutorIcon, SummaryIcon } from './icons';

interface ToolSelectorProps {
  selectedTool: Tool;
  onSelectTool: (tool: Tool) => void;
  disabled: boolean;
}

const tools = [
  { id: Tool.TIMELINE, icon: <TimelineIcon /> },
  { id: Tool.CROSSWORD, icon: <CrosswordIcon /> },
  { id: Tool.STORYBOOK, icon: <StorybookIcon /> },
  { id: Tool.FLASHCARDS, icon: <FlashcardsIcon /> },
  { id: Tool.LANGUAGE_TUTOR, icon: <LanguageTutorIcon /> },
  { id: Tool.SUMMARY, icon: <SummaryIcon /> },
];

export const ToolSelector: React.FC<ToolSelectorProps> = ({ selectedTool, onSelectTool, disabled }) => {
  return (
    <div>
       <label className="block text-sm font-medium text-slate-700 mb-2">
        Choose a learning tool:
      </label>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all duration-200 disabled:opacity-50 ${
              selectedTool === tool.id
                ? 'bg-indigo-100 border-indigo-500 text-indigo-700 shadow'
                : 'bg-white border-slate-300 hover:border-indigo-400 hover:bg-indigo-50'
            }`}
          >
            <span className="w-8 h-8">{tool.icon}</span>
            <span className="text-xs md:text-sm font-semibold mt-2 text-center">{tool.id}</span>
          </button>
        ))}
      </div>
    </div>
  );
};