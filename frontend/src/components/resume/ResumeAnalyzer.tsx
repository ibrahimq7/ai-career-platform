import type { ReactNode } from 'react';
import { Activity, Briefcase, FileText, ShieldCheck, UserRound } from 'lucide-react';
import { AtsCategory, ResumeData } from '../../types';

type ResumeAnalyzerProps = {
  resumeData: ResumeData;
  atsScore: number;
  scoreBreakdown: AtsCategory[];
};

const ResumeAnalyzer = ({ resumeData, atsScore, scoreBreakdown }: ResumeAnalyzerProps) => {
  const scoreColor = atsScore >= 80 ? '#22c55e' : atsScore >= 60 ? '#facc15' : '#fb7185';
  const projectCount = resumeData.projects.length;
  const experienceLines = resumeData.experience.split('\n').filter(Boolean).length;
  const visibleSkills = resumeData.skills.slice(0, 36);
  const extraSkillCount = Math.max(resumeData.skills.length - visibleSkills.length, 0);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur-2xl md:p-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Recruiter Grade Report</p>
          <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">Resume Intelligence Results</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-100">
          <ShieldCheck size={17} />
          ATS-ready analysis
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-3xl border border-white/10 bg-slate-950/65 p-6">
          <div
            className="mx-auto grid h-56 w-56 place-items-center rounded-full"
            style={{
              background: `conic-gradient(${scoreColor} ${atsScore * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
              boxShadow: `0 0 55px ${scoreColor}42`,
            }}
          >
            <div className="grid h-44 w-44 place-items-center rounded-full bg-slate-950 text-center">
              <div>
                <p className="text-6xl font-black text-white">{atsScore}</p>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">ATS Score</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <Metric value={resumeData.skills.length} label="Skills" />
            <Metric value={projectCount} label="Projects" />
            <Metric value={experienceLines} label="Signals" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {scoreBreakdown.map((item) => (
            <div key={item.name} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-white">{item.name}</p>
                <span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-xs font-black text-cyan-100">{item.score}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-emerald-300" style={{ width: `${item.score}%` }} />
              </div>
              {item.matches.length > 0 && (
                <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-400">Matched: {item.matches.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/45 p-6 md:p-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-2xl font-black text-white">
            <Activity size={20} className="text-emerald-200" />
            Parsed Resume Details
          </h3>
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
            Structured extraction
          </span>
        </div>

        <div className="grid gap-4 text-base md:grid-cols-4">
          <Info label="Name" value={resumeData.name} />
          <Info label="Email" value={resumeData.email} />
          <Info label="Phone" value={resumeData.phone} />
          <Info label="Resume Profile" value={resumeData.inferred_role || 'Not detected'} icon={<Briefcase size={15} />} />
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-base font-black text-white">
              <UserRound size={18} className="text-cyan-200" />
              Detected Skills
            </p>
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
              {resumeData.skills.length} total
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {visibleSkills.map((skill) => (
              <span key={skill} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100">
                {skill}
              </span>
            ))}
            {extraSkillCount > 0 && (
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-300">
                +{extraSkillCount} more
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <TextBlock title="Education" value={resumeData.education} />
          <TextBlock title="Experience" value={resumeData.experience} />
        </div>

        <div className="mt-6">
          <p className="mb-3 flex items-center gap-2 text-base font-black text-white">
            <FileText size={18} className="text-fuchsia-200" />
            Projects
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {resumeData.projects.length ? resumeData.projects.map((project) => (
              <div key={project.name} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                <p className="text-lg font-black text-white">{project.name}</p>
                <p className="mt-2 text-base leading-7 text-slate-400">{project.description || 'No description detected.'}</p>
                {'technologies' in project && Array.isArray(project.technologies) && project.technologies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-2.5 py-1 text-xs font-semibold text-fuchsia-100">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-semibold text-cyan-200 hover:text-white">
                    Open project link
                  </a>
                )}
              </div>
            )) : <p className="text-sm text-slate-500">No projects detected.</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

const Metric = ({ value, label }: { value: number; label: string }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
    <p className="text-2xl font-black text-white">{value}</p>
    <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
  </div>
);

const Info = ({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
      {icon}
      {label}
    </p>
    <p className="mt-2 break-words text-base font-bold text-slate-200">{value || 'Not detected'}</p>
  </div>
);

const TextBlock = ({ title, value }: { title: string; value: string }) => (
  <div>
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
    <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/50 p-5 font-sans text-base leading-7 text-slate-300">
      {value || 'Not detected'}
    </pre>
  </div>
);

export default ResumeAnalyzer;
