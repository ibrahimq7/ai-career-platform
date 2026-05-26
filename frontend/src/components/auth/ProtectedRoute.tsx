import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isAuthReady, isSupabaseEnabled } = useAuth();
  const location = useLocation();

  if (!isAuthReady) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-950 text-slate-100">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur-2xl">
          <Loader2 className="mx-auto animate-spin text-cyan-200" size={34} />
          <p className="mt-4 text-sm text-slate-400">Restoring secure session...</p>
        </div>
      </div>
    );
  }

  if (!isSupabaseEnabled) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-950 px-4 text-slate-100">
        <div className="max-w-md rounded-3xl border border-amber-300/20 bg-amber-300/10 p-8 text-center shadow-2xl backdrop-blur-2xl">
          <ShieldCheck className="mx-auto text-amber-100" size={38} />
          <h1 className="mt-4 text-2xl font-black text-white">Supabase Auth Required</h1>
          <p className="mt-3 text-sm leading-6 text-amber-50/80">
            Add rotated Supabase values to `frontend/.env` before accessing protected SaaS routes.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
