import { Link } from 'react-router-dom';
import { FileText, Code, BarChart, Trophy, Book } from 'lucide-react';
import FeatureCard from '../components/common/FeatureCard';
import TestimonialCard from '../components/common/TestimonialCard';

const HomePage = () => {
  const features = [
    {
      icon: <FileText size={24} className="text-blue-500" />,
      title: 'Resume Analyzer',
      description: 'Get professional feedback on your resume with AI-powered analysis and ATS scoring.',
      link: '/resume'
    },
    {
      icon: <Code size={24} className="text-purple-500" />,
      title: 'Coding Practice',
      description: 'Prepare for technical interviews with our curated collection of coding problems.',
      link: '/coding'
    },
    {
      icon: <BarChart size={24} className="text-green-500" />,
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed statistics and performance metrics.',
      link: '/profile'
    },
    {
      icon: <Trophy size={24} className="text-yellow-500" />,
      title: 'Leaderboards',
      description: 'Compete with peers and earn achievements to showcase your skills.',
      link: '/leaderboard'
    }
  ];
  
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer at Google',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      content: 'CareerBoost helped me identify gaps in my resume and improve my coding skills. I landed my dream job within 2 months!'
    },
    {
      name: 'Michael Chen',
      role: 'Front-end Developer',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      content: 'The resume analyzer provided specific, actionable feedback that significantly improved my callback rate from employers.'
    },
    {
      name: 'Jessica Smith',
      role: 'Computer Science Student',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      content: 'The coding practice problems are perfectly categorized by difficulty, helping me gradually build my skills and confidence.'
    }
  ];
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-700 dark:to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Boost Your Career with AI-Powered Tools
              </h1>
              <p className="text-lg md:text-xl mb-6 text-blue-50">
                Optimize your resume and ace technical interviews with our comprehensive platform designed for job seekers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/resume"
                  className="px-6 py-3 font-medium bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-md"
                >
                  Analyze Your Resume
                </Link>
                <Link
                  to="/coding"
                  className="px-6 py-3 font-medium bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-md"
                >
                  Practice Coding
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Career Growth"
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Everything You Need to Land Your Dream Job
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                link={feature.link}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How CareerBoost Works
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center md:space-x-8">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <img
                src="https://images.pexels.com/photos/5673488/pexels-photo-5673488.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Career growth process"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-semibold">1</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Your Resume</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Submit your current resume in PDF or DOCX format for AI-powered analysis.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-500 flex items-center justify-center">
                  <span className="text-white font-semibold">2</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Get Personalized Feedback</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Receive detailed analysis, ATS score, and suggestions to improve your resume.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <span className="text-white font-semibold">3</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Practice Coding Problems</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Solve curated coding challenges that match real interview questions.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white font-semibold">4</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Track Your Progress</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Monitor your improvement over time and identify areas for further growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                image={testimonial.image}
                content={testimonial.content}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Your Career?</h2>
          <p className="text-lg mb-8">Join thousands of job seekers who have successfully landed their dream roles.</p>
          <div className="flex justify-center">
            <Link
              to="/signup"
              className="px-8 py-3 font-medium bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors shadow-md"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;