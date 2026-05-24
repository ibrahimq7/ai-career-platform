import { Link } from 'react-router-dom';
import { CheckCircle, CircleDashed, ArrowRight } from 'lucide-react';
import { Problem } from '../../types';

type ProblemListProps = {
  problems: Problem[];
  isLoading: boolean;
};

const ProblemList = ({ problems, isLoading }: ProblemListProps) => {
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
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="animate-pulse space-y-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:pb-0 last:border-0">
              <div className="flex justify-between items-center mb-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/5"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/5"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
              <div className="flex flex-wrap gap-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-14"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // No problems found
  if (problems.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <div className="text-gray-500 dark:text-gray-400 mb-2">
          No problems match your filters
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Problem List
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {problems.length} problems
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {problems.map((problem) => (
          <div key={problem.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                {problem.completedByUser ? (
                  <CheckCircle size={18} className="text-green-500 mr-2 flex-shrink-0" />
                ) : (
                  <CircleDashed size={18} className="text-gray-400 mr-2 flex-shrink-0" />
                )}
                <Link
                  to={`/coding/${problem.id}`}
                  className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {problem.title}
                </Link>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {problem.description}
            </p>
            
            <div className="flex justify-between items-end">
              <div className="flex flex-wrap gap-2">
                {problem.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                  {problem.acceptance.toFixed(1)}% acceptance
                </span>
                <Link
                  to={`/coding/${problem.id}`}
                  className="p-1 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemList;