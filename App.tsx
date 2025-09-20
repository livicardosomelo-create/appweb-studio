import React, { useState, useCallback } from 'react';
import type { Timeframe, AnalysisResult } from './types';
import { analyzeChart } from './services/geminiService';
import { Header } from './components/Header';
import { TimeframeSelector } from './components/TimeframeSelector';
import { ChartUploader } from './components/ChartUploader';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { Loader } from './components/Loader';

interface ChartData {
    base64: string;
    mimeType: string;
}

export default function App() {
  const [timeframe, setTimeframe] = useState<Timeframe>('M1');
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChartUpload = useCallback((base64: string, mimeType: string) => {
    setChartData({ base64, mimeType });
    setAnalysisResult(null);
    setError(null);
  }, []);

  const handleAnalyzeClick = async () => {
    if (!chartData) {
      setError('Por favor, envie uma imagem do gráfico primeiro.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeChart(chartData.base64, chartData.mimeType, timeframe);
      setAnalysisResult(result);
    } catch (e) {
        if(e instanceof Error) {
            setError(`A análise falhou: ${e.message}`);
        } else {
            setError("Ocorreu um erro desconhecido durante a análise.");
        }
    } finally {
      setIsLoading(false);
    }
  };

  const isAnalyzeDisabled = !chartData || isLoading;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-8 flex flex-col items-center">
        <div className="w-full space-y-8 flex flex-col items-center">
          
          <div className="w-full max-w-4xl p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-6 text-white">1. Configure Sua Análise</h2>
            <div className="flex flex-col md:flex-row items-center justify-around gap-8">
              <TimeframeSelector 
                selectedTimeframe={timeframe} 
                onTimeframeChange={setTimeframe} 
                disabled={isLoading} 
              />
              <div className="h-24 w-px bg-gray-600 hidden md:block"></div>
              <ChartUploader 
                onChartUpload={handleChartUpload}
                disabled={isLoading} 
              />
            </div>
          </div>
          
          <button 
            onClick={handleAnalyzeClick}
            disabled={isAnalyzeDisabled}
            className="px-12 py-4 text-xl font-bold text-white bg-teal-600 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 transform hover:scale-105 disabled:scale-100"
          >
            {isLoading ? 'Analisando...' : 'Analisar Gráfico'}
          </button>
          
          {error && (
            <div className="w-full max-w-4xl p-4 text-center bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          <div className="w-full max-w-4xl">
            {isLoading && <Loader timeframe={timeframe}/>}
            {analysisResult && <AnalysisDisplay result={analysisResult} />}
          </div>

        </div>
      </main>
      <footer className="text-center p-4 text-sm text-gray-500">
        <p>Aviso: Esta ferramenta é apenas para fins informativos e não constitui aconselhamento financeiro. Negociar envolve riscos.</p>
      </footer>
    </div>
  );
}