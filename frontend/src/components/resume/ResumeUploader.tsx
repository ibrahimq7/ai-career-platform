import { useRef, useState, DragEvent, ChangeEvent, KeyboardEvent } from 'react';
import { Upload, FileText, X, Loader, ScanLine } from 'lucide-react';

type ResumeUploaderProps = {
  onFileUpload: (file: File | null) => void;
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

  const handleDropZoneKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleBrowseClick();
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
    onFileUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-5">
      <div
        className={`relative overflow-hidden rounded-2xl border p-8 text-center backdrop-blur-2xl transition-all duration-300 ${
          isDragging
            ? 'border-cyan-300 bg-cyan-400/10 shadow-[0_0_40px_rgba(34,211,238,0.25)]'
            : 'border-white/10 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
        } cursor-pointer hover:border-cyan-300/45 hover:bg-white/[0.09]`}
        role="button"
        tabIndex={0}
        onClick={handleBrowseClick}
        onKeyDown={handleDropZoneKeyDown}
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
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_35px_rgba(34,211,238,0.2)]">
              <Upload size={34} className="text-cyan-200" />
            </div>
            <p className="text-slate-200">
              Drag and drop your resume here, or{' '}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleBrowseClick();
                }}
                className="font-semibold text-cyan-200 hover:text-white"
              >
                browse for a file
              </button>
            </p>
            <p className="text-sm text-slate-400">
              Supports: PDF, DOCX (Max 5MB)
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl border border-fuchsia-300/30 bg-fuchsia-400/10 p-3">
                <FileText size={24} className="text-fuchsia-200" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-100">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleRemoveFile();
              }}
              className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
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
          className={`flex items-center space-x-2 rounded-full px-7 py-3 text-sm font-semibold transition-all ${
            !file || isAnalyzing
              ? 'cursor-not-allowed bg-white/10 text-slate-500'
              : 'bg-cyan-300 text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)] hover:-translate-y-0.5 hover:bg-white'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader size={18} className="animate-spin" />
              <span>Scanning Resume</span>
            </>
          ) : (
            <>
              <ScanLine size={18} />
              <span>Analyze Resume</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResumeUploader;
