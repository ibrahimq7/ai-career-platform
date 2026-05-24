import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, SortDesc, Clock, BarChart2 } from 'lucide-react';
import ProblemList from '../../components/coding/ProblemList';
import UserProgress from '../../components/coding/UserProgress';
import { Problem } from '../../types';

const CodingPage = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to fetch problems
    const fetchProblems = async () => {
      setIsLoading(true);
      // Mock data
      const mockProblems: Problem[] = [
        {
          id: 'two-sum',
          title: 'Two Sum',
          difficulty: 'Easy',
          tags: ['Array', 'Hash Table'],
          acceptance: 47.2,
          description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
          completedByUser: true,
        },
        {
          id: 'add-two-numbers',
          title: 'Add Two Numbers',
          difficulty: 'Medium',
          tags: ['Linked List', 'Math', 'Recursion'],
          acceptance: 38.9,
          description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit.',
          completedByUser: true,
        },
        {
          id: 'longest-substring-without-repeating-characters',
          title: 'Longest Substring Without Repeating Characters',
          difficulty: 'Medium',
          tags: ['Hash Table', 'String', 'Sliding Window'],
          acceptance: 33.8,
          description: 'Given a string s, find the length of the longest substring without repeating characters.',
          completedByUser: false,
        },
        {
          id: 'median-of-two-sorted-arrays',
          title: 'Median of Two Sorted Arrays',
          difficulty: 'Hard',
          tags: ['Array', 'Binary Search', 'Divide and Conquer'],
          acceptance: 35.1,
          description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
          completedByUser: false,
        },
        {
          id: 'longest-palindromic-substring',
          title: 'Longest Palindromic Substring',
          difficulty: 'Medium',
          tags: ['String', 'Dynamic Programming'],
          acceptance: 32.4,
          description: 'Given a string s, return the longest palindromic substring in s.',
          completedByUser: false,
        },
        {
          id: 'regular-expression-matching',
          title: 'Regular Expression Matching',
          difficulty: 'Hard',
          tags: ['String', 'Dynamic Programming', 'Recursion'],
          acceptance: 28.3,
          description: 'Given an input string s and a pattern p, implement regular expression matching with support for "." and "*" where.',
          completedByUser: false,
        },
        {
          id: 'container-with-most-water',
          title: 'Container With Most Water',
          difficulty: 'Medium',
          tags: ['Array', 'Two Pointers', 'Greedy'],
          acceptance: 54.3,
          description: 'Given n non-negative integers a1, a2, ..., an, where each represents a point at coordinate (i, ai).',
          completedByUser: true,
        },
        {
          id: 'binary-tree-inorder-traversal',
          title: 'Binary Tree Inorder Traversal',
          difficulty: 'Easy',
          tags: ['Tree', 'Stack', 'Depth-First Search'],
          acceptance: 72.8,
          description: 'Given the root of a binary tree, return the inorder traversal of its nodes values.',
          completedByUser: true,
        },
      ];
      
      setTimeout(() => {
        setProblems(mockProblems);
        setFilteredProblems(mockProblems);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchProblems();
  }, []);
  
  // Filter problems based on search query, difficulty, and tag
  useEffect(() => {
    let filtered = [...problems];
    
    if (searchQuery) {
      filtered = filtered.filter(problem => 
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (selectedDifficulty) {
      filtered = filtered.filter(problem => problem.difficulty === selectedDifficulty);
    }
    
    if (selectedTag) {
      filtered = filtered.filter(problem => problem.tags.includes(selectedTag));
    }
    
    setFilteredProblems(filtered);
  }, [searchQuery, selectedDifficulty, selectedTag, problems]);
  
  // Get all unique tags from problems
  const getAllTags = () => {
    const tags = new Set<string>();
    problems.forEach(problem => {
      problem.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  };
  
  const allTags = getAllTags();
  
  // Calculate progress stats
  const getProgressStats = () => {
    const total = problems.length;
    const completed = problems.filter(p => p.completedByUser).length;
    const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const easyTotal = problems.filter(p => p.difficulty === 'Easy').length;
    const easyCompleted = problems.filter(p => p.difficulty === 'Easy' && p.completedByUser).length;
    
    const mediumTotal = problems.filter(p => p.difficulty === 'Medium').length;
    const mediumCompleted = problems.filter(p => p.difficulty === 'Medium' && p.completedByUser).length;
    
    const hardTotal = problems.filter(p => p.difficulty === 'Hard').length;
    const hardCompleted = problems.filter(p => p.difficulty === 'Hard' && p.completedByUser).length;
    
    return {
      total,
      completed,
      percentComplete,
      easy: { total: easyTotal, completed: easyCompleted },
      medium: { total: mediumTotal, completed: mediumCompleted },
      hard: { total: hardTotal, completed: hardCompleted }
    };
  };
  
  const progressStats = getProgressStats();
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Coding Interview Practice
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Solve coding problems to prepare for technical interviews
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Link
              to="/profile"
              className="px-4 py-2 text-sm font-medium flex items-center rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            >
              <BarChart2 size={16} className="mr-1" />
              My Progress
            </Link>
            <Link
              to="/coding/random"
              className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              Random Problem
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search problems by title or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-4">
            <div className="relative">
              <select
                className="appearance-none block w-full pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <Filter size={16} className="text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <select
                className="appearance-none block w-full pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="">All Topics</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SortDesc size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProblemList 
            problems={filteredProblems} 
            isLoading={isLoading} 
          />
        </div>
        
        <div>
          <UserProgress stats={progressStats} />
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Daily Streak
              </h3>
              <div className="flex items-center">
                <Clock size={16} className="text-blue-500 mr-1" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Today's Progress</span>
              </div>
            </div>
            
            <div className="flex space-x-1 mb-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <div 
                  key={index}
                  className={`flex-1 h-2 rounded-full ${
                    index < 3 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <span className="font-semibold">Current Streak:</span> 3 days
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                Solve one problem today to continue your streak!
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Featured Companies
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {['Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple', 'Netflix'].map((company) => (
                <div 
                  key={company}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingPage;