
import React, { useState, useCallback } from 'react';
import { CrosswordData } from '../types';
import { CopyIcon, ExportIcon } from './icons';

interface CrosswordOutputProps {
  data: CrosswordData;
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

export const CrosswordOutput: React.FC<CrosswordOutputProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [data]);

  const handleExport = useCallback(() => {
    downloadFile(data, 'crossword-clues.txt', 'text/plain');
  }, [data]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Generated Crossword Clues</h2>
        <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="bg-indigo-600 text-white font-semibold py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center gap-2"
            >
              <CopyIcon className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy Clues'}
            </button>
            <button
              onClick={handleExport}
              className="bg-indigo-600 text-white font-semibold py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center gap-2"
            >
              <ExportIcon className="w-4 h-4" />
              Export Clues
            </button>
            <a
              href="https://crosswordlabs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center bg-slate-200 text-slate-800 font-semibold py-2 px-3 rounded-lg hover:bg-slate-300 transition-colors text-sm"
            >
              Open CrosswordLabs
            </a>
        </div>
      </div>

      <div className="flex-grow bg-slate-100 p-4 rounded-lg overflow-y-auto">
        <pre className="whitespace-pre-wrap text-sm text-slate-700">{data}</pre>
      </div>
    </div>
  );
};