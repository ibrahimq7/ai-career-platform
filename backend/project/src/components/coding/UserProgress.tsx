import { PieChart, BarChart, Trophy } from 'lucide-react';

type ProgressStatsType = {
  total: number;
  completed: number;
  percentComplete: number;
  easy: { total: number; completed: number };
  medium: { total: number; completed: number };
  hard: { total: number; completed: number };
};

type UserProgressProps = {
  stats: ProgressStatsType;
};

const UserProgress = ({ stats }: UserProgressProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Progress
        </h3>
        <div className="flex items-center space-x-1">
          <Trophy size={16} className="text-yellow-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {stats.completed}/{stats.total}
          </span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Problems Solved
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {stats.percentComplete}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" 
            style={{ width: `${stats.percentComplete}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <PieChart size={24} className="text-purple-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {stats.completed}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Completed
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <BarChart size={24} className="text-blue-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {((stats.completed / stats.total) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Completion Rate
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          By Difficulty
        </h4>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span className="text-green-600 dark:text-green-400 font-medium">Easy</span>
            <span className="text-gray-600 dark:text-gray-300">
              {stats.easy.completed}/{stats.easy.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-green-500 h-1.5 rounded-full" 
              style={{ width: `${stats.easy.total > 0 ? (stats.easy.completed / stats.easy.total) * 100 : 0}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span className="text-yellow-600 dark:text-yellow-400 font-medium">Medium</span>
            <span className="text-gray-600 dark:text-gray-300">
              {stats.medium.completed}/{stats.medium.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-yellow-500 h-1.5 rounded-full" 
              style={{ width: `${stats.medium.total > 0 ? (stats.medium.completed / stats.medium.total) * 100 : 0}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span className="text-red-600 dark:text-red-400 font-medium">Hard</span>
            <span className="text-gray-600 dark:text-gray-300">
              {stats.hard.completed}/{stats.hard.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-red-500 h-1.5 rounded-full" 
              style={{ width: `${stats.hard.total > 0 ? (stats.hard.completed / stats.hard.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProgress;