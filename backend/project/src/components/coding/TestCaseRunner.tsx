import { useState } from 'react';
import { Play, Check, X, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Problem } from '../../types';

type TestCaseRunnerProps = {
  problem: Problem;
  code: string;
  language: string;
};

type TestResult = {
  status: 'success' | 'error' | 'pending';
  message: string;
  output?: string;
  expected?: string;
  time?: string;
  memory?: string;
};

const TestCaseRunner = ({ problem, code, language }: TestCaseRunnerProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [activeTestCase, setActiveTestCase] = useState<number | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  // Run code on test cases
  const runCode = () => {
    if (!code.trim() || !problem.testCases) return;
    
    setIsRunning(true);
    setTestResults([]);
    
    // For demo purposes, simulate API call to judge system
    setTimeout(() => {
      const results: TestResult[] = [];
      
      // First test case succeeds, second fails (for demo purposes)
      if (problem.testCases) {
        problem.testCases.forEach((testCase, index) => {
          if (index === 0) {
            results.push({
              status: 'success',
              message: 'All test cases passed!',
              output: testCase.expectedOutput,
              expected: testCase.expectedOutput,
              time: '4 ms',
              memory: '41.9 MB'
            });
          } else if (index === 1) {
            results.push({
              status: 'error',
              message: 'Wrong answer',
              output: '[1,2]', // Simulated wrong output
              expected: testCase.expectedOutput,
              time: '3 ms',
              memory: '42.1 MB'
            });
          } else {
            results.push({
              status: 'success',
              message: 'All test cases passed!',
              output: testCase.expectedOutput,
              expected: testCase.expectedOutput,
              time: '3 ms',
              memory: '42.0 MB'
            });
          }
        });
      }
      
      setTestResults(results);
      setIsRunning(false);
    }, 2000);
  };
  
  // Submit solution to judge system
  const submitSolution = () => {
    if (!code.trim()) return;
    
    setIsRunning(true);
    
    // For demo purposes, simulate API call to judge system
    setTimeout(() => {
      // Simulate successful submission
      alert('Solution submitted successfully! Your solution passed all test cases.');
      setIsRunning(false);
    }, 3000);
  };
  
  // Toggle test case details
  const toggleTestCase = (index: number) => {
    if (activeTestCase === index) {
      setActiveTestCase(null);
    } else {
      setActiveTestCase(index);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Test Cases
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={runCode}
              disabled={isRunning}
              className={`px-3 py-1 rounded text-sm font-medium flex items-center ${
                isRunning
                  ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
              }`}
            >
              <Play size={14} className="mr-1" />
              Run
            </button>
            <button
              onClick={submitSolution}
              disabled={isRunning}
              className={`px-3 py-1 rounded text-sm font-medium ${
                isRunning
                  ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
              }`}
            >
              Submit
            </button>
          </div>
        </div>
        
        {problem.testCases && (
          <div className="space-y-2">
            {problem.testCases.map((testCase, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                <div 
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 cursor-pointer"
                  onClick={() => toggleTestCase(index)}
                >
                  <div className="flex items-center">
                    {activeTestCase === index ? (
                      <ChevronDown size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Test Case {index + 1}
                    </span>
                  </div>
                  
                  {testResults[index] && (
                    <div className="flex items-center">
                      {testResults[index].status === 'success' ? (
                        <Check size={16} className="text-green-500 mr-1" />
                      ) : testResults[index].status === 'error' ? (
                        <X size={16} className="text-red-500 mr-1" />
                      ) : (
                        <AlertCircle size={16} className="text-yellow-500 mr-1" />
                      )}
                      <span 
                        className={`text-xs font-medium ${
                          testResults[index].status === 'success'
                            ? 'text-green-600 dark:text-green-400'
                            : testResults[index].status === 'error'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-yellow-600 dark:text-yellow-400'
                        }`}
                      >
                        {testResults[index].status === 'success' ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  )}
                </div>
                
                {activeTestCase === index && (
                  <div className="p-3 text-sm border-t border-gray-200 dark:border-gray-700">
                    <div className="mb-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Input:</span>
                      <pre className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 overflow-auto">
                        {testCase.input}
                      </pre>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Expected Output:</span>
                      <pre className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 overflow-auto">
                        {testCase.expectedOutput}
                      </pre>
                    </div>
                    
                    {testResults[index] && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Your Output:</span>
                        <pre className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 overflow-auto">
                          {testResults[index].output}
                        </pre>
                        
                        {testResults[index].time && testResults[index].memory && (
                          <div className="mt-2 flex space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Runtime: {testResults[index].time}</span>
                            <span>Memory: {testResults[index].memory}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4">
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            {showCustomInput ? (
              <ChevronDown size={16} className="mr-1" />
            ) : (
              <ChevronRight size={16} className="mr-1" />
            )}
            Custom Input
          </button>
          
          {showCustomInput && (
            <div className="mt-2">
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter your custom input here..."
                className="w-full h-24 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => alert('Custom input execution not implemented in this demo')}
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Run with Custom Input
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCaseRunner;