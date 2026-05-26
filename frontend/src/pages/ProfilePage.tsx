import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Activity, BarChart3, BrainCircuit, Calendar, CheckCircle2, Code, FileText, Flame, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const metrics = [
  { label: 'ATS Score', value: '82', suffix: '/100', icon: <FileText size={22} />, tone: 'cyan', trend: '+10 this month' },
  { label: 'Roadmap Progress', value: '46', suffix: '%', icon: <Target size={22} />, tone: 'emerald', trend: '+14% this week' },
  { label: 'Interview Readiness', value: '68', suffix: '%', icon: <BrainCircuit size={22} />, tone: 'fuchsia', trend: '+8 practice rounds' },
  { label: 'Coding Momentum', value: '19', suffix: ' solved', icon: <Code size={22} />, tone: 'amber', trend: '4-day streak' },
];

const pipeline = [
  { stage: 'Resume Intelligence', score: 82, status: 'Strong' },
  { stage: 'Skill Roadmap', score: 46, status: 'In Progress' },
  { stage: 'Interview Prep', score: 68, status: 'Training' },
  { stage: 'Coding Screen', score: 58, status: 'Practice' },
];

const activity = [
  'Analyzed full-stack resume and identified Docker, AWS, and PostgreSQL gaps.',
  'Created ATS-safe resume draft with measurable project bullets.',
  'Completed technical interview simulation for FastAPI architecture.',
  'Queued TypeScript and Docker resources in Learning Hub.',
];

const heatmap = [0, 1, 2, 3, 1, 0, 4, 3, 2, 2, 1, 0, 3, 4, 2, 1, 1, 3, 4, 0, 2, 3, 1, 2, 4, 4, 3, 1, 0, 2, 3, 2, 1, 4, 3, 2, 1, 0, 2, 4, 3, 3, 1, 2, 4, 0, 1, 2, 3, 4, 2, 1, 3, 2, 0, 2, 4, 3, 1, 2, 3, 4, 4, 2, 1, 0, 3, 2, 4, 1];

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="relative mx-auto max-w-7xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_10%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(168,85,247,0.18),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.12),transparent_30%)]" />

      <section className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-2xl backdrop-blur-2xl">
        <div className="h-32 bg-[radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.35),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.30),transparent_28%),linear-gradient(135deg,rgba(2,6,23,1),rgba(15,23,42,1))]" />
        <div className="px-6 pb-6 md:px-8">
          <div className="-mt-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="grid h-24 w-24 place-items-center rounded-3xl border border-cyan-300/30 bg-slate-950 text-3xl font-black text-cyan-100 shadow-neon-cyan">
                {(user?.name || 'Career Pilot').slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">Career Command Center</p>
                <h1 className="mt-2 text-3xl font-black text-white">{user?.name || 'Career Pilot'}</h1>
                <p className="mt-1 text-sm text-slate-400">{user?.email || 'demo@career.ai'} | Full Stack Developer Track</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/resume" className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-neon-cyan transition hover:bg-white">
                Analyze Resume
              </Link>
              <Link to="/learning" className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                Continue Learning
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.article
            key={metric.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <span className={`rounded-2xl p-3 ${tone(metric.tone)}`}>{metric.icon}</span>
              <TrendingUp size={18} className="text-emerald-300" />
            </div>
            <p className="mt-5 text-sm text-slate-500">{metric.label}</p>
            <p className="mt-1 text-4xl font-black text-white">
              {metric.value}<span className="text-base font-semibold text-slate-400">{metric.suffix}</span>
            </p>
            <p className="mt-2 text-xs text-emerald-300">{metric.trend}</p>
          </motion.article>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <main className="space-y-6">
          <Panel title="Career Pipeline" icon={<BarChart3 size={20} className="text-cyan-200" />}>
            <div className="space-y-4">
              {pipeline.map((item) => (
                <div key={item.stage} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{item.stage}</p>
                      <p className="text-xs text-slate-500">{item.status}</p>
                    </div>
                    <p className="text-lg font-black text-cyan-100">{item.score}%</p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-emerald-300" style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Activity Heatmap" icon={<Calendar size={20} className="text-emerald-200" />}>
            <div className="grid grid-cols-10 gap-2 sm:grid-cols-14">
              {heatmap.map((value, index) => (
                <div key={`${value}-${index}`} className={`h-7 rounded-lg ${heat(value)}`} title={`${value} activities`} />
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500">Your last 70 actions across resume, learning, coding, and interview workflows.</p>
          </Panel>
        </main>

        <aside className="space-y-6">
          <Panel title="Next Best Actions" icon={<Flame size={20} className="text-amber-200" />}>
            <div className="space-y-3">
              {[
                'Add quantified impact to two project bullets.',
                'Complete Docker Get Started and deploy one backend service.',
                'Practice one technical interview answer under 120 seconds.',
                'Solve two medium array/hash-table problems.',
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-emerald-300" />
                  <p className="text-sm leading-6 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Recent Intelligence" icon={<Activity size={20} className="text-fuchsia-200" />}>
            <div className="space-y-3">
              {activity.map((item) => (
                <p key={item} className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 p-4 text-sm leading-6 text-fuchsia-50/85">
                  {item}
                </p>
              ))}
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

function tone(name: string) {
  const tones: Record<string, string> = {
    cyan: 'border border-cyan-300/20 bg-cyan-300/10 text-cyan-100',
    emerald: 'border border-emerald-300/20 bg-emerald-300/10 text-emerald-100',
    fuchsia: 'border border-fuchsia-300/20 bg-fuchsia-300/10 text-fuchsia-100',
    amber: 'border border-amber-300/20 bg-amber-300/10 text-amber-100',
  };
  return tones[name] ?? tones.cyan;
}

function heat(value: number) {
  if (value === 0) return 'bg-white/[0.04]';
  if (value === 1) return 'bg-cyan-300/15';
  if (value === 2) return 'bg-cyan-300/30';
  if (value === 3) return 'bg-fuchsia-300/35';
  return 'bg-emerald-300/60 shadow-[0_0_16px_rgba(16,185,129,0.3)]';
}

export default ProfilePage;
