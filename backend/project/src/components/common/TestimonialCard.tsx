import { Quote } from 'lucide-react';

type TestimonialCardProps = {
  name: string;
  role: string;
  image: string;
  content: string;
};

const TestimonialCard = ({ name, role, image, content }: TestimonialCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="mb-4 text-gray-400 dark:text-gray-500">
        <Quote size={24} />
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-6 italic">{content}</p>
      <div className="flex items-center">
        <img 
          src={image} 
          alt={name} 
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="ml-3">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;