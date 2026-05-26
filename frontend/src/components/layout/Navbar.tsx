import { Link } from 'react-router-dom';
import { LogOut, Menu, Moon, Sparkles, Sun, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

type NavbarProps = {
  onMenuClick: () => void;
};

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <nav className="top-nav sticky top-0 z-10 border-b shadow-2xl backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center">
            <button 
              onClick={onMenuClick}
              className="p-2 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white"
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>
            
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-cyan-300/30 bg-cyan-300/10">
                <Sparkles size={17} className="text-cyan-100" />
              </span>
              <span className="text-base font-black text-white sm:text-lg">AI Career Platform</span>
            </Link>
            
            <div className="hidden md:ml-8 md:flex md:h-16 md:items-center md:gap-1">
              <Link 
                to="/" 
                className="inline-flex h-10 items-center rounded-xl px-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-cyan-200"
              >
                Home
              </Link>
              <Link 
                to="/resume" 
                className="inline-flex h-10 items-center rounded-xl px-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-cyan-200"
              >
                Resume Analyzer
              </Link>
              <Link
                to="/resume-builder"
                className="inline-flex h-10 items-center rounded-xl px-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-cyan-200"
              >
                Builder
              </Link>
              <Link
                to="/learning"
                className="inline-flex h-10 items-center rounded-xl px-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-cyan-200"
              >
                Learning
              </Link>
              <Link
                to="/tasks"
                className="inline-flex h-10 items-center rounded-xl px-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-cyan-200"
              >
                Tasks
              </Link>
              <Link
                to="/interview"
                className="inline-flex h-10 items-center rounded-xl px-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-cyan-200"
              >
                Interview
              </Link>
              <Link 
                to="/coding" 
                className="inline-flex h-10 items-center rounded-xl px-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-cyan-200"
              >
                Coding Practice
              </Link>
            </div>
          </div>
          
          <div className="flex shrink-0 items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {isAuthenticated ? (
              <div className="relative ml-3">
                <div className="flex items-center space-x-3">
                  <Link to="/profile" className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-slate-200">{user?.name.split(' ')[0]}</span>
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="Profile" 
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-slate-400" />
                    )}
                  </Link>
                  <button 
                    onClick={() => void logout()}
                    className="p-2 rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-cyan-200"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 shadow-neon-cyan transition hover:bg-white"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
