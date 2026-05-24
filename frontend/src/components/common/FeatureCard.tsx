import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
};

const FeatureCard = ({ icon, title, description, link }: FeatureCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <Link 
        to={link}
        className="text-blue-600 dark:text-blue-400 font-medium flex items-center hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        Get Started <ArrowRight size={16} className="ml-1" />
      </Link>
    </div>
  );
};

export default FeatureCard;