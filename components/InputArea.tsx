
import React from 'react';

interface InputAreaProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ value, onChange, disabled }) => {
  return (
    <div>
      <label htmlFor="input-text" className="block text-sm font-medium text-slate-700 mb-2">
        Paste your lesson plan, study guide, or text here:
      </label>
      <textarea
        id="input-text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={12}
        className="w-full p-4 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 disabled:bg-slate-100"
        placeholder="e.g., A chapter from a history book about the Roman Empire..."
      />
    </div>
  );
};
