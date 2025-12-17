import { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  categoryColor: string;
  disabled?: boolean;
}

export function FileUpload({ onUpload, categoryColor, disabled }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('סוג קובץ לא נתמך. אנא העלה PDF או תמונה (JPG, PNG)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('הקובץ גדול מדי. מקסימום 10MB');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || disabled || isUploading) return;

    setIsUploading(true);
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('שגיאה בהעלאת הקובץ. נסה שוב.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          isDragging
            ? 'border-opacity-60 bg-opacity-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        style={{
          borderColor: isDragging ? categoryColor : undefined,
          backgroundColor: isDragging ? `${categoryColor}20` : undefined,
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !isUploading) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.gif"
          onChange={handleFileInput}
          disabled={disabled || isUploading}
          className="hidden"
        />

        {!selectedFile ? (
          <>
            <Upload
              className="mx-auto mb-3"
              style={{ color: categoryColor }}
              size={32}
            />
            <p className="text-sm text-gray-600 mb-2">
              גרור קובץ לכאן או לחץ לבחירה
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              className="px-4 py-2 rounded-lg text-sm text-white transition-all disabled:opacity-50"
              style={{ backgroundColor: categoryColor }}
            >
              בחר קובץ
            </button>
            <p className="text-xs text-gray-500 mt-2">
              PDF או תמונה (JPG, PNG) - מקסימום 10MB
            </p>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File style={{ color: categoryColor }} size={24} />
              <div className="text-right">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              disabled={isUploading}
              className="p-1 rounded hover:bg-gray-100"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        )}
      </div>

      {selectedFile && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={disabled || isUploading}
          className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: categoryColor }}
        >
          {isUploading ? 'מעלה...' : 'העלה קובץ'}
        </button>
      )}
    </div>
  );
}
