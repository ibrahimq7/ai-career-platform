import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { normalizeEmail, validateGmailAddress } from '../../lib/emailSecurity';

type AuthStep = 'email' | 'verify';
type LoadingAction = 'email' | 'otp' | 'google' | 'resend' | null;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<AuthStep>('email');
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    sendMagicLink,
    verifyEmailOtp,
    loginWithGoogle,
    isAuthenticated,
    isAuthReady,
    isSupabaseEnabled,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isSignup = location.pathname.includes('signup');
  const redirectTo =
    typeof location.state === 'object' && location.state && 'from' in location.state
      ? String(location.state.from)
      : '/profile';
  const normalizedEmail = normalizeEmail(email);
  const validation = validateGmailAddress(normalizedEmail);

  const copy = useMemo(
    () => ({
      title: isSignup ? 'Create your AI Career Platform account' : 'Continue with your Gmail',
      description: isSignup
        ? 'Enter your Gmail address and verify ownership with a secure email link or 6-digit OTP code.'
        : 'Returning users with an active session open instantly. Otherwise, verify your Gmail with a secure link or OTP code.',
      primaryAction: step === 'email' ? 'Continue with email address' : 'Verify code and continue',
    }),
    [isSignup, step],
  );

  useEffect(() => {
    if (isAuthReady && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isAuthReady, navigate, redirectTo]);

  const requestEmailVerification = async (action: LoadingAction = 'email') => {
    setError('');
    setSuccess('');

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    try {
      setLoadingAction(action);
      await sendMagicLink(normalizedEmail);
      setStep('verify');
      setOtp('');
      setSuccess('Verification email sent. Open the magic link or enter the 6-digit OTP code from your Gmail.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send verification email. Please try again.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await requestEmailVerification('email');
  };

  const handleOtpSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!validation.valid) {
      setError(validation.message);
      setStep('email');
      return;
    }

    try {
      setLoadingAction('otp');
      await verifyEmailOtp(normalizedEmail, otp);
      setSuccess('Email verified. Redirecting to your secure workspace...');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid or expired verification code.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setSuccess('');
    try {
      setLoadingAction('google');
      await loginWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign in could not be started.');
      setLoadingAction(null);
    }
  };

  const isBusy = loadingAction !== null;

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-4 py-10 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(0,245,255,0.20),transparent_30%),radial-gradient(circle_at_80%_25%,rgba(236,72,153,0.18),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.14),transparent_30%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]"
      >
        <section className="rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur-2xl md:p-8">
          <Link to="/" className="mb-8 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 shadow-neon-cyan">
              <Sparkles size={20} className="text-cyan-100" />
            </span>
            <span>
              <span className="block text-xl font-black tracking-tight text-white">AI Career Platform</span>
              <span className="text-xs uppercase tracking-[0.25em] text-cyan-200">Secure SaaS Access</span>
            </span>
          </Link>

          <h1 className="text-3xl font-black text-white md:text-4xl">{copy.title}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">{copy.description}</p>

          {!isSupabaseEnabled && (
            <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
              Supabase env vars are required for secure authentication. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
            </div>
          )}

          {error && (
            <div className="mt-5 flex gap-3 rounded-2xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-100">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 flex gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">
              <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
              {success}
            </div>
          )}

          {step === 'email' ? (
            <form className="mt-6 space-y-4" onSubmit={handleEmailSubmit}>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Mail size={16} className="text-cyan-200" />
                  Gmail address
                </span>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="auth-input"
                  placeholder="you@gmail.com"
                />
                {email && !validation.valid && <span className="mt-2 block text-xs text-rose-300">{validation.message}</span>}
              </label>

              <button
                type="submit"
                disabled={isBusy || !isSupabaseEnabled}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-neon-cyan transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingAction === 'email' ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                {copy.primaryAction}
              </button>
            </form>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handleOtpSubmit}>
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
                We sent a secure verification email to <span className="font-semibold text-white">{normalizedEmail}</span>.
              </div>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                  <KeyRound size={16} className="text-cyan-200" />
                  6-digit OTP code
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="auth-input text-center text-lg font-black tracking-[0.35em]"
                  placeholder="000000"
                />
              </label>

              <button
                type="submit"
                disabled={isBusy || !isSupabaseEnabled || otp.length !== 6}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-neon-cyan transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingAction === 'otp' ? <Loader2 size={18} className="animate-spin" /> : <KeyRound size={18} />}
                {copy.primaryAction}
              </button>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => requestEmailVerification('resend')}
                  disabled={isBusy || !isSupabaseEnabled}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/[0.10] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingAction === 'resend' ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
                  Resend email
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setOtp('');
                    setError('');
                    setSuccess('');
                  }}
                  disabled={isBusy}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-fuchsia-300/40 hover:bg-white/[0.10] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Change email
                </button>
              </div>
            </form>
          )}

          <button
            type="button"
            onClick={handleGoogle}
            disabled={isBusy || !isSupabaseEnabled}
            className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-fuchsia-300/40 hover:bg-white/[0.10] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingAction === 'google' ? 'Opening Google...' : 'Continue with Google'}
          </button>

          <p className="mt-5 text-center text-xs leading-5 text-slate-500">
            Access is granted only after Supabase creates a verified session. Existing sessions are restored automatically.
          </p>
          <p className="mt-3 text-center text-sm text-slate-400">
            {isSignup ? 'Already verified?' : 'New to AI Career Platform?'}{' '}
            <Link to={isSignup ? '/login' : '/signup'} className="font-semibold text-cyan-200 hover:text-white">
              {isSignup ? 'Sign in' : 'Create an account'}
            </Link>
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-2xl md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-200">Secure Email Flow</p>
          <div className="mt-6 grid gap-4">
            {[
              'Enter a Gmail address and continue.',
              'Supabase sends a verification email with a magic link and OTP code.',
              'Click the email link or enter the 6-digit code to create a session.',
              'Returning users stay logged in after refresh until they sign out.',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm leading-6 text-slate-300">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-xs leading-5 text-amber-50/80">
            For security, an email existing in the database is not enough to unlock an account. A browser must already have a valid session, or the user must verify through Supabase email OTP or magic link.
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default LoginPage;
