import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './index.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const ResumePage = lazy(() => import('./pages/resume/ResumePage'));
const ResumeBuilderPage = lazy(() => import('./pages/resume/ResumeBuilderPage'));
const InterviewPage = lazy(() => import('./pages/interview/InterviewPage'));
const LearningPage = lazy(() => import('./pages/learning/LearningPage'));
const TasksPage = lazy(() => import('./pages/tasks/TasksPage'));
const CodingPage = lazy(() => import('./pages/coding/CodingPage'));
const ProblemPage = lazy(() => import('./pages/coding/ProblemPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const AuthCallbackPage = lazy(() => import('./pages/auth/AuthCallbackPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const AppFallback = () => (
  <div className="grid min-h-screen place-items-center bg-slate-950 text-slate-100">
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur-2xl">
      <Loader2 className="mx-auto animate-spin text-cyan-200" size={34} />
      <p className="mt-4 text-sm text-slate-400">Loading AI Career Platform...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={<AppFallback />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/resume" element={<ResumePage />} />
                  <Route path="/resume-builder" element={<ResumeBuilderPage />} />
                  <Route path="/interview" element={<InterviewPage />} />
                  <Route path="/learning" element={<LearningPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/coding" element={<CodingPage />} />
                  <Route path="/coding/:problemId" element={<ProblemPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
