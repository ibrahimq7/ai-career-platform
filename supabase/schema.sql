-- AI Career Platform MVP schema
-- Run this in the Supabase SQL editor after rotating keys and enabling Auth.

create extension if not exists "pgcrypto";

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  target_role text default 'Full Stack Developer',
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_gmail_only check (email is null or email like '%@gmail.com')
);

alter table public.profiles add column if not exists email text;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  storage_path text,
  parsed_json jsonb not null default '{}'::jsonb,
  raw_text text,
  target_role text not null default 'Full Stack Developer',
  created_at timestamptz not null default now()
);

create table if not exists public.ats_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid not null references public.resumes(id) on delete cascade,
  overall_score integer not null check (overall_score between 0 and 100),
  score_breakdown jsonb not null default '[]'::jsonb,
  suggestions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  source text not null default 'resume',
  confidence numeric(4,3),
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid references public.resumes(id) on delete set null,
  type text not null check (type in ('skill', 'course', 'resume', 'project', 'roadmap', 'interview')),
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'open' check (status in ('open', 'saved', 'dismissed', 'completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.interview_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_role text not null,
  mode text not null check (mode in ('technical', 'behavioral', 'hr', 'mixed')),
  questions jsonb not null default '[]'::jsonb,
  feedback jsonb not null default '{}'::jsonb,
  score integer check (score between 0 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.coding_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_slug text not null,
  language text not null,
  status text not null check (status in ('attempted', 'passed', 'failed')),
  score integer check (score between 0 and 100),
  submission_code text,
  test_results jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill text not null,
  resource_title text not null,
  resource_url text,
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'completed')),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.resumes enable row level security;
alter table public.ats_reports enable row level security;
alter table public.skills enable row level security;
alter table public.recommendations enable row level security;
alter table public.interview_history enable row level security;
alter table public.coding_assessments enable row level security;
alter table public.learning_progress enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "tasks_crud_own" on public.tasks;
drop policy if exists "resumes_crud_own" on public.resumes;
drop policy if exists "ats_reports_crud_own" on public.ats_reports;
drop policy if exists "skills_crud_own" on public.skills;
drop policy if exists "recommendations_crud_own" on public.recommendations;
drop policy if exists "interview_history_crud_own" on public.interview_history;
drop policy if exists "coding_assessments_crud_own" on public.coding_assessments;
drop policy if exists "learning_progress_crud_own" on public.learning_progress;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "tasks_crud_own" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "resumes_crud_own" on public.resumes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ats_reports_crud_own" on public.ats_reports for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "skills_crud_own" on public.skills for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "recommendations_crud_own" on public.recommendations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "interview_history_crud_own" on public.interview_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "coding_assessments_crud_own" on public.coding_assessments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "learning_progress_crud_own" on public.learning_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "resume_files_select_own" on storage.objects;
drop policy if exists "resume_files_insert_own" on storage.objects;
drop policy if exists "resume_files_update_own" on storage.objects;
drop policy if exists "resume_files_delete_own" on storage.objects;

create policy "resume_files_select_own"
on storage.objects for select
using (
  bucket_id = 'resumes'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "resume_files_insert_own"
on storage.objects for insert
with check (
  bucket_id = 'resumes'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "resume_files_update_own"
on storage.objects for update
using (
  bucket_id = 'resumes'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "resume_files_delete_own"
on storage.objects for delete
using (
  bucket_id = 'resumes'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  if new.email not like '%@gmail.com' then
    raise exception 'Only Gmail accounts are allowed';
  end if;

  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

notify pgrst, 'reload schema';
