import React, { useState, useEffect } from 'react';
import type { Timeframe } from '../types';

interface LoaderProps {
  timeframe: Timeframe;
}

const messages = [
  "Inicializando motor de análise...",
  "Procurando por padrões de candlestick...",
  "Identificando níveis de suporte e resistência...",
  "Avaliando a estrutura do mercado...",
  "Analisando a força de compradores e vendedores...",
  "Buscando por oportunidades de arbitragem...",
  "Compilando análise técnica...",
  "Gerando sinal de negociação...",
  "Finalizando recomendações..."
];

export const Loader: React.FC<LoaderProps> = ({ timeframe }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const intervalDuration = timeframe === 'M1' ? 1500 : 4500;

  useEffect(() => {
    setMessageIndex(0); // Reset on timeframe change
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [timeframe, intervalDuration]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-gray-800/50 rounded-lg">
      <svg className="animate-spin h-12 w-12 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-lg font-semibold text-gray-300">Analisando Gráfico de {timeframe}...</p>
      <p className="text-sm text-gray-400 font-mono transition-opacity duration-500">{messages[messageIndex]}</p>
    </div>
  );
};