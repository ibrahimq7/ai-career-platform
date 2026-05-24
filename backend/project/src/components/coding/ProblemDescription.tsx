import { Lightbulb } from 'lucide-react';
import { Problem } from '../../types';

type ProblemDescriptionProps = {
  problem: Problem;
};

const ProblemDescription = ({ problem }: ProblemDescriptionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Description
        </h2>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {problem.description}
        </p>
      </div>
      
      {problem.examples && problem.examples.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            Examples
          </h3>
          <div className="space-y-4">
            {problem.examples.map((example, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                  Example {index + 1}:
                </p>
                <div className="mb-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Input:</span> {example.input}
                  </p>
                </div>
                <div className="mb-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Output:</span> {example.output}
                  </p>
                </div>
                {example.explanation && (
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Explanation:</span> {example.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {problem.constraints && problem.constraints.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            Constraints
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {problem.constraints.map((constraint, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">
                {constraint}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {problem.hints && problem.hints.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md p-4">
          <div className="flex items-start">
            <Lightbulb size={20} className="text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                Hints
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {problem.hints.map((hint, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
          Related Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {problem.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;