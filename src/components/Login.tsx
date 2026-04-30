import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckSquare, 
  Mail, 
  Lock, 
  ArrowRight,
  Building2,
  AlertCircle
} from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden font-sans antialiased">
      {/* Left Pane: Branding & Visuals */}
      <div className="hidden md:flex flex-1 bg-on-surface p-12 lg:p-20 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">TaskFlow</span>
        </div>

        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-[0.88] mb-8"
          >
            Tactical <br /> Velocity.
          </motion.h1>
          <p className="text-white/50 text-xl font-medium max-w-md leading-relaxed">
            The institutional-grade platform for modern team orchestration and high-fidelity task management.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-white text-2xl font-light tracking-tighter">1.2k+</span>
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Teams Managed</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-2xl font-light tracking-tighter">99.9%</span>
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Uptime Reliable</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 -right-20 w-96 h-96 bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Right Pane: Form */}
      <div className="flex-[0.8] flex flex-col items-center justify-center p-8 md:p-12 bg-slate-50/30 overflow-y-auto">
        <div className="w-full max-w-sm space-y-10">
          <header className="space-y-3">
            <div className="md:hidden flex items-center gap-2 mb-8">
               <div className="bg-primary p-2 rounded-lg">
                <CheckSquare className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">TaskFlow</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface">Welcome back</h2>
            <p className="text-on-surface-variant font-medium text-sm">Enter your credentials to access your workspace.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Work Email</label>
                <div className="relative group focus-within:ring-2 focus-within:ring-primary/10 rounded-xl transition-all">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant transition-colors group-focus-within:text-primary" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-outline rounded-xl focus:border-primary transition-all text-sm font-medium placeholder:text-on-surface-variant/40 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
                  <button type="button" className="text-[10px] font-bold text-primary hover:underline">Forgot?</button>
                </div>
                <div className="relative group focus-within:ring-2 focus-within:ring-primary/10 rounded-xl transition-all">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant transition-colors group-focus-within:text-primary" />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-outline rounded-xl focus:border-primary transition-all text-sm font-medium placeholder:text-on-surface-variant/40 outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:shadow-2xl hover:bg-primary-container transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Access Workspace'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-50/50 px-4 text-on-surface-variant font-bold uppercase tracking-widest text-[9px]">Trusted Identity</span>
            </div>
          </div>

          <p className="text-center text-xs text-on-surface-variant font-medium">
            New to TaskFlow? <button className="text-primary font-bold hover:underline">Create an organization</button>
          </p>
        </div>
      </div>
    </div>
  );
}
