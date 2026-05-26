import { ResumeAnalysisResponse } from '../types';
import { supabase } from './supabase';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export async function analyzeResume(file: File, targetRole: string, useAi = true): Promise<ResumeAnalysisResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('target_role', targetRole);
  formData.append('use_ai', String(useAi));

  const token = supabase ? (await supabase.auth.getSession()).data.session?.access_token : null;

  const response = await fetch(`${API_BASE_URL}/api/upload-resume/`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? 'Resume analysis failed. Please try another file.');
  }

  return response.json();
}
