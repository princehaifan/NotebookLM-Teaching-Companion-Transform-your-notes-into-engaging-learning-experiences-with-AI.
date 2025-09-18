
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-indigo-600">
          NotebookLM Teaching Companion
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Transform your notes into engaging learning experiences with AI.
        </p>
      </div>
    </header>
  );
};
