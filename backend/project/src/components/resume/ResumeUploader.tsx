import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, X, Loader } from 'lucide-react';

type ResumeUploaderProps = {
  onFileUpload: (file: File) => void;
  onAnalyze: () => void;
  file: File | null;
  isAnalyzing: boolean;
};

const ResumeUploader = ({ onFileUpload, onAnalyze, file, isAnalyzing }: ResumeUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndUploadFile(droppedFile);
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUploadFile(e.target.files[0]);
    }
  };
  
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const validateAndUploadFile = (file: File) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or DOCX file.');
      return;
    }
    
    if (file.size > maxSize) {
      alert('File size must be less than 5MB.');
      return;
    }
    
    onFileUpload(file);
  };
  
  const handleRemoveFile = () => {
    onFileUpload(null as unknown as File);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600'
        } transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx"
          className="hidden"
        />
        
        {!file ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload size={48} className="text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Drag and drop your resume here, or{' '}
              <button
                type="button"
                onClick={handleBrowseClick}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                browse for a file
              </button>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports: PDF, DOCX (Max 5MB)
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Remove file"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>
      
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!file || isAnalyzing}
          className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 ${
            !file || isAnalyzing
              ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader size={18} className="animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <FileText size={18} />
              <span>Analyze Resume</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResumeUploader;