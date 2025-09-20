import React from 'react';
import type { Timeframe } from '../types';

interface TimeframeSelectorProps {
  selectedTimeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
  disabled: boolean;
}

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ selectedTimeframe, onTimeframeChange, disabled }) => {
  const timeframes: Timeframe[] = ['M1', 'M5'];

  const getButtonClass = (timeframe: Timeframe) => {
    const baseClass = "w-full px-6 py-3 text-lg font-semibold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
    const disabledClass = "disabled:opacity-50 disabled:cursor-not-allowed";
    if (timeframe === selectedTimeframe) {
      return `${baseClass} bg-teal-500 text-white shadow-lg ring-2 ring-teal-400 ${disabledClass}`;
    }
    return `${baseClass} bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-teal-500 ${disabledClass}`;
  };

  return (
    <div className="w-full max-w-sm">
      <h3 className="text-xl font-semibold mb-4 text-center text-white">Selecione o Timeframe</h3>
      <div className="grid grid-cols-2 gap-4">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => onTimeframeChange(tf)}
            className={getButtonClass(tf)}
            disabled={disabled}
          >
            {tf}
          </button>
        ))}
      </div>
    </div>
  );
};