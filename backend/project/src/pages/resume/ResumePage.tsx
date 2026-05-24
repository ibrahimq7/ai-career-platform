import { useState } from 'react';
import ResumeUploader from '../../components/resume/ResumeUploader';
import ResumeAnalyzer from '../../components/resume/ResumeAnalyzer';
import SkillsGapAnalysis from '../../components/resume/SkillsGapAnalysis';
import CourseRecommendations from '../../components/resume/CourseRecommendations';

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

const ResumePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeComplete, setAnalyzeComplete] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  
  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setAnalyzeComplete(false);
  };
  
  const handleAnalyzeResume = () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call to analyze resume
    setTimeout(() => {
      // Mock resume data
      const mockResumeData: ResumeData = {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '(123) 456-7890',
        education: [
          {
            institution: 'Stanford University',
            degree: 'Master of Computer Science',
            date: '2018 - 2020'
          },
          {
            institution: 'University of California, Berkeley',
            degree: 'Bachelor of Science in Computer Science',
            date: '2014 - 2018'
          }
        ],
        experience: [
          {
            company: 'Tech Innovations Inc.',
            role: 'Software Engineer',
            duration: 'Jan 2020 - Present',
            description: [
              'Developed and maintained RESTful APIs using Node.js and Express',
              'Implemented frontend features using React and Redux',
              'Collaborated with cross-functional teams to deliver products on schedule'
            ]
          },
          {
            company: 'Digital Solutions LLC',
            role: 'Frontend Developer Intern',
            duration: 'May 2019 - Aug 2019',
            description: [
              'Created responsive UI components with React',
              'Participated in code reviews and testing',
              'Optimized website performance and load times'
            ]
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
        projects: [
          {
            name: 'E-commerce Platform',
            description: 'Built a fully functional e-commerce platform with React, Node.js, and MongoDB'
          },
          {
            name: 'Weather Forecasting App',
            description: 'Developed a weather forecasting application using OpenWeatherMap API and React Native'
          }
        ]
      };
      
      // Mock missing skills
      const mockMissingSkills = ['TypeScript', 'Docker', 'AWS', 'CI/CD', 'GraphQL'];
      
      // Mock ATS score (0-100)
      const mockScore = 72;
      
      setResumeData(mockResumeData);
      setMissingSkills(mockMissingSkills);
      setAtsScore(mockScore);
      setIsAnalyzing(false);
      setAnalyzeComplete(true);
    }, 3000);
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Resume Analyzer
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Upload your resume to get an ATS score, personalized feedback, and recommendations to improve your job application.
        </p>
        
        <ResumeUploader 
          onFileUpload={handleFileUpload} 
          onAnalyze={handleAnalyzeResume}
          file={file}
          isAnalyzing={isAnalyzing}
        />
      </div>
      
      {analyzeComplete && resumeData && (
        <div className="space-y-6">
          <ResumeAnalyzer 
            resumeData={resumeData}
            atsScore={atsScore}
          />
          
          <SkillsGapAnalysis 
            currentSkills={resumeData.skills}
            missingSkills={missingSkills}
          />
          
          <CourseRecommendations 
            missingSkills={missingSkills}
          />
        </div>
      )}
    </div>
  );
};

export default ResumePage;