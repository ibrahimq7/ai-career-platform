import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { BrainCircuit, CheckCircle2, MessageSquareText, Mic, RotateCcw, Sparkles } from 'lucide-react';

type InterviewMode = 'technical' | 'behavioral' | 'hr';

const questionBank: Record<InterviewMode, string[]> = {
  technical: [
    'Explain one project from your resume as if I am a senior engineer reviewing your architecture.',
    'How would you design a scalable resume parsing API that supports PDF and DOCX files?',
    'What tradeoffs would you consider when choosing PostgreSQL tables versus JSONB for ATS reports?',
    'Describe how you would secure a FastAPI endpoint used by authenticated Supabase users.',
    'How would you debug a slow React dashboard that renders large analytics components?',
  ],
  behavioral: [
    'Tell me about a time you had to learn a technology quickly to complete a project.',
    'Describe a moment when feedback improved your work.',
    'Tell me about a project where you took ownership beyond your assigned task.',
    'How do you handle ambiguity when requirements are still changing?',
    'Give an example of a conflict in a team and how you resolved it.',
  ],
  hr: [
    'Walk me through your background and why this role fits your career goals.',
    'Why do you want to work at a top technology company?',
    'What are your strengths and what are you actively improving?',
    'Where do you see yourself in two years?',
    'Why should we hire you over another candidate with similar skills?',
  ],
};

const focus: Record<string, string[]> = {
  'Full Stack Developer': ['React architecture', 'API design', 'database modeling', 'deployment readiness'],
  'Frontend Developer': ['component systems', 'state management', 'performance', 'accessibility'],
  'Backend Developer': ['API security', 'database design', 'async jobs', 'observability'],
  'Data Analyst': ['SQL', 'dashboard storytelling', 'metrics quality', 'business impact'],
};

const InterviewPage = () => {
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [mode, setMode] = useState<InterviewMode>('technical');
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const questions = useMemo(() => buildQuestions(targetRole, mode), [targetRole, mode]);
  const activeAnswer = answers[activeIndex] ?? '';
  const feedback = useMemo(() => scoreAnswer(activeAnswer), [activeAnswer]);

  return (
    <div className="relative mx-auto max-w-7xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_15%,rgba(168,85,247,0.18),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.12),transparent_30%)]" />

      <section className="mb-6 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-2xl md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
              <Mic size={14} />
              Interview Simulator
            </div>
            <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
              Practice crisp answers before real interview pressure hits.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
              Run technical, behavioral, or HR rounds with role-specific prompts and instant answer quality signals.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveIndex(0);
              setAnswers({});
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
          >
            <RotateCcw size={18} />
            Reset Round
          </button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[350px_1fr]">
        <aside className="space-y-5">
          <Panel title="Round Controls" icon={<BrainCircuit size={18} className="text-fuchsia-200" />}>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Target Role</span>
              <select value={targetRole} onChange={(event) => setTargetRole(event.target.value)} className="builder-input">
                {Object.keys(focus).map((role) => <option key={role} value={role} className="bg-slate-950">{role}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['technical', 'behavioral', 'hr'] as InterviewMode[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setMode(item);
                    setActiveIndex(0);
                  }}
                  className={`rounded-2xl border px-3 py-3 text-sm font-semibold capitalize transition ${
                    mode === item ? 'border-cyan-300/50 bg-cyan-300/10 text-cyan-100' : 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Answer Signal" icon={<CheckCircle2 size={18} className="text-emerald-200" />}>
            <div className="grid grid-cols-2 gap-3">
              <Signal label="Structure" active={feedback.structure} />
              <Signal label="Specificity" active={feedback.specificity} />
              <Signal label="Impact" active={feedback.impact} />
              <Signal label="Concise" active={feedback.concise} />
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-3xl font-black text-white">{feedback.score}%</p>
              <p className="text-sm text-slate-400">Answer readiness</p>
            </div>
          </Panel>

          <Panel title="Role Focus" icon={<Sparkles size={18} className="text-cyan-200" />}>
            <div className="flex flex-wrap gap-2">
              {focus[targetRole].map((item) => (
                <span key={item} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">{item}</span>
              ))}
            </div>
          </Panel>
        </aside>

        <main className="space-y-5">
          <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-2xl">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-200">Question {activeIndex + 1} of {questions.length}</p>
                <h2 className="mt-2 text-2xl font-bold text-white">{questions[activeIndex]}</h2>
              </div>
              <MessageSquareText className="hidden text-fuchsia-200 md:block" size={34} />
            </div>
            <textarea
              value={activeAnswer}
              onChange={(event) => setAnswers((current) => ({ ...current, [activeIndex]: event.target.value }))}
              rows={10}
              className="builder-input resize-y text-base leading-7"
              placeholder="Draft your answer using STAR: Situation, Task, Action, Result. Add tools, decisions, constraints, and measurable outcomes."
            />
            <div className="mt-5 flex flex-wrap gap-3">
              {questions.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-10 w-10 rounded-full text-sm font-bold transition ${
                    activeIndex === index ? 'bg-cyan-300 text-slate-950' : answers[index] ? 'bg-emerald-300/20 text-emerald-100' : 'bg-white/10 text-slate-300 hover:bg-white/15'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-3">
            <FeedbackCard title="What To Improve" body={feedback.tip} tone="cyan" />
            <FeedbackCard title="Strong Formula" body="Open with a one-line answer, give context, describe your exact action, quantify the result, then connect it to the role." tone="emerald" />
            <FeedbackCard title="Premium Signal" body="Mention tradeoffs, constraints, debugging steps, metrics, and what you would improve next." tone="fuchsia" />
          </section>
        </main>
      </div>
    </div>
  );
};

const Panel = ({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) => (
  <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-2xl">
    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">{icon}{title}</h2>
    <div className="space-y-4">{children}</div>
  </section>
);

const Signal = ({ label, active }: { label: string; active: boolean }) => (
  <div className={`rounded-2xl border p-3 ${active ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100' : 'border-white/10 bg-white/[0.04] text-slate-500'}`}>
    <p className="text-sm font-semibold">{label}</p>
  </div>
);

const FeedbackCard = ({ title, body, tone }: { title: string; body: string; tone: 'cyan' | 'emerald' | 'fuchsia' }) => {
  const toneClass = {
    cyan: 'border-cyan-300/20 bg-cyan-300/10 text-cyan-50',
    emerald: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-50',
    fuchsia: 'border-fuchsia-300/20 bg-fuchsia-300/10 text-fuchsia-50',
  }[tone];
  return <div className={`rounded-3xl border p-5 ${toneClass}`}><h3 className="font-bold text-white">{title}</h3><p className="mt-3 text-sm leading-7 opacity-85">{body}</p></div>;
};

function buildQuestions(targetRole: string, mode: InterviewMode) {
  const roleFocus = focus[targetRole] ?? focus['Full Stack Developer'];
  return [
    ...questionBank[mode].slice(0, 3),
    `For a ${targetRole} role, explain how you would demonstrate strength in ${roleFocus[0]} and ${roleFocus[1]}.`,
    `What is one portfolio improvement you can make this week to prove ${roleFocus[2]}?`,
  ];
}

function scoreAnswer(answer: string) {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const lower = answer.toLowerCase();
  const structure = /\b(situation|task|action|result|first|then|finally)\b/.test(lower);
  const specificity = /\b(react|fastapi|python|sql|api|database|supabase|gemini|docker|aws|project|team)\b/.test(lower);
  const impact = /\d|%|improved|reduced|increased|saved|users|latency|score|performance/.test(lower);
  const concise = words.length >= 45 && words.length <= 180;
  const score = [structure, specificity, impact, concise].filter(Boolean).length * 25;
  const tip = !structure
    ? 'Add structure. Use Situation, Task, Action, Result so the interviewer can follow your thinking.'
    : !specificity
      ? 'Add concrete tools, systems, decisions, or constraints from your actual project.'
      : !impact
        ? 'Add measurable impact: percentage, speed, scale, users, score, or business result.'
        : !concise
          ? 'Aim for 45 to 180 words. Too short feels thin, too long loses the interviewer.'
          : 'Strong draft. Practice delivering it aloud with calm pacing and one confident closing sentence.';
  return { structure, specificity, impact, concise, score, tip };
}

export default InterviewPage;
