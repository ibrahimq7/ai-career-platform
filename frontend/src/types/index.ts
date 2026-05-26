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
  address?: string;
  inferred_role?: string;
  education: string;
  experience: string;
  skills: string[];
  projects: Array<{
    name: string;
    description?: string;
    date?: string | null;
    link?: string | null;
    technologies?: string[];
  }>;
  resume_text: string;
};

export type AtsCategory = {
  name: string;
  score: number;
  weight: number;
  matches: string[];
};

export type LearningRecommendation = {
  skill: string;
  title: string;
  platform: string;
  url: string;
};

export type ResumeAnalysisResponse = {
  target_role: string;
  ats_score: number;
  score_breakdown: AtsCategory[];
  missing_skills: string[];
  suggestions: string[];
  course_recommendations: LearningRecommendation[];
  ai_enhancement: AiEnhancement;
  parsed_resume: ResumeData;
};

export type AiEnhancement = {
  enabled: boolean;
  reason?: string;
  summary: string;
  ats_explanation: string;
  job_eligibility: string;
  eligibility_score: number;
  eligibility_reason: string;
  priority_actions: string[];
  dream_job_fit: string;
  skill_gap_analysis: string[];
  career_roadmap: string[];
  achievement_feedback: string[];
  project_recommendations: string[];
  interview_questions: string[];
  model: string | null;
};

// User type
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};
