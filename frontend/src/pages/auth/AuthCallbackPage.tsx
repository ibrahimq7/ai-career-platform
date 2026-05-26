import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const AuthCallbackPage = () => {
  const { isAuthenticated, isAuthReady } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const urlError = searchParams.get('error_description') || searchParams.get('error');
    const code = searchParams.get('code');

    if (urlError) {
      setError(urlError);
      return;
    }

    if (code && supabase) {
      supabase.auth.exchangeCodeForSession(code).then(({ error: exchangeError }) => {
        if (exchangeError) {
          setError(exchangeError.message);
        }
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (error || !isAuthReady) return;
    navigate(isAuthenticated ? '/profile' : '/login', { replace: true });
  }, [error, isAuthenticated, isAuthReady, navigate]);

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-4 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(236,72,153,0.16),transparent_26%)]" />
      <div className="relative rounded-3xl border border-white/10 bg-white/[0.07] p-8 text-center shadow-2xl backdrop-blur-2xl">
        {error ? (
          <AlertCircle className="mx-auto text-rose-200" size={38} />
        ) : isAuthReady ? (
          <ShieldCheck className="mx-auto text-emerald-200" size={38} />
        ) : (
          <Loader2 className="mx-auto animate-spin text-cyan-200" size={38} />
        )}
        <h1 className="mt-4 text-2xl font-black text-white">{error ? 'Verification failed' : 'Verifying secure session'}</h1>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
          {error || 'Your magic link is being validated by Supabase.'}
        </p>
        {error && (
          <Link
            to="/login"
            className="mt-6 inline-flex rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-neon-cyan transition hover:bg-white"
          >
            Request a new link
          </Link>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;
