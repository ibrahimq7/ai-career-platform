import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Download, FileText, LayoutTemplate, Plus, Sparkles, Trash2 } from 'lucide-react';

type Experience = { company: string; role: string; duration: string; bullets: string };
type Project = { name: string; stack: string; impact: string };
type TemplateId = 'google' | 'amazon' | 'vercel' | 'stripe';
type ResumeDraft = {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  links: string;
  summary: string;
  skills: string;
  education: string;
  experience: Experience[];
  projects: Project[];
};

const templates: Array<{
  id: TemplateId;
  name: string;
  note: string;
  accent: 'cyan' | 'emerald' | 'fuchsia' | 'amber';
}> = [
  { id: 'google', name: 'Google Clarity', note: 'Clean impact bullets and strong readability.', accent: 'cyan' },
  { id: 'amazon', name: 'Amazon LP', note: 'Ownership, metrics, scope, and action verbs.', accent: 'amber' },
  { id: 'vercel', name: 'Vercel Minimal', note: 'Sharp frontend/product engineering presentation.', accent: 'emerald' },
  { id: 'stripe', name: 'Stripe Systems', note: 'Systems thinking, reliability, and precision.', accent: 'fuchsia' },
];

const initialDraft: ResumeDraft = {
  name: 'Aarav Sharma',
  headline: 'Full Stack Developer | React, FastAPI, PostgreSQL',
  email: 'aarav@example.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  links: 'linkedin.com/in/aarav | github.com/aarav',
  summary: 'Full stack developer building scalable web apps, clean APIs, and measurable product outcomes across React, Python, SQL, and cloud-ready workflows.',
  skills: 'React, TypeScript, Python, FastAPI, PostgreSQL, Tailwind CSS, Git, REST APIs, Docker',
  education: 'B.Tech Computer Science, 2026 | DSA, DBMS, OS, AI',
  experience: [
    {
      company: 'Career Intelligence Lab',
      role: 'Software Engineering Intern',
      duration: 'Jan 2026 - Present',
      bullets: 'Built resume analysis dashboards using React and FastAPI\nImproved ATS report response structure and skill recommendations\nDesigned Supabase schemas for user-owned career records',
    },
  ],
  projects: [
    {
      name: 'AI Career Platform',
      stack: 'React, Tailwind, FastAPI, Supabase, Gemini',
      impact: 'Built a hybrid resume intelligence workflow with deterministic parsing, ATS scoring, skill gap analysis, and AI recommendations.',
    },
  ],
};

const ResumeBuilderPage = () => {
  const [draft, setDraft] = useState(initialDraft);
  const [template, setTemplate] = useState<TemplateId>('google');
  const checklist = useMemo(() => buildChecklist(draft), [draft]);
  const activeTemplate = templates.find((item) => item.id === template) ?? templates[0];

  const update = (field: keyof ResumeDraft, value: string) => setDraft((current) => ({ ...current, [field]: value }));
  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    setDraft((current) => ({
      ...current,
      experience: current.experience.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }));
  };
  const updateProject = (index: number, field: keyof Project, value: string) => {
    setDraft((current) => ({
      ...current,
      projects: current.projects.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }));
  };

  return (
    <div className="relative mx-auto max-w-7xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_88%_25%,rgba(236,72,153,0.14),transparent_24%),radial-gradient(circle_at_52%_95%,rgba(16,185,129,0.12),transparent_28%)]" />

      <section className="mb-6 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-2xl md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-100">
              <LayoutTemplate size={14} />
              ATS Resume Builder
            </div>
            <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
              Build a recruiter-grade resume with an ATS-safe live preview.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
              Edit guided sections, switch visual accents, check ATS basics, then export through browser print as PDF.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-neon-cyan transition hover:-translate-y-0.5 hover:bg-white"
          >
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[430px_1fr]">
        <aside className="space-y-5">
          <Panel title="Top-Tech Templates" icon={<Sparkles size={18} className="text-cyan-200" />}>
            <div className="grid gap-3">
              {templates.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTemplate(item.id)}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    template === item.id ? 'border-cyan-300/60 bg-cyan-300/10 text-cyan-100' : 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="block text-sm font-bold">{item.name}</span>
                  <span className="mt-1 block text-xs text-slate-500">{item.note}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Identity" icon={<FileText size={18} className="text-fuchsia-200" />}>
            <Input label="Full Name" value={draft.name} onChange={(value) => update('name', value)} />
            <Input label="Headline" value={draft.headline} onChange={(value) => update('headline', value)} />
            <Input label="Email" value={draft.email} onChange={(value) => update('email', value)} />
            <Input label="Phone" value={draft.phone} onChange={(value) => update('phone', value)} />
            <Input label="Location" value={draft.location} onChange={(value) => update('location', value)} />
            <Input label="Links" value={draft.links} onChange={(value) => update('links', value)} />
          </Panel>

          <Panel title="Core Resume Content">
            <Textarea label="Summary" value={draft.summary} rows={4} onChange={(value) => update('summary', value)} />
            <Textarea label="Skills" value={draft.skills} rows={3} onChange={(value) => update('skills', value)} />
            <Textarea label="Education" value={draft.education} rows={2} onChange={(value) => update('education', value)} />
          </Panel>

          <Panel title="Experience">
            {draft.experience.map((item, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <Input label="Company" value={item.company} onChange={(value) => updateExperience(index, 'company', value)} />
                <Input label="Role" value={item.role} onChange={(value) => updateExperience(index, 'role', value)} />
                <Input label="Duration" value={item.duration} onChange={(value) => updateExperience(index, 'duration', value)} />
                <Textarea label="Bullets" value={item.bullets} rows={4} onChange={(value) => updateExperience(index, 'bullets', value)} />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setDraft((current) => ({ ...current, experience: [...current.experience, { company: '', role: '', duration: '', bullets: '' }] }))}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-semibold text-cyan-100"
            >
              <Plus size={16} />
              Add Experience
            </button>
          </Panel>

          <Panel title="Projects">
            {draft.projects.map((item, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setDraft((current) => ({ ...current, projects: current.projects.filter((_, itemIndex) => itemIndex !== index) }))}
                    className="rounded-full p-2 text-slate-500 hover:bg-white/10 hover:text-white"
                    aria-label="Remove project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <Input label="Project Name" value={item.name} onChange={(value) => updateProject(index, 'name', value)} />
                <Input label="Tech Stack" value={item.stack} onChange={(value) => updateProject(index, 'stack', value)} />
                <Textarea label="Impact" value={item.impact} rows={3} onChange={(value) => updateProject(index, 'impact', value)} />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setDraft((current) => ({ ...current, projects: [...current.projects, { name: '', stack: '', impact: '' }] }))}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 px-4 py-3 text-sm font-semibold text-fuchsia-100"
            >
              <Plus size={16} />
              Add Project
            </button>
          </Panel>
        </aside>

        <main className="space-y-5">
          <Panel title="ATS Readiness">
            <div className="grid gap-3 md:grid-cols-4">
              {checklist.map((item) => (
                <div key={item.label} className={`rounded-2xl border p-4 ${item.ready ? 'border-emerald-300/20 bg-emerald-300/10' : 'border-amber-300/20 bg-amber-300/10'}`}>
                  <p className={`text-xl font-black ${item.ready ? 'text-emerald-200' : 'text-amber-200'}`}>{item.ready ? 'OK' : 'Fix'}</p>
                  <p className="mt-1 text-sm text-slate-300">{item.label}</p>
                </div>
              ))}
            </div>
          </Panel>
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-2xl">
            <ResumePreview draft={draft} template={activeTemplate} />
          </div>
        </main>
      </div>
    </div>
  );
};

const Panel = ({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) => (
  <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-2xl">
    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
      {icon}
      {title}
    </h2>
    <div className="space-y-3">{children}</div>
  </section>
);

const Input = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <label className="block">
    <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span>
    <input value={value} onChange={(event) => onChange(event.target.value)} className="builder-input" />
  </label>
);

const Textarea = ({ label, value, rows, onChange }: { label: string; value: string; rows: number; onChange: (value: string) => void }) => (
  <label className="block">
    <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span>
    <textarea value={value} rows={rows} onChange={(event) => onChange(event.target.value)} className="builder-input resize-y" />
  </label>
);

const ResumePreview = ({ draft, template }: { draft: ResumeDraft; template: (typeof templates)[number] }) => {
  const accentClass = {
    cyan: 'border-cyan-500 text-cyan-700',
    emerald: 'border-emerald-500 text-emerald-700',
    fuchsia: 'border-fuchsia-500 text-fuchsia-700',
    amber: 'border-amber-500 text-amber-700',
  }[template.accent];
  const isMinimal = template.id === 'vercel';
  const isSystems = template.id === 'stripe';

  return (
    <article id="resume-preview" className={`mx-auto min-h-[1120px] max-w-[820px] bg-white text-slate-950 shadow-2xl print:shadow-none ${isMinimal ? 'p-12' : 'p-10'}`}>
      <header className={`${isSystems ? 'border-l-8 pl-5' : 'border-b-4 pb-5'} ${accentClass}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-slate-400">{template.name}</p>
            <h1 className={`${isMinimal ? 'text-5xl' : 'text-4xl'} font-black tracking-tight text-slate-950`}>{draft.name}</h1>
            <p className="mt-2 text-lg font-semibold text-slate-700">{draft.headline}</p>
          </div>
          <div className="text-right text-xs leading-5 text-slate-600">
            <p>{draft.email}</p>
            <p>{draft.phone}</p>
            <p>{draft.location}</p>
            <p>{draft.links}</p>
          </div>
        </div>
      </header>
      <ResumeSection title="Professional Summary"><p>{draft.summary}</p></ResumeSection>
      <ResumeSection title="Core Skills"><p>{draft.skills}</p></ResumeSection>
      <ResumeSection title="Experience">
        {draft.experience.map((item) => (
          <div key={`${item.company}-${item.role}`} className="mb-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-bold">{item.role} | {item.company}</h3>
              <span className="text-sm text-slate-600">{item.duration}</span>
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {item.bullets.split('\n').filter(Boolean).map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
          </div>
        ))}
      </ResumeSection>
      <ResumeSection title="Projects">
        {draft.projects.map((project) => (
          <div key={project.name} className="mb-4">
            <h3 className="font-bold">{project.name}</h3>
            <p className="text-sm font-semibold text-slate-600">{project.stack}</p>
            <p className="mt-1">{project.impact}</p>
          </div>
        ))}
      </ResumeSection>
      <ResumeSection title="Education"><p>{draft.education}</p></ResumeSection>
    </article>
  );
};

const ResumeSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="mt-6 text-sm leading-6">
    <h2 className="mb-2 border-b border-slate-300 pb-1 text-sm font-black uppercase tracking-[0.18em] text-slate-900">{title}</h2>
    {children}
  </section>
);

function buildChecklist(draft: ResumeDraft) {
  return [
    { label: 'Contact fields', ready: Boolean(draft.email && draft.phone) },
    { label: '6+ skills', ready: draft.skills.split(',').filter(Boolean).length >= 6 },
    { label: 'Project impact', ready: draft.projects.some((project) => /\d|built|improved|reduced|increased/i.test(project.impact)) },
    { label: 'Bullet experience', ready: draft.experience.some((item) => item.bullets.split('\n').filter(Boolean).length >= 2) },
  ];
}

export default ResumeBuilderPage;
