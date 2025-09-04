'use client';

import React from 'react';

interface ViewToggleProps {
    view: 'daily' | 'monthly';
    setView: (view: 'daily' | 'monthly') => void;
}

export default function ViewToggle({ view, setView }: ViewToggleProps) {
    return (
        <div className="flex gap-2 mb-4">
            <button
                onClick={() => setView('daily')}
                className={`px-4 py-2 rounded ${view === 'daily' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
            >
                Günlük
            </button>
            <button
                onClick={() => setView('monthly')}
                className={`px-4 py-2 rounded ${view === 'monthly' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
            >
                Aylık
            </button>
        </div>
    );
}
