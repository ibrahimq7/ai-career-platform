import { BookOpen, ExternalLink } from 'lucide-react';

type CourseRecommendationsProps = {
  missingSkills: string[];
};

const CourseRecommendations = ({ missingSkills }: CourseRecommendationsProps) => {
  // Generate course recommendations based on missing skills
  const getCourseRecommendations = () => {
    const recommendations: Array<{
      title: string;
      platform: string;
      link: string;
      description: string;
      duration: string;
      skill: string;
      image: string;
    }> = [];
    
    missingSkills.forEach(skill => {
      switch(skill) {
        case 'TypeScript':
          recommendations.push({
            title: 'TypeScript for JavaScript Developers',
            platform: 'Coursera',
            link: 'https://www.coursera.org',
            description: 'Learn how to leverage TypeScript to build robust applications with static typing.',
            duration: '4 weeks',
            skill: 'TypeScript',
            image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          });
          break;
        case 'Docker':
          recommendations.push({
            title: 'Docker for Developers',
            platform: 'Udemy',
            link: 'https://www.udemy.com',
            description: 'Master Docker containers and improve your development workflow.',
            duration: '6 weeks',
            skill: 'Docker',
            image: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          });
          break;
        case 'AWS':
          recommendations.push({
            title: 'AWS Certified Developer',
            platform: 'AWS Training',
            link: 'https://aws.amazon.com/training',
            description: 'Learn core AWS services, best practices, and develop skills needed for AWS certification.',
            duration: '8 weeks',
            skill: 'AWS',
            image: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          });
          break;
        case 'CI/CD':
          recommendations.push({
            title: 'CI/CD Pipelines with GitHub Actions',
            platform: 'LinkedIn Learning',
            link: 'https://www.linkedin.com/learning',
            description: 'Build and deploy automated CI/CD pipelines using GitHub Actions.',
            duration: '3 weeks',
            skill: 'CI/CD',
            image: 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          });
          break;
        case 'GraphQL':
          recommendations.push({
            title: 'GraphQL API Development',
            platform: 'FreeCodeCamp',
            link: 'https://www.freecodecamp.org',
            description: 'Learn to build efficient APIs with GraphQL and integrate with frontend frameworks.',
            duration: '5 weeks',
            skill: 'GraphQL',
            image: 'https://images.pexels.com/photos/7988086/pexels-photo-7988086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          });
          break;
        default:
          recommendations.push({
            title: `${skill} Fundamentals`,
            platform: 'Coursera',
            link: 'https://www.coursera.org',
            description: `Learn the fundamentals of ${skill} and how to apply it in real-world projects.`,
            duration: '4 weeks',
            skill,
            image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          });
      }
    });
    
    return recommendations;
  };
  
  // Generate video recommendations
  const getVideoRecommendations = () => {
    const recommendations: Array<{
      title: string;
      channel: string;
      link: string;
      duration: string;
      skill: string;
    }> = [];
    
    missingSkills.forEach(skill => {
      switch(skill) {
        case 'TypeScript':
          recommendations.push({
            title: 'TypeScript Crash Course',
            channel: 'Academind',
            link: 'https://www.youtube.com',
            duration: '1h 32m',
            skill: 'TypeScript'
          });
          break;
        case 'Docker':
          recommendations.push({
            title: 'Docker for Beginners',
            channel: 'TechWorld with Nana',
            link: 'https://www.youtube.com',
            duration: '2h 15m',
            skill: 'Docker'
          });
          break;
        case 'AWS':
          recommendations.push({
            title: 'AWS Services in 10 Minutes',
            channel: 'freeCodeCamp',
            link: 'https://www.youtube.com',
            duration: '10m',
            skill: 'AWS'
          });
          break;
        case 'CI/CD':
          recommendations.push({
            title: 'CI/CD Explained',
            channel: 'IBM Technology',
            link: 'https://www.youtube.com',
            duration: '45m',
            skill: 'CI/CD'
          });
          break;
        case 'GraphQL':
          recommendations.push({
            title: 'GraphQL Tutorial for Beginners',
            channel: 'The Net Ninja',
            link: 'https://www.youtube.com',
            duration: '1h 05m',
            skill: 'GraphQL'
          });
          break;
        default:
          recommendations.push({
            title: `Learn ${skill} in 30 Minutes`,
            channel: 'Programming with Mosh',
            link: 'https://www.youtube.com',
            duration: '30m',
            skill
          });
      }
    });
    
    return recommendations;
  };
  
  const courseRecommendations = getCourseRecommendations();
  const videoRecommendations = getVideoRecommendations();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Recommended Learning Resources
      </h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <BookOpen size={20} className="mr-2 text-blue-500" />
          Courses to Build Missing Skills
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseRecommendations.slice(0, 3).map((course, index) => (
            <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs">
                    {course.skill}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {course.duration}
                  </span>
                </div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-1">
                  {course.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {course.platform}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {course.description}
                </p>
                <a 
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center hover:text-blue-700 dark:hover:text-blue-300"
                >
                  View Course <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Learning Videos
        </h3>
        
        <div className="space-y-4">
          {videoRecommendations.slice(0, 4).map((video, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs">
                    {video.skill}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {video.duration}
                  </span>
                </div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white">
                  {video.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {video.channel}
                </p>
              </div>
              <a 
                href={video.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
              >
                Watch
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseRecommendations;