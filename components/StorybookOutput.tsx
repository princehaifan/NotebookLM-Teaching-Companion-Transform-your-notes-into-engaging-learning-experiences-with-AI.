
import React, { useState, useCallback } from 'react';
import { StorybookData } from '../types';
import { ExportIcon } from './icons';

interface StorybookOutputProps {
  data: StorybookData;
}

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

export const StorybookOutput: React.FC<StorybookOutputProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const goToPrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev < data.length - 1 ? prev + 1 : prev));
  };

  const handleExport = useCallback(() => {
    const jsonString = JSON.stringify(data, null, 2);
    downloadFile(jsonString, 'storybook.json', 'application/json');
  }, [data]);

  if (!data || data.length === 0) {
    return <p>No storybook data available.</p>;
  }

  const page = data[currentPage];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Generated Storybook</h2>
        <button
          onClick={handleExport}
          className="bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-lg hover:bg-slate-300 transition-colors text-sm flex items-center gap-2"
        >
          <ExportIcon />
          Export JSON
        </button>
      </div>
      <div className="flex-grow flex flex-col border border-slate-200 rounded-lg shadow-inner overflow-hidden">
        <div className="w-full aspect-video bg-slate-200 flex items-center justify-center">
            {page.imageUrl ? (
              <img src={page.imageUrl} alt={page.imagePrompt} className="w-full h-full object-cover" />
            ) : (
                <div className="animate-pulse bg-slate-300 w-full h-full"></div>
            )}
        </div>
        <div className="p-4 flex-grow overflow-y-auto bg-white">
          <p className="text-slate-700 leading-relaxed">{page.text}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <button onClick={goToPrevious} disabled={currentPage === 0} className="px-4 py-2 bg-slate-200 rounded-md disabled:opacity-50">
          Previous
        </button>
        <span className="font-semibold text-slate-600">
          Page {currentPage + 1} of {data.length}
        </span>
        <button onClick={goToNext} disabled={currentPage === data.length - 1} className="px-4 py-2 bg-slate-200 rounded-md disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  );
};