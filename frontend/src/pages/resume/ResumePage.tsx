import { useState } from 'react';
import { AlertCircle, BrainCircuit, Target } from 'lucide-react';
import ResumeUploader from '../../components/resume/ResumeUploader';
import ResumeAnalyzer from '../../components/resume/ResumeAnalyzer';
import SkillsGapAnalysis from '../../components/resume/SkillsGapAnalysis';
import CourseRecommendations from '../../components/resume/CourseRecommendations';
import AiEnhancementPanel from '../../components/resume/AiEnhancementPanel';
import { saveResumeAnalysis } from '../../lib/careerData';
import { analyzeResume } from '../../lib/resumeApi';
import { ResumeAnalysisResponse } from '../../types';

const ResumePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('full stack developer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResponse | null>(null);
  const useAi = true;
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  
  const handleFileUpload = (uploadedFile: File | null) => {
    setFile(uploadedFile);
    setAnalysis(null);
    setError('');
    setSaveStatus('');
  };
  
  const handleAnalyzeResume = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError('');
    setSaveStatus('');

    try {
      const result = await analyzeResume(file, targetRole, useAi);
      setAnalysis(result);
      setIsAnalyzing(false);
      setSaveStatus('Saving report to your workspace...');
      void (async () => {
        try {
          const persistence = await saveResumeAnalysis(file, result);
          if (persistence.saved) {
            const warningText = persistence.warnings?.length ? ` ${persistence.warnings.join(' ')}` : '';
            setSaveStatus(`Report saved to your Supabase workspace.${warningText}`);
          } else {
            setSaveStatus(`Report generated, but workspace save needs attention: ${persistence.reason || 'Unknown Supabase error.'}`);
          }
        } catch {
          setSaveStatus('Report generated, but workspace save failed unexpectedly. Check Supabase schema, RLS policies, and env values.');
        }
      })();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resume analysis failed.');
      setIsAnalyzing(false);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="relative mx-auto max-w-7xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.2),transparent_28%),radial-gradient(circle_at_90%_20%,rgba(217,70,239,0.18),transparent_25%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.14),transparent_30%)]" />

      <div className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-2xl md:p-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_410px] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
              <BrainCircuit size={14} />
              Hybrid Resume Intelligence
            </div>
            <h1 className="max-w-2xl text-2xl font-black tracking-tight text-white md:text-4xl">
              Resume Analyzer
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Upload a PDF or DOCX resume for a fast ATS score, structured parsing, skill gaps, and recruiter-grade recommendations.
            </p>
            <div className="mt-5 max-w-sm">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                <Target size={16} className="text-cyan-200" />
                Target Role
              </label>
              <select
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/60"
              >
                <option className="bg-slate-950" value="full stack developer">Full Stack Developer</option>
                <option className="bg-slate-950" value="frontend developer">Frontend Developer</option>
                <option className="bg-slate-950" value="backend developer">Backend Developer</option>
                <option className="bg-slate-950" value="data analyst">Data Analyst</option>
                <option className="bg-slate-950" value="machine learning engineer">Machine Learning Engineer</option>
              </select>
            </div>
            <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
              The backend parses locally first, then sends optimized structured JSON for semantic guidance.
            </p>
          </div>

          <ResumeUploader
            onFileUpload={handleFileUpload}
            onAnalyze={handleAnalyzeResume}
            file={file}
            isAnalyzing={isAnalyzing}
          />
        </div>
        
        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-100">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {saveStatus && !error && (
          <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">
            {saveStatus}
          </div>
        )}
      </div>
      
      {analysis && (
        <div className="space-y-6">
          <ResumeAnalyzer 
            resumeData={analysis.parsed_resume}
            atsScore={analysis.ats_score}
            scoreBreakdown={analysis.score_breakdown}
          />

          <AiEnhancementPanel enhancement={analysis.ai_enhancement} />
          
          <SkillsGapAnalysis 
            currentSkills={analysis.parsed_resume.skills}
            missingSkills={analysis.missing_skills}
          />
          
          <CourseRecommendations 
            missingSkills={analysis.missing_skills}
            recommendations={analysis.course_recommendations}
          />
        </div>
      )}
    </div>
  );
};

export default ResumePage;
