import React, { useState, useCallback } from 'react';
import { SummaryData } from '../types';
import { CopyIcon, ExportIcon } from './icons';

interface SummaryOutputProps {
  data: SummaryData;
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

export const SummaryOutput: React.FC<SummaryOutputProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [data]);

  const handleExport = useCallback(() => {
    downloadFile(data, 'summary.txt', 'text/plain');
  }, [data]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Generated Summary</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-lg hover:bg-slate-300 transition-colors text-sm flex items-center gap-2"
            aria-live="polite"
          >
            <CopyIcon />
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button
            onClick={handleExport}
            className="bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-lg hover:bg-slate-300 transition-colors text-sm flex items-center gap-2"
          >
            <ExportIcon />
            Export
          </button>
        </div>
      </div>
      <div className="flex-grow bg-slate-50 p-4 rounded-lg overflow-y-auto">
        <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{data}</p>
      </div>
    </div>
  );
};