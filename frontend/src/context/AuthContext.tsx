import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { validateGmailAddress, normalizeEmail } from '../lib/emailSecurity';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  isSupabaseEnabled: boolean;
  sendMagicLink: (email: string) => Promise<void>;
  verifyEmailOtp: (email: string, token: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setUser(null);
      setIsAuthReady(true);
      return;
    }
    const client = supabase;

    client.auth.getSession().then(async ({ data }) => {
      const sessionUser = data.session?.user;
      setUser(sessionUser && isAllowedGmail(sessionUser.email) ? mapSupabaseUser(sessionUser) : null);
      if (sessionUser && !isAllowedGmail(sessionUser.email)) {
        await client.auth.signOut();
      }
      setIsAuthReady(true);
    });

    const { data: listener } = client.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user;
      setUser(sessionUser && isAllowedGmail(sessionUser.email) ? mapSupabaseUser(sessionUser) : null);
      if (sessionUser && !isAllowedGmail(sessionUser.email)) {
        await client.auth.signOut();
      }
      setIsAuthReady(true);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const sendMagicLink = async (email: string) => {
    if (!supabase) {
      throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }

    const normalized = normalizeEmail(email);
    const validation = validateGmailAddress(normalized);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: normalized,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    });

    if (error) throw error;
  };

  const verifyEmailOtp = async (email: string, token: string) => {
    if (!supabase) {
      throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }

    const normalized = normalizeEmail(email);
    const validation = validateGmailAddress(normalized);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const sanitizedToken = token.replace(/\s/g, '');
    if (!/^\d{6}$/.test(sanitizedToken)) {
      throw new Error('Enter the 6-digit verification code from your email.');
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email: normalized,
      token: sanitizedToken,
      type: 'email',
    });

    if (error) throw error;

    const sessionUser = data.user;
    if (!sessionUser || !isAllowedGmail(sessionUser.email)) {
      await supabase.auth.signOut();
      throw new Error('Only verified Gmail accounts ending in @gmail.com are allowed.');
    }

    setUser(mapSupabaseUser(sessionUser));
  };

  const loginWithGoogle = async () => {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          hd: 'gmail.com',
        },
      },
    });
    if (error) throw error;
  };

  const getAccessToken = async () => {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthReady,
        isSupabaseEnabled: isSupabaseConfigured,
        sendMagicLink,
        verifyEmailOtp,
        loginWithGoogle,
        getAccessToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function isAllowedGmail(email?: string) {
  return Boolean(email && validateGmailAddress(email).valid);
}

function mapSupabaseUser(authUser: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}): User {
  const metadata = authUser.user_metadata ?? {};
  return {
    id: authUser.id,
    name: String(metadata.full_name || metadata.name || authUser.email?.split('@')[0] || 'Career Pilot'),
    email: authUser.email ?? '',
    avatar: typeof metadata.avatar_url === 'string' ? metadata.avatar_url : undefined,
  };
}
