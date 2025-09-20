// @google/genai guideline: Importing GoogleGenAI and Type for API interaction and schema definition.
import { GoogleGenAI, Type } from "@google/genai";
import type { Timeframe, AnalysisResult } from '../types';

// @google/genai guideline: Always use `new GoogleGenAI({apiKey: process.env.API_KEY})`.
// The API key MUST be obtained exclusively from `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// @google/genai guideline: Define a responseSchema for structured JSON output.
const schema = {
  type: Type.OBJECT,
  properties: {
    signal: {
      type: Type.STRING,
      description: "O sinal de negociação para a próxima vela. Deve ser 'CALL' (compra/alta), 'PUT' (venda/baixa), ou 'NEUTRO' (aguardar/sem sinal claro)."
    },
    confidence: {
      type: Type.NUMBER,
      description: "Nível de confiança no sinal, de 0 a 100."
    },
    analysis: {
      type: Type.STRING,
      description: "Uma análise técnica concisa (máximo 3-4 frases) explicando o porquê do sinal. Mencione os principais indicadores ou padrões observados (ex: engolfo de alta, zona de suporte, RSI sobrevendido)."
    },
    expiration: {
      type: Type.STRING,
      description: "O tempo de expiração recomendado para a operação. Use '1 Minuto' para timeframe M1 e '5 Minutos' para timeframe M5."
    }
  },
  required: ["signal", "confidence", "analysis", "expiration"]
};


export async function analyzeChart(base64: string, mimeType: string, timeframe: Timeframe): Promise<AnalysisResult> {
  const systemInstruction = "Você é um analista especialista em negociação de opções binárias. Sua tarefa é analisar um gráfico de candlestick fornecido e prever a direção da próxima vela. Você deve fornecer sua análise estritamente no formato JSON solicitado, incluindo um tempo de expiração fixo de '1 Minuto' para M1 e '5 Minutos' para M5, sem nenhum texto ou formatação adicional.";

  const textPrompt = `Analise este gráfico de candlestick para o timeframe de ${timeframe}. Com base na análise técnica, qual é o sinal para a próxima vela? Forneça um sinal claro (CALL, PUT ou NEUTRO), um nível de confiança (0-100), uma breve explicação dos principais fatores e o tempo de expiração. O tempo de expiração deve ser estritamente '1 Minuto' se o timeframe for M1, e '5 Minutos' se o timeframe for M5.`;
  
  // @google/genai guideline: Generate content with multiple parts for image and text prompts.
  const imagePart = {
    inlineData: {
      data: base64,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: textPrompt,
  };

  try {
    // @google/genai guideline: Use ai.models.generateContent to query GenAI.
    const response = await ai.models.generateContent({
      // @google/genai guideline: Use 'gemini-2.5-flash' for general text/image tasks.
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2, // Lower temperature for more deterministic analysis
      },
    });

    // @google/genai guideline: Use the `.text` property on the response to get the generated text.
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Basic validation
    if (!result.signal || typeof result.confidence !== 'number' || !result.analysis || !result.expiration) {
        throw new Error("Resposta da IA está em um formato inválido.");
    }

    return result as AnalysisResult;

  } catch (error) {
    // @google/genai guideline: Implement robust handling for API errors.
    console.error("Erro ao chamar a API Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Erro na comunicação com a IA: ${error.message}`);
    }
    throw new Error("Um erro desconhecido ocorreu ao se comunicar com a IA.");
  }
}