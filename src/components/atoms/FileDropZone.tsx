import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileCheck } from 'lucide-react';
import { IconButton } from './IconButton';

export interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  hint?: string;
  className?: string;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFileSelect,
  onFileRemove,
  accept = 'image/*',
  maxSizeMB = 10,
  label = 'Arrastra tu archivo aquí',
  hint = 'o haz clic para seleccionar',
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);

    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      setError(`El archivo excede ${maxSizeMB}MB`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [maxSizeMB, onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleClick = () => inputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
    onFileRemove?.();
  };

  const borderColor = error
    ? 'border-inmo-danger'
    : isDragging
      ? 'border-inmo-accent'
      : 'border-inmo-tertiary dark:border-inmo-darktertiary';

  const bgColor = isDragging
    ? 'bg-inmo-accent/5 dark:bg-inmo-accent/10'
    : 'bg-white dark:bg-inmo-darkcard';

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed ${borderColor} ${bgColor} rounded-card shadow-soft p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-[140px] hover:border-inmo-accent`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        {selectedFile && preview ? (
          <div className="relative w-full flex flex-col items-center gap-3">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-24 h-24 object-cover rounded-2xl shadow-sm"
            />
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-inmo-success" strokeWidth={2} />
              <span className="text-body font-bold text-inmo-success truncate max-w-[200px]">
                {selectedFile.name}
              </span>
            </div>
            <IconButton
              onClick={handleRemove}
              icon={<X className="w-4 h-4" strokeWidth={2} />}
              variant="ghost"
              className="absolute -top-2 -right-2 !bg-inmo-danger !text-white !p-1 !shadow-soft hover:scale-110 transition-transform !w-auto !h-auto !min-w-0 !min-h-0"
            />
          </div>
        ) : selectedFile ? (
          <div className="relative w-full flex flex-col items-center gap-3">
            <FileCheck className="w-12 h-12 text-inmo-success" strokeWidth={1.5} />
            <span className="text-body font-bold text-inmo-success truncate max-w-[200px]">
              {selectedFile.name}
            </span>
            <IconButton
              onClick={handleRemove}
              icon={<X className="w-4 h-4" strokeWidth={2} />}
              variant="ghost"
              className="absolute -top-2 -right-2 !bg-inmo-danger !text-white !p-1 !shadow-soft hover:scale-110 transition-transform !w-auto !h-auto !min-w-0 !min-h-0"
            />
          </div>
        ) : (
          <>
            <Upload 
              className={`w-10 h-10 ${isDragging ? 'text-inmo-accent' : 'text-gray-400'} transition-colors`} 
              strokeWidth={1.5} 
            />
            <span className="text-body font-bold text-center">{label}</span>
            <span className="text-body text-xs text-center">{hint}</span>
          </>
        )}
      </div>

      {error && (
        <span className="text-inmo-danger font-inter font-bold text-sm pl-6">
          {error}
        </span>
      )}
    </div>
  );
};
