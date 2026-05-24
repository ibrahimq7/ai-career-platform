import { CircleDashed } from 'lucide-react';

type ResumeData = {
  name: string;
  email: string;
  phone: string;
  education: Array<{
    institution: string;
    degree: string;
    date: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string[];
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
  }>;
};

type ResumeAnalyzerProps = {
  resumeData: ResumeData;
  atsScore: number;
};

const ResumeAnalyzer = ({ resumeData, atsScore }: ResumeAnalyzerProps) => {
  // Generate improvement tips based on ATS score
  const getImprovementTips = () => {
    if (atsScore >= 90) {
      return [
        'Your resume is excellent and well-optimized for ATS systems.',
        'Consider tailoring it slightly for specific job applications.',
        'Add more measurable achievements to stand out even more.'
      ];
    } else if (atsScore >= 70) {
      return [
        'Use more keywords from the job description.',
        'Quantify your achievements with specific metrics and numbers.',
        'Ensure your resume has a clean, consistent format.',
        'Add more relevant skills to your skills section.'
      ];
    } else {
      return [
        'Restructure your resume to follow a standard format.',
        'Add more industry-specific keywords throughout your resume.',
        'Quantify your achievements with specific metrics.',
        'Remove graphics, tables, and unusual formatting.',
        'Use bullet points instead of paragraphs for better readability.',
        'Include a professional summary at the top of your resume.'
      ];
    }
  };
  
  const improvementTips = getImprovementTips();
  
  // Determine score color based on ATS score
  const getScoreColor = () => {
    if (atsScore >= 90) return 'text-green-600 dark:text-green-400';
    if (atsScore >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  // Determine background color based on ATS score
  const getScoreBackgroundColor = () => {
    if (atsScore >= 90) return 'bg-green-100 dark:bg-green-900/30';
    if (atsScore >= 70) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Resume Analysis Results
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2">
            ATS Score
          </h3>
          <div className="flex items-center space-x-3">
            <div className={`text-3xl font-bold ${getScoreColor()}`}>
              {atsScore}
            </div>
            <div className="flex items-center space-x-1">
              <div 
                className={`h-2.5 rounded-full ${
                  atsScore >= 20 ? getScoreBackgroundColor() : 'bg-gray-200 dark:bg-gray-600'
                }`} 
                style={{ width: '20px' }}
              />
              <div 
                className={`h-2.5 rounded-full ${
                  atsScore >= 40 ? getScoreBackgroundColor() : 'bg-gray-200 dark:bg-gray-600'
                }`} 
                style={{ width: '20px' }}
              />
              <div 
                className={`h-2.5 rounded-full ${
                  atsScore >= 60 ? getScoreBackgroundColor() : 'bg-gray-200 dark:bg-gray-600'
                }`} 
                style={{ width: '20px' }}
              />
              <div 
                className={`h-2.5 rounded-full ${
                  atsScore >= 80 ? getScoreBackgroundColor() : 'bg-gray-200 dark:bg-gray-600'
                }`} 
                style={{ width: '20px' }}
              />
              <div 
                className={`h-2.5 rounded-full ${
                  atsScore >= 100 ? getScoreBackgroundColor() : 'bg-gray-200 dark:bg-gray-600'
                }`} 
                style={{ width: '20px' }}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Skills Detected
          </h3>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {resumeData.skills.length}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Experience
          </h3>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {resumeData.experience.length} roles
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Improvement Suggestions
        </h3>
        <ul className="space-y-2">
          {improvementTips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <CircleDashed size={16} className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Parsed Resume Data
        </h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
              Contact Information
            </h4>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 mb-1">
                <span className="font-semibold">Name:</span> {resumeData.name}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-1">
                <span className="font-semibold">Email:</span> {resumeData.email}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Phone:</span> {resumeData.phone}
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
              Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
              Education
            </h4>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-white font-medium">{edu.institution}</p>
                  <p className="text-gray-700 dark:text-gray-300">{edu.degree}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{edu.date}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
              Experience
            </h4>
            <div className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between mb-1">
                    <p className="text-gray-900 dark:text-white font-medium">{exp.company}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{exp.duration}</p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{exp.role}</p>
                  <ul className="space-y-1 list-disc pl-5">
                    {exp.description.map((desc, i) => (
                      <li key={i} className="text-gray-600 dark:text-gray-400 text-sm">
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
              Projects
            </h4>
            <div className="space-y-4">
              {resumeData.projects.map((project, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-white font-medium mb-1">{project.name}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          type="button"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Download Detailed Report
        </button>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;