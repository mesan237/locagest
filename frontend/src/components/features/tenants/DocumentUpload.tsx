import React, { useState, useRef } from 'react';
import { Button } from '../../ui/Button';

interface DocumentUploadProps {
  label: string;
  onFileSelected: (file: File | null) => void;
  currentFile?: string;
  maxSizeMB?: number;
  accept?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  onFileSelected,
  currentFile,
  maxSizeMB = 5,
  accept = 'image/*,application/pdf',
}) => {
  const [preview, setPreview] = useState<string | null>(currentFile || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`Le fichier dépasse la taille maximale de ${maxSizeMB}MB`);
      return;
    }

    setSelectedFile(file);
    onFileSelected(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    onFileSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        {preview ? (
          <div className="space-y-2">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto object-contain rounded"
            />
            <div className="flex justify-center space-x-2">
              <Button type="button" size="sm" onClick={handleButtonClick}>
                Changer
              </Button>
              <Button type="button" size="sm" variant="secondary" onClick={handleRemove}>
                Supprimer
              </Button>
            </div>
          </div>
        ) : selectedFile ? (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm text-gray-600">{selectedFile.name}</span>
            </div>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / 1024).toFixed(0)} KB
            </p>
            <div className="flex justify-center space-x-2">
              <Button type="button" size="sm" onClick={handleButtonClick}>
                Changer
              </Button>
              <Button type="button" size="sm" variant="secondary" onClick={handleRemove}>
                Supprimer
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-2">
              <Button type="button" onClick={handleButtonClick}>
                Sélectionner un fichier
              </Button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, PDF jusqu'à {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
