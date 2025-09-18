
import React, { useState, useCallback } from 'react';
import { LanguageTutorData } from '../types';
import { CopyIcon, ExportIcon } from './icons';

interface LanguageTutorOutputProps {
  data: LanguageTutorData;
}

const formatLanguageTutorForCopy = (data: LanguageTutorData): string => {
  const title = `Title: ${data.title.translation} (${data.title.original})`;
  const intro = `Introduction:\n${data.introduction}`;
  const sentences = data.sentences.map(s => {
    let sentenceText = `${s.original}\n${s.translation}`;
    if (s.notes) {
      sentenceText += `\nNote: ${s.notes}`;
    }
    return sentenceText;
  }).join('\n\n');

  return `${title}\n\n${intro}\n\n---\n\n${sentences}`;
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

export const LanguageTutorOutput: React.FC<LanguageTutorOutputProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const textToCopy = formatLanguageTutorForCopy(data);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [data]);

  const handleExport = useCallback(() => {
    const textToExport = formatLanguageTutorForCopy(data);
    // Sanitize the title to create a safe filename
    const safeTitle = data.title.translation.replace(/[^a-z0-9\s-]/gi, '').trim();
    const fileName = safeTitle
      ? `${safeTitle.toLowerCase().replace(/\s+/g, '_')}_report.txt`
      : 'language-tutor-report.txt';
    downloadFile(textToExport, fileName, 'text/plain');
  }, [data]);

  return (
    <div className="h-full flex flex-col">
       <div className="flex justify-between items-start mb-1">
          <div>
            <h2 className="text-2xl font-bold mb-1 text-slate-800">{data.title.translation}</h2>
            <p className="text-xl font-semibold mb-4 text-indigo-600">{data.title.original}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 mt-1">
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
      
      <div className="flex-grow overflow-y-auto">
        <div className="prose prose-slate max-w-none bg-slate-50 p-4 rounded-lg">
          <h3 className="font-semibold">Introduction</h3>
          <p>{data.introduction}</p>
        </div>
        
        <div className="mt-6 space-y-4">
          {data.sentences.map((sentence, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-lg bg-white">
              <p className="text-lg font-hindi font-semibold text-indigo-700">{sentence.original}</p>
              <p className="text-md text-slate-700 mt-1">{sentence.translation}</p>
              {sentence.notes && (
                <p className="text-sm text-slate-500 mt-2 bg-slate-100 p-2 rounded">
                  <strong>Note:</strong> {sentence.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
