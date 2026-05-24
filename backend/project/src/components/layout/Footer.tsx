import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">Career</span>
              <span className="text-lg font-bold text-teal-600 dark:text-teal-400">Boost</span>
            </Link>
            <span className="ml-4 text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} CareerBoost. All rights reserved.
            </span>
          </div>
          <div className="flex space-x-8">
            <Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              About
            </Link>
            <Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Terms
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Github
            </a>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="text-gray-500 dark:text-gray-400">Made with</span>
            <Heart size={16} className="mx-1 text-red-500" fill="currentColor" />
            <span className="text-gray-500 dark:text-gray-400">by the CareerBoost Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;