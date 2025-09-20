import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center p-4 border-b border-gray-700/50">
      <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
        Analista de Opções Binárias com IA
      </h1>
      <p className="mt-2 text-md text-gray-400">
        Envie um gráfico de candlestick para receber um sinal de um especialista em IA para a próxima vela.
      </p>
    </header>
  );
};