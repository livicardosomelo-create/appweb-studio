import React from 'react';
import type { AnalysisResult } from '../types';
import { CallIcon, PutIcon, NeutralIcon, ClockIcon } from './icons';

interface AnalysisDisplayProps {
  result: AnalysisResult;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result }) => {
  const { signal, confidence, analysis, expiration } = result;

  const getSignalAppearance = () => {
    switch (signal?.toUpperCase()) {
      case 'CALL':
        return {
          color: 'text-green-400',
          bgColor: 'bg-green-900/50',
          borderColor: 'border-green-700',
          icon: <CallIcon className="h-8 w-8" />,
          label: 'Sinal de Compra'
        };
      case 'PUT':
        return {
          color: 'text-red-400',
          bgColor: 'bg-red-900/50',
          borderColor: 'border-red-700',
          icon: <PutIcon className="h-8 w-8" />,
          label: 'Sinal de Venda'
        };
      default:
        return {
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-900/50',
          borderColor: 'border-yellow-700',
          icon: <NeutralIcon className="h-8 w-8" />,
          label: 'Sinal Neutro'
        };
    }
  };

  const { color, bgColor, borderColor, icon, label } = getSignalAppearance();

  return (
    <div className={`w-full p-6 border rounded-lg shadow-xl ${borderColor} ${bgColor} transition-all duration-500`}>
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Resultado da Análise</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {/* Signal */}
        <div className={`flex flex-col items-center justify-center p-4 rounded-lg border ${borderColor} ${bgColor}`}>
          <div className={`${color} mb-2`}>{icon}</div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className={`text-4xl font-extrabold ${color}`}>{signal}</p>
        </div>

        {/* Expiration */}
        <div className={`flex flex-col items-center justify-center p-4 rounded-lg border ${borderColor} ${bgColor}`}>
          <div className="text-teal-400 mb-2">
            <ClockIcon className="h-8 w-8" />
          </div>
          <p className="text-sm text-gray-400">Expiração</p>
          <p className="text-3xl font-extrabold text-white">{expiration}</p>
        </div>

        {/* Confidence */}
        <div className={`flex flex-col items-center justify-center p-4 rounded-lg border ${borderColor} ${bgColor}`}>
          <div className="relative h-24 w-24">
            <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-700" strokeWidth="2"></circle>
              <circle 
                cx="18" cy="18" r="16" fill="none" 
                className={`stroke-current ${color}`}
                strokeWidth="2"
                strokeDasharray={`${confidence * 1.005}, 100.5`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
                style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${color}`}>{confidence}%</span>
            </div>
          </div>
           <p className="text-sm text-gray-400 mt-2">Confiança</p>
        </div>
      </div>
      
      {/* Analysis Text */}
      <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50">
          <h3 className="text-lg font-semibold text-white mb-2">Análise Técnica da IA:</h3>
          <p className="text-gray-300 text-base leading-relaxed">{analysis}</p>
      </div>
    </div>
  );
};