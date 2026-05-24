import { useState, useEffect } from 'react';

type CodeEditorProps = {
  code: string;
  setCode: (code: string) => void;
  language: string;
};

// This is a simplified code editor component
// In a real application, you would use a library like Monaco Editor or CodeMirror
const CodeEditor = ({ code, setCode, language }: CodeEditorProps) => {
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);
  
  // Generate line numbers whenever code changes
  useEffect(() => {
    const lines = code.split('\n');
    const numbers = Array.from({ length: lines.length }, (_, i) => (i + 1).toString());
    setLineNumbers(numbers);
  }, [code]);
  
  return (
    <div className="relative h-[calc(50vh-120px)] overflow-hidden">
      <div className="flex h-full">
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 py-2 pl-2 pr-3 text-right font-mono text-sm select-none border-r border-gray-200 dark:border-gray-700">
          {lineNumbers.map((num, i) => (
            <div key={i} className="leading-loose">
              {num}
            </div>
          ))}
        </div>
        
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
          className="flex-1 font-mono text-sm p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-0 border-0 leading-loose"
          style={{
            whiteSpace: 'pre',
            overflowX: 'auto'
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;