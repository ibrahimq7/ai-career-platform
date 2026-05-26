import { PostgrestError } from '@supabase/supabase-js';
import { ResumeAnalysisResponse } from '../types';
import { supabase } from './supabase';

type SaveResult = {
  saved: boolean;
  resumeId?: string;
  reason?: string;
  warnings?: string[];
};

export async function saveResumeAnalysis(file: File, analysis: ResumeAnalysisResponse): Promise<SaveResult> {
  if (!supabase) return { saved: false, reason: 'Supabase is not configured.' };

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) return { saved: false, reason: 'No authenticated Supabase user session was found.' };

  const warnings: string[] = [];
  const upload = await uploadResumeFile(userId, file);
  if (upload.warning) warnings.push(upload.warning);

  const resumeInsert = await supabase
    .from('resumes')
    .insert({
      user_id: userId,
      file_name: file.name,
      storage_path: upload.storagePath,
      parsed_json: analysis.parsed_resume,
      raw_text: analysis.parsed_resume.resume_text,
      target_role: analysis.target_role,
    })
    .select('id')
    .single();

  if (resumeInsert.error) {
    return {
      saved: false,
      reason: `Could not save resume row: ${formatSupabaseError(resumeInsert.error)}`,
      warnings,
    };
  }

  const resumeId = resumeInsert.data.id as string;

  const reportInsert = await supabase.from('ats_reports').insert({
    user_id: userId,
    resume_id: resumeId,
    overall_score: analysis.ats_score,
    score_breakdown: analysis.score_breakdown,
    suggestions: analysis.suggestions,
  });

  if (reportInsert.error) {
    return {
      saved: false,
      resumeId,
      reason: `Resume saved, but ATS report save failed: ${formatSupabaseError(reportInsert.error)}`,
      warnings,
    };
  }

  await saveSkills(userId, analysis, warnings);
  await saveRecommendations(userId, resumeId, analysis, warnings);

  return { saved: true, resumeId, warnings };
}

async function saveSkills(userId: string, analysis: ResumeAnalysisResponse, warnings: string[]) {
  if (!supabase || !analysis.parsed_resume.skills.length) return;

  const { error } = await supabase.from('skills').upsert(
    analysis.parsed_resume.skills.map((skill) => ({
      user_id: userId,
      name: skill,
      source: 'resume',
    })),
    { onConflict: 'user_id,name' },
  );

  if (error) {
    warnings.push(`Skills were not saved: ${formatSupabaseError(error)}`);
  }
}

async function saveRecommendations(
  userId: string,
  resumeId: string,
  analysis: ResumeAnalysisResponse,
  warnings: string[],
) {
  if (!supabase) return;

  const rows = [
    ...(analysis.ai_enhancement
      ? [
          {
            user_id: userId,
            resume_id: resumeId,
            type: 'resume',
            payload: analysis.ai_enhancement,
          },
        ]
      : []),
    ...analysis.missing_skills.map((skill) => ({
      user_id: userId,
      resume_id: resumeId,
      type: 'skill',
      payload: { skill, target_role: analysis.target_role },
    })),
    ...analysis.course_recommendations.map((course) => ({
      user_id: userId,
      resume_id: resumeId,
      type: 'course',
      payload: course,
    })),
  ];

  if (!rows.length) return;

  const { error } = await supabase.from('recommendations').insert(rows);
  if (error) {
    warnings.push(`Recommendations were not saved: ${formatSupabaseError(error)}`);
  }
}

async function uploadResumeFile(userId: string, file: File): Promise<{ storagePath: string | null; warning?: string }> {
  if (!supabase) return { storagePath: null, warning: 'Supabase is not configured.' };

  const extension = file.name.split('.').pop()?.toLowerCase() || 'resume';
  const safeName = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64) || 'resume';
  const storagePath = `${userId}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}.${extension}`;

  const { error } = await supabase.storage.from('resumes').upload(storagePath, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    return {
      storagePath: null,
      warning: `Resume file storage upload skipped: ${formatSupabaseError(error)}`,
    };
  }

  return { storagePath };
}

function formatSupabaseError(error: PostgrestError | { message: string; code?: string }) {
  if (error.code === 'PGRST205' || /public\.resumes|schema cache|table .*resumes/i.test(error.message)) {
    return 'Database tables are not applied yet. Run supabase/schema.sql in the Supabase SQL editor, then wait a few seconds for the PostgREST schema cache to reload. (PGRST205)';
  }

  const code = error.code ? ` (${error.code})` : '';
  return `${error.message}${code}`;
}
