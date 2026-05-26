import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Clock, ExternalLink, Flame, PlayCircle, Search, Sparkles, Target } from 'lucide-react';

type Resource = {
  id: string;
  title: string;
  skill: string;
  platform: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  type: 'Course' | 'Docs' | 'Video' | 'Roadmap';
  url: string;
  progress: number;
  accent: 'cyan' | 'fuchsia' | 'emerald' | 'amber';
};

const resources: Resource[] = [
  {
    id: 'typescript-handbook',
    title: 'TypeScript Handbook',
    skill: 'TypeScript',
    platform: 'Documentation',
    level: 'Intermediate',
    duration: '6h',
    type: 'Docs',
    url: 'https://www.typescriptlang.org/docs/',
    progress: 48,
    accent: 'cyan',
  },
  {
    id: 'docker-get-started',
    title: 'Docker Get Started',
    skill: 'Docker',
    platform: 'Docker Docs',
    level: 'Beginner',
    duration: '5h',
    type: 'Docs',
    url: 'https://docs.docker.com/get-started/',
    progress: 22,
    accent: 'fuchsia',
  },
  {
    id: 'aws-builder',
    title: 'AWS Developer Essentials',
    skill: 'AWS',
    platform: 'AWS Skill Builder',
    level: 'Intermediate',
    duration: '9h',
    type: 'Course',
    url: 'https://skillbuilder.aws/',
    progress: 12,
    accent: 'amber',
  },
  {
    id: 'fastapi-tutorial',
    title: 'FastAPI Production Tutorial',
    skill: 'FastAPI',
    platform: 'FastAPI',
    level: 'Intermediate',
    duration: '4h',
    type: 'Docs',
    url: 'https://fastapi.tiangolo.com/tutorial/',
    progress: 66,
    accent: 'emerald',
  },
  {
    id: 'postgres-roadmap',
    title: 'PostgreSQL for App Developers',
    skill: 'PostgreSQL',
    platform: 'PostgreSQL Docs',
    level: 'Intermediate',
    duration: '7h',
    type: 'Roadmap',
    url: 'https://www.postgresql.org/docs/current/tutorial.html',
    progress: 31,
    accent: 'cyan',
  },
  {
    id: 'system-design',
    title: 'System Design Interview Basics',
    skill: 'System Design',
    platform: 'Curated Video',
    level: 'Advanced',
    duration: '10h',
    type: 'Video',
    url: 'https://www.youtube.com/results?search_query=system+design+interview+basics',
    progress: 8,
    accent: 'fuchsia',
  },
];

const weeklyPlan = [
  { day: 'Mon', task: 'TypeScript generics + resume bullet rewrite', done: true },
  { day: 'Tue', task: 'Dockerize FastAPI resume backend', done: true },
  { day: 'Wed', task: 'PostgreSQL schema and RLS practice', done: false },
  { day: 'Thu', task: 'AWS storage and auth architecture notes', done: false },
  { day: 'Fri', task: 'Mock interview: project deep dive', done: false },
];

const LearningPage = () => {
  const [query, setQuery] = useState('');
  const [activeSkill, setActiveSkill] = useState('All');
  const skills = ['All', ...Array.from(new Set(resources.map((resource) => resource.skill)))];

  const filtered = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSkill = activeSkill === 'All' || resource.skill === activeSkill;
      const matchesQuery = `${resource.title} ${resource.skill} ${resource.platform}`.toLowerCase().includes(query.toLowerCase());
      return matchesSkill && matchesQuery;
    });
  }, [activeSkill, query]);

  const averageProgress = Math.round(resources.reduce((sum, item) => sum + item.progress, 0) / resources.length);

  return (
    <div className="relative mx-auto max-w-7xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_15%,rgba(34,211,238,0.18),transparent_27%),radial-gradient(circle_at_85%_20%,rgba(236,72,153,0.16),transparent_25%),radial-gradient(circle_at_55%_95%,rgba(16,185,129,0.13),transparent_30%)]" />

      <section className="mb-6 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-2xl md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
              <BookOpen size={14} />
              Learning Recommendation Hub
            </div>
            <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
              Turn skill gaps into a focused weekly execution plan.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
              Track high-impact resources, follow a role-based roadmap, and connect learning directly to resume bullets and interview proof.
            </p>
          </div>
          <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-100/80">Roadmap Progress</p>
                <p className="mt-1 text-4xl font-black text-white">{averageProgress}%</p>
              </div>
              <Target className="text-emerald-200" size={38} />
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-emerald-300" style={{ width: `${averageProgress}%` }} />
            </div>
          </div>
        </div>
      </section>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="builder-input pl-12"
            placeholder="Search resources, skills, platforms..."
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {skills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => setActiveSkill(skill)}
              className={`whitespace-nowrap rounded-full border px-4 py-3 text-sm font-semibold transition ${
                activeSkill === skill ? 'border-cyan-300/50 bg-cyan-300/10 text-cyan-100' : 'border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/10'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <main className="space-y-6">
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((resource, index) => (
              <motion.article
                key={resource.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur-2xl transition hover:-translate-y-1 hover:border-cyan-300/30"
              >
                <div className={`relative h-36 ${resourceGradient(resource.accent)}`}>
                  <div className="absolute inset-0 grid place-items-center">
                    <PlayCircle className="text-white/85 transition group-hover:scale-110" size={46} />
                  </div>
                  <span className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    {resource.type}
                  </span>
                </div>
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">{resource.skill}</span>
                    <span className="text-xs text-slate-500">{resource.duration}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{resource.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{resource.platform} | {resource.level}</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-300" style={{ width: `${resource.progress}%` }} />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-slate-400">{resource.progress}% complete</span>
                    <a href={resource.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-200 hover:text-white">
                      Open <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </section>
        </main>

        <aside className="space-y-5">
          <Panel title="This Week's Sprint" icon={<Flame size={18} className="text-amber-200" />}>
            <div className="space-y-3">
              {weeklyPlan.map((item) => (
                <div key={item.day} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-start gap-3">
                    <span className={`grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl text-xs font-bold ${item.done ? 'bg-emerald-300/20 text-emerald-100' : 'bg-white/10 text-slate-400'}`}>
                      {item.day}
                    </span>
                    <div>
                      <p className="text-sm leading-6 text-slate-300">{item.task}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        {item.done ? <CheckCircle2 size={13} className="text-emerald-300" /> : <Clock size={13} />}
                        {item.done ? 'Completed' : 'Queued'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Resume Proof Targets" icon={<Sparkles size={18} className="text-fuchsia-200" />}>
            <div className="space-y-3 text-sm text-slate-300">
              <ProofItem text="Ship one Dockerized FastAPI project and add deployment notes." />
              <ProofItem text="Write one quantified bullet for API performance or reliability." />
              <ProofItem text="Add a PostgreSQL/RLS security note to your AI Career Platform project." />
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
};

const Panel = ({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) => (
  <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-2xl">
    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
      {icon}
      {title}
    </h2>
    {children}
  </section>
);

const ProofItem = ({ text }: { text: string }) => (
  <div className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 p-4 leading-6 text-fuchsia-50/85">{text}</div>
);

function resourceGradient(accent: Resource['accent']) {
  const gradients = {
    cyan: 'bg-[radial-gradient(circle_at_25%_20%,rgba(34,211,238,0.42),transparent_35%),linear-gradient(135deg,rgba(15,23,42,1),rgba(2,6,23,1))]',
    fuchsia: 'bg-[radial-gradient(circle_at_25%_20%,rgba(236,72,153,0.42),transparent_35%),linear-gradient(135deg,rgba(15,23,42,1),rgba(2,6,23,1))]',
    emerald: 'bg-[radial-gradient(circle_at_25%_20%,rgba(16,185,129,0.42),transparent_35%),linear-gradient(135deg,rgba(15,23,42,1),rgba(2,6,23,1))]',
    amber: 'bg-[radial-gradient(circle_at_25%_20%,rgba(251,191,36,0.42),transparent_35%),linear-gradient(135deg,rgba(15,23,42,1),rgba(2,6,23,1))]',
  };
  return gradients[accent];
}

export default LearningPage;
