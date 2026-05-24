import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, BarChart2, Award, Activity, CheckCircle, BarChart, Target } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'problems'>('overview');
  
  // Mock data for the profile page
  const stats = {
    resumeUploads: 3,
    resumeScore: 78,
    problemsSolved: 15,
    totalProblems: 48,
    streak: 3,
    easyProblems: 8,
    mediumProblems: 5,
    hardProblems: 2,
    submissions: 42,
    acceptance: 68
  };
  
  // Mock data for heatmap
  const generateHeatmapData = () => {
    // Generate random data for 12 weeks (84 days)
    const data = [];
    for (let i = 0; i < 84; i++) {
      // Generate a random value between 0 and 4
      const value = Math.floor(Math.random() * 5);
      data.push(value);
    }
    return data;
  };
  
  const heatmapData = generateHeatmapData();
  
  // Get color for heatmap cell
  const getHeatmapColor = (value: number) => {
    if (value === 0) return 'bg-gray-100 dark:bg-gray-700';
    if (value === 1) return 'bg-green-100 dark:bg-green-900/30';
    if (value === 2) return 'bg-green-200 dark:bg-green-900/50';
    if (value === 3) return 'bg-green-300 dark:bg-green-900/70';
    return 'bg-green-500 dark:bg-green-700';
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-700 dark:to-teal-600 h-32" />
        
        <div className="px-6 py-4 sm:flex sm:items-center">
          <div className="-mt-16 sm:-mt-32 sm:flex-shrink-0">
            <img 
              src={user?.avatar || "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} 
              alt={user?.name || "User"}
              className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 object-cover"
            />
          </div>
          <div className="mt-6 sm:mt-0 sm:ml-6 space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.name || "John Doe"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Software Engineer at Tech Company
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <Award size={16} className="text-purple-500 mr-1" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Streak: {stats.streak} days
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={16} className="text-green-500 mr-1" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {stats.problemsSolved} problems solved
                </span>
              </div>
              <div className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Pro
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'resume'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Resume Progress
            </button>
            <button
              onClick={() => setActiveTab('problems')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'problems'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Coding Progress
            </button>
          </nav>
        </div>
      </div>
      
      <div className="mt-6 space-y-6">
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <Award size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Current Streak
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.streak} days
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    <BarChart2 size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Problems Solved
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.problemsSolved}/{stats.totalProblems}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    <Activity size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Last Resume Score
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.resumeScore}/100
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-md bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                    <Target size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Acceptance Rate
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.acceptance}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Activity
                </h2>
                <div className="flex items-center">
                  <Calendar size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Last 12 weeks
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className="h-6 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {heatmapData.map((value, i) => (
                  <div 
                    key={i}
                    className={`h-6 rounded-sm ${getHeatmapColor(value)}`}
                    title={`${value} activities`}
                  />
                ))}
              </div>
              
              <div className="flex justify-end mt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Less</span>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-700" />
                    <div className="w-3 h-3 rounded-sm bg-green-100 dark:bg-green-900/30" />
                    <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/50" />
                    <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-900/70" />
                    <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-700" />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">More</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Coding Problems
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Easy ({stats.easyProblems})
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.round((stats.easyProblems / 20) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${Math.round((stats.easyProblems / 20) * 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Medium ({stats.mediumProblems})
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.round((stats.mediumProblems / 20) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${Math.round((stats.mediumProblems / 20) * 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Hard ({stats.hardProblems})
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.round((stats.hardProblems / 8) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${Math.round((stats.hardProblems / 8) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                    Topics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Arrays
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          5/10
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full w-1/2" />
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Strings
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          3/8
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '37.5%' }} />
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Linked Lists
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          2/6
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '33.3%' }} />
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Trees
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          4/7
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '57.1%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Resume Analysis
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-md font-medium text-gray-900 dark:text-white">
                        Latest Resume
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Uploaded 3 days ago
                      </span>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mr-2">
                        {stats.resumeScore}
                      </div>
                      <div className="font-medium text-sm text-gray-500 dark:text-gray-400">
                        /100 ATS Score
                      </div>
                      <div className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        Good
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Keywords
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            70%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '70%' }} />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Format
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            85%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '85%' }} />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Content
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            75%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '75%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-md font-medium text-gray-900 dark:text-white">
                    Missing Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['TypeScript', 'Docker', 'AWS', 'CI/CD', 'GraphQL'].map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-md font-medium text-gray-900 dark:text-white">
                    Resume History
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <BarChart size={16} className="text-blue-500 mr-2" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            resume_v3.pdf
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            3 days ago
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="text-sm font-bold text-gray-900 dark:text-white mr-1">
                            78
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400">
                            +6
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <BarChart size={16} className="text-blue-500 mr-2" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            resume_v2.pdf
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            2 weeks ago
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="text-sm font-bold text-gray-900 dark:text-white mr-1">
                            72
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400">
                            +12
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <BarChart size={16} className="text-blue-500 mr-2" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            resume_v1.pdf
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            1 month ago
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="text-sm font-bold text-gray-900 dark:text-white mr-1">
                            60
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'resume' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Resume Progress
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Detailed resume progress stats and history will be shown here.
            </p>
          </div>
        )}
        
        {activeTab === 'problems' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Coding Problems Progress
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Detailed coding problems progress and statistics will be shown here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;