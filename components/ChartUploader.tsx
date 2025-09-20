import React, { useRef, useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface ChartUploaderProps {
  onChartUpload: (base64: string, mimeType: string, fileName: string) => void;
  disabled: boolean;
}

export const ChartUploader: React.FC<ChartUploaderProps> = ({ onChartUpload, disabled }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImagePreview(reader.result as string);
        setFileName(file.name);
        onChartUpload(base64String, file.type, file.name);
      };
      reader.readAsDataURL(file);
    } else {
        alert("Por favor, selecione um arquivo de imagem válido.");
    }
  };
  
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if(disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            setImagePreview(reader.result as string);
            setFileName(file.name);
            onChartUpload(base64String, file.type, file.name);
        };
        reader.readAsDataURL(file);
    }
  }, [disabled, onChartUpload]);


  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        disabled={disabled}
      />
      {imagePreview ? (
        <div className="w-full text-center">
            <h3 className="text-xl font-semibold mb-4 text-white">Pré-visualização do Gráfico</h3>
            <div className="relative group">
                <img src={imagePreview} alt="Chart Preview" className="rounded-lg shadow-xl mx-auto border-2 border-gray-600" />
                <button 
                  onClick={handleClick} 
                  disabled={disabled}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:cursor-not-allowed">
                    <span className="text-lg font-semibold">Alterar Imagem</span>
                </button>
            </div>
            <p className="text-sm text-gray-400 mt-2 font-mono">{fileName}</p>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={`w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400 transition-all duration-300 ${disabled ? 'cursor-not-allowed bg-gray-800' : 'cursor-pointer hover:border-teal-500 hover:bg-gray-800/50 hover:text-teal-400'}`}
        >
          <UploadIcon className="h-12 w-12 mb-2" />
          <p className="text-lg font-semibold">Clique para enviar ou arraste e solte</p>
          <p className="text-sm">PNG, JPG, GIF de até 10MB</p>
        </div>
      )}
    </div>
  );
};