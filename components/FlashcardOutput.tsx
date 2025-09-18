
import React, { useCallback } from 'react';
import { FlashcardsData } from '../types';
import { ExportIcon } from './icons';

const downloadFile = (content: string, fileName: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const FlashcardOutput: React.FC<{ data: FlashcardsData }> = ({ data }) => {
  const handleExport = useCallback(() => {
    const jsonString = JSON.stringify(data, null, 2);
    downloadFile(jsonString, 'flashcards.json', 'application/json');
  }, [data]);
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Generated Flashcards</h2>
        <button
          onClick={handleExport}
          className="bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-lg hover:bg-slate-300 transition-colors text-sm flex items-center gap-2"
        >
          <ExportIcon />
          Export JSON
        </button>
      </div>
      <div className="flex-grow overflow-y-auto pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          {data.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden flex flex-col">
              <div className="w-full h-40 bg-slate-200 flex items-center justify-center">
                {card.imageUrl ? (
                  <img src={card.imageUrl} alt={card.imagePrompt} className="w-full h-full object-cover" />
                ) : (
                    <div className="animate-pulse bg-slate-300 w-full h-full"></div>
                )}
              </div>
              <div className="p-4 flex-grow">
                <h3 className="font-bold text-lg text-indigo-700">{card.term}</h3>
                <p className="text-slate-600 mt-1 text-sm">{card.definition}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};