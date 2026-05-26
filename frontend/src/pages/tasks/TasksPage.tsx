import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CalendarDays, CheckCircle2, Clock3, KanbanSquare, Loader2, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';
import { createTask, deleteTask, listTasks, updateTask } from '../../lib/tasksApi';
import { Task, TaskPriority, TaskStatus } from '../../types';

const statusLabels: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

const priorities: TaskPriority[] = ['low', 'medium', 'high'];
const statuses: TaskStatus[] = ['todo', 'in_progress', 'done'];

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    listTasks()
      .then((items) => {
        if (mounted) setTasks(items);
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : 'Unable to load tasks.');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesQuery = `${task.title} ${task.description ?? ''}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter, tasks]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      done: tasks.filter((task) => task.status === 'done').length,
      active: tasks.filter((task) => task.status !== 'done').length,
      high: tasks.filter((task) => task.priority === 'high').length,
    };
  }, [tasks]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      setIsCreating(true);
      const task = await createTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        due_date: dueDate,
      });
      setTasks((current) => [task, ...current]);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create task.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleStatusChange = async (task: Task, status: TaskStatus) => {
    setError('');
    const previous = tasks;
    setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, status } : item)));
    try {
      const updated = await updateTask(task.id, { status });
      setTasks((current) => current.map((item) => (item.id === task.id ? updated : item)));
    } catch (err) {
      setTasks(previous);
      setError(err instanceof Error ? err.message : 'Unable to update task.');
    }
  };

  const handleDelete = async (task: Task) => {
    setError('');
    const previous = tasks;
    setTasks((current) => current.filter((item) => item.id !== task.id));
    try {
      await deleteTask(task.id);
    } catch (err) {
      setTasks(previous);
      setError(err instanceof Error ? err.message : 'Unable to delete task.');
    }
  };

  return (
    <div className="relative mx-auto max-w-7xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_12%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_88%_20%,rgba(236,72,153,0.14),transparent_24%),radial-gradient(circle_at_50%_96%,rgba(16,185,129,0.12),transparent_30%)]" />

      <section className="mb-6 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-2xl md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
              <ShieldCheck size={14} />
              Supabase RLS Task Workspace
            </div>
            <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
              Secure personal task command center for focused execution.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
              Every task is owned by your authenticated Supabase user. RLS policies prevent anonymous access and cross-user reads.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Total" value={stats.total} />
            <Stat label="Active" value={stats.active} />
            <Stat label="Done" value={stats.done} />
            <Stat label="High Priority" value={stats.high} />
          </div>
        </div>
      </section>

      {error && (
        <div className="mb-5 flex gap-3 rounded-2xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-100">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[390px_1fr]">
        <aside className="space-y-5">
          <form onSubmit={handleCreate} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-2xl">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <Plus size={18} className="text-cyan-200" />
              Create Task
            </h2>
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Title</span>
                <input value={title} onChange={(event) => setTitle(event.target.value)} className="builder-input" placeholder="Prepare project deep-dive answer" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Description</span>
                <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className="builder-input resize-y" placeholder="Add context, acceptance criteria, or reminders..." />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Priority</span>
                  <select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)} className="builder-input">
                    {priorities.map((item) => <option key={item} value={item} className="bg-slate-950">{item}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Due Date</span>
                  <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="builder-input" />
                </label>
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-neon-cyan transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCreating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                Add Task
              </button>
            </div>
          </form>
        </aside>

        <main className="space-y-5">
          <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-2xl lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="builder-input pl-12" placeholder="Search tasks..." />
            </div>
            <div className="flex flex-wrap gap-2">
              {(['all', ...statuses] as Array<TaskStatus | 'all'>).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    statusFilter === status ? 'border-cyan-300/60 bg-cyan-300/10 text-cyan-100' : 'border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {status === 'all' ? 'All' : statusLabels[status]}
                </button>
              ))}
            </div>
          </div>

          <section className="grid gap-4">
            {isLoading ? (
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center text-slate-400">
                <Loader2 className="mx-auto animate-spin text-cyan-200" size={34} />
                <p className="mt-4">Loading your secure task workspace...</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDelete} />
                ))}
              </AnimatePresence>
            )}
            {!isLoading && filteredTasks.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center text-slate-400">
                <KanbanSquare className="mx-auto text-slate-500" size={38} />
                <p className="mt-4">No tasks match this view yet.</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
    <p className="text-3xl font-black text-white">{value}</p>
    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
  </div>
);

const TaskCard = ({
  task,
  onStatusChange,
  onDelete,
}: {
  task: Task;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
}) => (
  <motion.article
    layout
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-2xl"
  >
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityClass(task.priority)}`}>{task.priority}</span>
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-slate-300">{statusLabels[task.status]}</span>
          {task.due_date && (
            <span className="flex items-center gap-1 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
              <CalendarDays size={13} />
              {task.due_date}
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold text-white">{task.title}</h2>
        {task.description && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{task.description}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onStatusChange(task, status)}
            className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
              task.status === status ? 'bg-cyan-300 text-slate-950' : 'border border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/10'
            }`}
          >
            {status === 'done' ? <CheckCircle2 size={14} className="inline" /> : status === 'in_progress' ? <Clock3 size={14} className="inline" /> : null} {statusLabels[status]}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onDelete(task)}
          className="rounded-full border border-rose-300/20 bg-rose-400/10 p-2 text-rose-100 hover:bg-rose-400/20"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </motion.article>
);

function priorityClass(priority: TaskPriority) {
  if (priority === 'high') return 'bg-rose-400/15 text-rose-100 border border-rose-300/20';
  if (priority === 'medium') return 'bg-amber-300/15 text-amber-100 border border-amber-300/20';
  return 'bg-emerald-300/15 text-emerald-100 border border-emerald-300/20';
}

export default TasksPage;
