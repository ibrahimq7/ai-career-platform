import { AlertTriangle, Cpu, Zap } from 'lucide-react';

type SkillsGapAnalysisProps = {
  currentSkills: string[];
  missingSkills: string[];
};

const SkillsGapAnalysis = ({ currentSkills, missingSkills }: SkillsGapAnalysisProps) => {
  const getRelevantJobRoles = () => {
    const roles = [];
    
    if (currentSkills.includes('React') || currentSkills.includes('JavaScript')) {
      roles.push('Frontend Developer');
    }
    
    if (currentSkills.includes('Node.js') || currentSkills.includes('Express')) {
      roles.push('Backend Developer');
    }
    
    if (
      (currentSkills.includes('React') || currentSkills.includes('JavaScript')) &&
      (currentSkills.includes('Node.js') || currentSkills.includes('Express'))
    ) {
      roles.push('Full Stack Developer');
    }
    
    if (currentSkills.includes('Python') || currentSkills.includes('SQL')) {
      roles.push('Data Analyst');
    }
    
    if (roles.length === 0) {
      roles.push('Software Developer');
    }
    
    return roles;
  };
  
  const relevantJobRoles = getRelevantJobRoles();
  
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-200">Skill Graph</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Skills Gap Analysis</h2>
        </div>
        <Cpu className="text-fuchsia-200" size={30} />
      </div>
      
      <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
          Relevant Job Roles
        </h3>
        <div className="flex flex-wrap gap-3">
          {relevantJobRoles.map((role, index) => (
            <div 
              key={index}
              className="flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100"
            >
              <Zap size={16} className="mr-2" />
              {role}
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="w-6 h-6 rounded-full bg-emerald-300/20 text-emerald-200 flex items-center justify-center mr-2 text-xs font-bold">
              {currentSkills.length}
            </span>
            Your Current Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentSkills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-sm text-emerald-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="w-6 h-6 rounded-full bg-amber-300/20 text-amber-200 flex items-center justify-center mr-2 text-xs font-bold">
              {missingSkills.length}
            </span>
            Missing Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-sm text-amber-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 mb-6">
        <div className="flex items-start">
          <AlertTriangle size={20} className="text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-md font-medium text-amber-100 mb-1">
              Skills Gap Summary
            </h4>
            <p className="text-amber-50/75 text-sm">
              Based on our analysis, you're missing several key skills that are frequently requested in job postings for {relevantJobRoles[0]}s. Adding these skills to your resume could increase your chances of getting past ATS systems and securing interviews.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Industry Demand
        </h3>
        <div className="space-y-4">
          {missingSkills.slice(0, 3).map((skill, index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-white">{skill}</p>
                <div className="rounded-full bg-cyan-300/10 px-2 py-1 text-xs text-cyan-100">
                  High Demand
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                {skill === 'TypeScript' && 'TypeScript is increasingly required for frontend and full-stack roles, with 68% of job postings mentioning it.'}
                {skill === 'Docker' && 'Docker appears in 72% of DevOps and backend developer job descriptions.'}
                {skill === 'AWS' && 'Cloud skills, especially AWS, are mentioned in 81% of senior developer positions.'}
                {skill === 'CI/CD' && 'Continuous Integration/Deployment knowledge is required for 64% of developer roles.'}
                {skill === 'GraphQL' && 'GraphQL is becoming a standard requirement for modern API development positions.'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsGapAnalysis;
