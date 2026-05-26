import { BrainCircuit, Gauge, Lightbulb, Map, MessageSquareText, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { AiEnhancement } from '../../types';

type AiEnhancementPanelProps = {
  enhancement: AiEnhancement;
};

const AiEnhancementPanel = ({ enhancement }: AiEnhancementPanelProps) => {
  if (!enhancement.enabled) {
    return (
      <div className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-6 text-amber-100 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-start gap-3">
          <BrainCircuit className="mt-1 flex-shrink-0" size={22} />
          <div>
            <h2 className="text-xl font-bold text-white">AI Enhancement Standby</h2>
            <p className="mt-2 text-sm text-amber-50/80">
              {enhancement.reason || 'Add a Gemini key to the backend environment to enable semantic explanations.'}
            </p>
            {enhancement.job_eligibility && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-100">Eligibility Fallback</p>
                <p className="mt-2 text-lg font-black text-white">{enhancement.job_eligibility} · {enhancement.eligibility_score}/100</p>
                <p className="mt-2 text-sm leading-6 text-amber-50/80">{enhancement.eligibility_reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-2xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-200">Gemini Enhancement</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Semantic Career Intelligence</h2>
        </div>
        <Sparkles className="text-fuchsia-200" size={30} />
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
            <Gauge size={16} />
            Job Eligibility
          </p>
          <p className="mt-3 text-3xl font-black text-white">{enhancement.eligibility_score}/100</p>
          <p className="mt-1 text-lg font-bold text-cyan-50">{enhancement.job_eligibility}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Eligibility Reason</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">{enhancement.eligibility_reason}</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
            <BrainCircuit size={18} className="text-cyan-200" />
            Recruiter Summary
          </h3>
          <p className="text-sm leading-7 text-slate-300">{enhancement.summary}</p>
          <p className="mt-4 text-sm leading-7 text-slate-400">{enhancement.ats_explanation}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
            <Lightbulb size={18} className="text-amber-200" />
            Priority Actions
          </h3>
          <ul className="space-y-3">
            {enhancement.priority_actions.map((action) => (
              <li key={action} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300">
                {action}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <InsightColumn title="Skill Gap Analysis" items={enhancement.skill_gap_analysis} icon={<BrainCircuit size={17} className="text-cyan-200" />} />
        <InsightColumn title="Career Roadmap" items={enhancement.career_roadmap} icon={<Map size={17} className="text-emerald-200" />} />
        <InsightColumn title="Achievement Feedback" items={enhancement.achievement_feedback} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <InsightColumn title="Project Ideas" items={enhancement.project_recommendations} />
        <InsightColumn title="Interview Prep" items={enhancement.interview_questions} icon={<MessageSquareText size={17} className="text-cyan-200" />} />
      </div>

      {enhancement.dream_job_fit && (
        <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">Dream Job Fit</p>
          <p className="mt-3 text-sm leading-7 text-cyan-50/85">{enhancement.dream_job_fit}</p>
        </div>
      )}
    </div>
  );
};

const InsightColumn = ({ title, items, icon }: { title: string; items: string[]; icon?: ReactNode }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
      {icon}
      {title}
    </h3>
    <ul className="space-y-3">
      {items.length ? items.map((item) => (
        <li key={item} className="text-sm leading-6 text-slate-400">
          {item}
        </li>
      )) : <li className="text-sm text-slate-500">No AI insight returned for this section.</li>}
    </ul>
  </div>
);

export default AiEnhancementPanel;
