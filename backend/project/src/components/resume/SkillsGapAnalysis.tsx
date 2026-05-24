import { Zap, AlertTriangle } from 'lucide-react';

type SkillsGapAnalysisProps = {
  currentSkills: string[];
  missingSkills: string[];
};

const SkillsGapAnalysis = ({ currentSkills, missingSkills }: SkillsGapAnalysisProps) => {
  // Generate job roles based on current skills
  const getRelevantJobRoles = () => {
    const roles = [];
    
    if (currentSkills.includes('React') || currentSkills.includes('JavaScript')) {
      roles.push('Frontend Developer');
    }
    
    if (currentSkills.includes('Node.js') || currentSkills.includes('Express')) {
      roles.push('Backend Developer');
    }
    
    if (
      (currentSkills.includes('React') || currentSkills.includes('JavaScript')) &&
      (currentSkills.includes('Node.js') || currentSkills.includes('Express'))
    ) {
      roles.push('Full Stack Developer');
    }
    
    if (currentSkills.includes('Python') || currentSkills.includes('SQL')) {
      roles.push('Data Analyst');
    }
    
    if (roles.length === 0) {
      roles.push('Software Developer');
    }
    
    return roles;
  };
  
  const relevantJobRoles = getRelevantJobRoles();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Skills Gap Analysis
      </h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Relevant Job Roles
        </h3>
        <div className="flex flex-wrap gap-3">
          {relevantJobRoles.map((role, index) => (
            <div 
              key={index}
              className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg flex items-center"
            >
              <Zap size={16} className="mr-2" />
              {role}
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center mr-2 text-xs font-bold">
              {currentSkills.length}
            </span>
            Your Current Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 flex items-center justify-center mr-2 text-xs font-bold">
              {missingSkills.length}
            </span>
            Missing Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertTriangle size={20} className="text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-1">
              Skills Gap Summary
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Based on our analysis, you're missing several key skills that are frequently requested in job postings for {relevantJobRoles[0]}s. Adding these skills to your resume could increase your chances of getting past ATS systems and securing interviews.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Industry Demand
        </h3>
        <div className="space-y-4">
          {missingSkills.slice(0, 3).map((skill, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-gray-800 dark:text-gray-200">{skill}</p>
                <div className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs">
                  High Demand
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {skill === 'TypeScript' && 'TypeScript is increasingly required for frontend and full-stack roles, with 68% of job postings mentioning it.'}
                {skill === 'Docker' && 'Docker appears in 72% of DevOps and backend developer job descriptions.'}
                {skill === 'AWS' && 'Cloud skills, especially AWS, are mentioned in 81% of senior developer positions.'}
                {skill === 'CI/CD' && 'Continuous Integration/Deployment knowledge is required for 64% of developer roles.'}
                {skill === 'GraphQL' && 'GraphQL is becoming a standard requirement for modern API development positions.'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsGapAnalysis;