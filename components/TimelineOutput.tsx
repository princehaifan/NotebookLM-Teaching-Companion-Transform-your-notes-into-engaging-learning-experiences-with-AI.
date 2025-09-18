
import React, { useState, useCallback } from 'react';
import { TimelineData } from '../types';
import { CopyIcon, ExportIcon } from './icons';

interface TimelineOutputProps {
  data: TimelineData;
}

const formatTimelineForCopy = (data: TimelineData): string => {
  return data
    .map(
      (item) =>
        `Date: ${item.date}\nEvent: ${item.event}\nDescription: ${item.description}`
    )
    .join('\n\n');
};

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

export const TimelineOutput: React.FC<TimelineOutputProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const textToCopy = formatTimelineForCopy(data);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [data]);

  const handleExport = useCallback(() => {
    const textToExport = formatTimelineForCopy(data);
    downloadFile(textToExport, 'timeline.txt', 'text/plain');
  }, [data]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Generated Timeline</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-lg hover:bg-slate-300 transition-colors text-sm flex items-center gap-2"
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
      <div className="flex-grow overflow-y-auto pr-2">
        <div className="relative border-l-2 border-indigo-200 pl-6 space-y-8">
          {data.map((item, index) => (
            <div key={index} className="relative">
              <div className="absolute -left-[35px] top-1 h-4 w-4 rounded-full bg-indigo-500 ring-4 ring-white"></div>
              <p className="font-bold text-indigo-600">{item.date}</p>
              <h3 className="text-lg font-semibold text-slate-700 mt-1">{item.event}</h3>
              <p className="text-slate-600 mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};