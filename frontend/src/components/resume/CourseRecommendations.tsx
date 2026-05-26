import { BookOpen, ExternalLink, PlayCircle } from 'lucide-react';
import { LearningRecommendation } from '../../types';

type CourseRecommendationsProps = {
  missingSkills: string[];
  recommendations: LearningRecommendation[];
};

const CourseRecommendations = ({ missingSkills, recommendations }: CourseRecommendationsProps) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200">Learning Feed</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Recommended Learning Resources</h2>
        </div>
        <BookOpen className="text-emerald-200" size={30} />
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <BookOpen size={20} className="mr-2 text-cyan-200" />
          Courses to Build Missing Skills
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.slice(0, 6).map((course) => (
            <div key={`${course.skill}-${course.title}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-950/55 shadow-2xl transition hover:-translate-y-1 hover:border-cyan-300/30">
              <div className="relative h-32 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.35),transparent_32%),radial-gradient(circle_at_70%_50%,rgba(217,70,239,0.3),transparent_35%),linear-gradient(135deg,rgba(15,23,42,1),rgba(2,6,23,1))]">
                <div className="absolute inset-0 grid place-items-center">
                  <PlayCircle className="text-white/80 transition group-hover:scale-110" size={42} />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-cyan-300/10 text-cyan-100 rounded-full text-xs">
                    {course.skill}
                  </span>
                  <span className="text-xs text-slate-500">
                    MVP
                  </span>
                </div>
                <h4 className="text-md font-semibold text-white mb-1">
                  {course.title}
                </h4>
                <p className="text-sm text-slate-500 mb-2">
                  {course.platform}
                </p>
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                  Build enough practical depth to add credible projects and interview-ready examples.
                </p>
                <a 
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-cyan-200 font-medium text-sm flex items-center hover:text-white"
                >
                  Open Resource <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Roadmap Focus
        </h3>
        
        <div className="grid gap-3 md:grid-cols-2">
          {missingSkills.slice(0, 4).map((skill, index) => (
            <div key={skill} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-sm font-semibold text-white">Phase {index + 1}: {skill}</p>
              <p className="mt-1 text-sm text-slate-400">Learn fundamentals, ship one small project, then add a measurable resume bullet.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseRecommendations;
