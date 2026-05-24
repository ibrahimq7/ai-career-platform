// Define types for the application

// Problem type for coding problems
export type Problem = {
  id: string;
  title: string;
  difficulty: string;
  tags: string[];
  acceptance: number;
  description: string;
  completedByUser: boolean;
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints?: string[];
  testCases?: Array<{
    input: string;
    expectedOutput: string;
  }>;
  hints?: string[];
};

// Resume data type
export type ResumeData = {
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

// User type
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};