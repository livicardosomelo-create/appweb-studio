export type Timeframe = 'M1' | 'M5';

export interface AnalysisResult {
  signal: 'CALL' | 'PUT' | 'NEUTRO';
  confidence: number;
  analysis: string;
  expiration: string;
}