import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  User as UserIcon,
  Bell,
  Search,
  Plus
} from 'lucide-react';
import { CURRENT_USER, Screen } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

export default function Layout({ children, activeScreen, onScreenChange }: LayoutProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row font-sans">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-outline bg-white sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-on-surface">TaskFlow</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onScreenChange(item.id as Screen)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-semibold group ${
                activeScreen === item.id 
                  ? 'bg-primary/5 text-primary' 
                  : 'text-on-surface-variant hover:bg-slate-50 hover:text-on-surface'
              }`}
            >
              <item.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                activeScreen === item.id ? 'text-primary' : 'text-slate-400'
              }`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-outline">
          <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-outline bg-surface hover:bg-white hover:shadow-sm transition-all group">
            <div className="relative">
              <img 
                src={CURRENT_USER.avatar} 
                alt={CURRENT_USER.name} 
                className="w-9 h-9 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-white"></span>
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="font-bold text-xs text-on-surface truncate">{CURRENT_USER.name}</span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant truncate">{CURRENT_USER.role}</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-surface relative grid-pattern">
        {/* Top Header */}
        <header className="sticky top-0 z-40 glass h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 md:hidden">
            <div className="bg-ink p-1.5 rounded-lg shadow-lg shadow-ink/10">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-ink">TaskFlow</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-2.5 bg-surface border border-outline px-4 py-2 rounded-lg w-80 group focus-within:w-96 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-primary/5 transition-all outline-none">
            <Search className="w-4 h-4 text-on-surface-variant group-focus-within:text-primary" />
            <input 
              type="text" 
              placeholder="Command + K to search..." 
              className="bg-transparent border-none text-[11px] font-bold uppercase tracking-wider focus:ring-0 w-full placeholder:text-on-surface-variant/60"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-outline transition-all relative">
              <Bell className="w-5 h-5 text-on-surface-variant" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-white"></span>
            </button>
            <div className="h-6 w-[1px] bg-outline mx-1 hidden md:block"></div>
            <button 
              onClick={() => onScreenChange('profile')}
              className="p-0.5 rounded-full border border-outline hover:border-primary transition-all hidden md:block overflow-hidden"
            >
              <img 
                src={CURRENT_USER.avatar} 
                alt="Account" 
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-6 md:p-12 max-w-7xl mx-auto w-full pb-28 md:pb-12 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-on-surface text-white rounded-2xl h-16 flex justify-around items-center z-50 shadow-2xl px-4">
        {navItems.filter(i => i.id !== 'profile').map((item) => (
          <button
            key={item.id}
            onClick={() => onScreenChange(item.id as Screen)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeScreen === item.id ? 'text-white' : 'text-white/40'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeScreen === item.id ? 'scale-110' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
