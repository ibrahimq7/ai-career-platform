import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, BookOpen, MessageSquare, Clock, Share2 } from 'lucide-react';
import CodeEditor from '../../components/coding/CodeEditor';
import TestCaseRunner from '../../components/coding/TestCaseRunner';
import ProblemDescription from '../../components/coding/ProblemDescription';
import { Problem } from '../../types';

const ProblemPage = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'solutions' | 'submissions'>('description');
  
  useEffect(() => {
    // Simulate API call to fetch problem details
    const fetchProblem = async () => {
      setIsLoading(true);
      
      // Mock problem data based on ID
      setTimeout(() => {
        // Find problem by ID (in a real app this would be an API call)
        if (problemId === 'two-sum') {
          setProblem({
            id: 'two-sum',
            title: 'Two Sum',
            difficulty: 'Easy',
            tags: ['Array', 'Hash Table'],
            acceptance: 47.2,
            description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
            completedByUser: true,
            examples: [
              {
                input: 'nums = [2,7,11,15], target = 9',
                output: '[0,1]',
                explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
              },
              {
                input: 'nums = [3,2,4], target = 6',
                output: '[1,2]',
                explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
              },
              {
                input: 'nums = [3,3], target = 6',
                output: '[0,1]',
                explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].'
              }
            ],
            constraints: [
              '2 <= nums.length <= 10^4',
              '-10^9 <= nums[i] <= 10^9',
              '-10^9 <= target <= 10^9',
              'Only one valid answer exists.'
            ],
            testCases: [
              {
                input: '[2,7,11,15]\n9',
                expectedOutput: '[0,1]'
              },
              {
                input: '[3,2,4]\n6',
                expectedOutput: '[1,2]'
              },
              {
                input: '[3,3]\n6',
                expectedOutput: '[0,1]'
              }
            ],
            hints: [
              'Try using a hash map to store numbers you\'ve seen and their indices.',
              'For each number, check if target - number exists in the hash map.'
            ]
          });
          
          // Set default code
          setCode(`/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Your code here
  
}`);
        } else {
          // Default problem if ID doesn't match
          setProblem({
            id: problemId || 'unknown',
            title: 'Problem Not Found',
            difficulty: 'Medium',
            tags: ['Array'],
            acceptance: 0,
            description: 'This problem cannot be found or is not available.',
            completedByUser: false
          });
        }
        
        setIsLoading(false);
      }, 1000);
    };
    
    fetchProblem();
  }, [problemId]);
  
  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!problem) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Problem Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The problem you're looking for doesn't exist or is unavailable.
          </p>
          <Link
            to="/coding"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Problems
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center">
          <Link
            to="/coding"
            className="mr-3 p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={20} />
          </Link>
          
          <div className="flex-1">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mr-3">
                {problem.title}
              </h1>
              {problem.completedByUser && (
                <CheckCircle size={18} className="text-green-500" />
              )}
            </div>
            
            <div className="flex items-center mt-1 space-x-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {problem.acceptance.toFixed(1)}% acceptance
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="View solutions"
            >
              <BookOpen size={18} />
            </button>
            <button
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Discussions"
            >
              <MessageSquare size={18} />
            </button>
            <button
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Timer"
            >
              <Clock size={18} />
            </button>
            <button
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Share"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'description'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('solutions')}
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'solutions'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Solutions
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'submissions'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Submissions
              </button>
            </nav>
          </div>
          
          <div className="p-4 overflow-y-auto h-[calc(100vh-320px)]">
            {activeTab === 'description' && problem && (
              <ProblemDescription problem={problem} />
            )}
            
            {activeTab === 'solutions' && (
              <div className="text-center p-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Solutions will be available after you successfully solve the problem.
                </p>
              </div>
            )}
            
            {activeTab === 'submissions' && (
              <div className="text-center p-4">
                <p className="text-gray-600 dark:text-gray-300">
                  You haven't made any submissions for this problem yet.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex justify-between items-center">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="text-sm rounded bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-2 py-1"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
              
              <div className="flex space-x-2">
                <button className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  Format
                </button>
                <button className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  Reset
                </button>
              </div>
            </div>
            
            <CodeEditor 
              code={code} 
              setCode={setCode} 
              language={selectedLanguage} 
            />
          </div>
          
          <TestCaseRunner 
            problem={problem} 
            code={code} 
            language={selectedLanguage} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;