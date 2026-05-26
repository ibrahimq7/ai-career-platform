import { Link, useLocation } from 'react-router-dom';
import { Award, BarChart, BookOpen, CheckSquare, ChevronLeft, ChevronRight, Code, FileEdit, FileText, Home, Mic, Sparkles, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type SidebarProps = {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
};

const Sidebar = ({ isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Resume Analyzer', path: '/resume', icon: <FileText size={20} /> },
    { name: 'Resume Builder', path: '/resume-builder', icon: <FileEdit size={20} /> },
    { name: 'Learning Hub', path: '/learning', icon: <BookOpen size={20} /> },
    { name: 'Task Manager', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Interview Prep', path: '/interview', icon: <Mic size={20} /> },
    { name: 'Coding Practice', path: '/coding', icon: <Code size={20} /> },
    { name: 'My Progress', path: '/profile', icon: <BarChart size={20} /> },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/80 backdrop-blur-xl md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`side-nav fixed inset-y-0 left-0 z-30 w-64 border-r backdrop-blur-xl shadow-2xl transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'md:w-20' : 'md:w-64'} md:translate-x-0 md:relative md:z-0`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-cyan/20 via-neon-purple/20 to-neon-pink/20 animate-gradient"></div>
                <div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-black/80 border border-white/10 backdrop-blur">
                  <Sparkles size={17} className="text-cyan-100 animate-bounce-subtle" />
                </div>
              </div>
              <span className={`text-sm font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-pink transition-opacity ${isCollapsed ? 'md:hidden' : ''}`}>
                AI Career Platform
              </span>
            </Link>
            <button
              onClick={onToggleCollapse}
              className="hidden rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white md:inline-flex"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white md:hidden transition-all duration-300 hover:shadow-neon-cyan/20"
            >
              <X size={20} className="animate-bounce-subtle" />
            </button>
          </div>

          {isAuthenticated && (
            <div className="p-4 border-b border-white/10">
              <div className={`flex items-center ${isCollapsed ? 'md:justify-center' : 'space-x-3'}`}>
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="h-10 w-10 rounded-full object-cover border-2 border-white/20 hover:animate-pulse transition-all duration-300"
                  />
                ) : (
                  <div className="relative h-10 w-10 flex items-center justify-center bg-gradient-to-br from-neon-cyan/20 via-neon-purple/20 to-neon-pink/20 rounded-full">
                    <User size={20} className="text-slate-400" />
                  </div>
                )}
                <div className={isCollapsed ? 'md:hidden' : ''}>
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
              <div className={`mt-3 flex items-center justify-between ${isCollapsed ? 'md:hidden' : ''}`}>
                <div className="flex items-center">
                  <Award size={16} className="text-fuchsia-300" />
                  <span className="ml-1 text-xs text-slate-400">Streak: 3 days</span>
                </div>
                <div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-300/10 text-emerald-200">Pro</span>
                </div>
              </div>
            </div>
          )}

          <nav className={`flex-1 space-y-1 overflow-y-auto ${isCollapsed ? 'p-3' : 'p-4'}`}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center rounded-xl py-3 text-sm font-medium transition-all duration-300 ${
                  isCollapsed ? 'justify-center px-3' : 'px-4'
                } ${
                  location.pathname === item.path
                    ? 'bg-white/10 text-cyan-200 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.18)] hover:bg-white/20'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white hover:shadow-neon-cyan/20'
                }`}
              >
                <span className={`${isCollapsed ? '' : 'mr-4'} flex-shrink-0`}>{item.icon}</span>
                <span className={isCollapsed ? 'md:hidden' : ''}>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
