import React from 'react';
import { motion } from 'motion/react';
import { Search, Send, UserMinus, Shield, ShieldCheck } from 'lucide-react';
import { MOCK_USERS } from '../types';

export default function Team() {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-bold text-on-surface tracking-tight">Team</h1>
        <p className="text-on-surface-variant mt-2 font-medium">Manage institutional access and seat allocation.</p>
      </header>

      <div className="card-premium p-8 space-y-8">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface">Invite Member</h2>
          <p className="text-[11px] text-on-surface-variant mt-1 font-medium">Provision new accounts via secure email invitation.</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-6 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Work Email</label>
            <div className="relative group">
               <Send className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant transition-colors group-focus-within:text-primary" />
               <input 
                type="email" 
                placeholder="colleague@company.com" 
                className="w-full bg-slate-50 border border-outline rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none placeholder:text-on-surface-variant/40"
              />
            </div>
          </div>
          <div className="md:col-span-3 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Access Level</label>
            <select className="w-full bg-slate-50 border border-outline rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none appearance-none cursor-pointer">
              <option value="member">Contributor</option>
              <option value="admin">Principal</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <button 
              type="button" 
              className="w-full bg-primary text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-95 uppercase tracking-widest"
            >
              Dispatch
            </button>
          </div>
        </form>
      </div>

      <section className="card-premium overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between p-8 border-b border-outline bg-slate-50/30 gap-6">
          <h3 className="text-xs font-bold text-on-surface uppercase tracking-[0.2em]">Roster ({MOCK_USERS.length})</h3>
          <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4 transition-colors group-focus-within:text-primary" />
            <input 
              type="text" 
              placeholder="Search directory..." 
              className="w-full bg-white border border-outline rounded-full pl-11 pr-4 py-2.5 text-xs font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none placeholder:text-on-surface-variant/40"
            />
          </div>
        </div>

        <div className="divide-y divide-outline">
          {MOCK_USERS.map((user, i) => (
            <motion.div 
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-8 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-6 flex-1">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-outline"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-primary p-[1px] shadow-sm">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-primary font-bold text-sm tracking-tighter">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-on-surface text-sm">{user.name}</span>
                  <span className="text-xs text-on-surface-variant font-medium mt-0.5">{user.email}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${
                  user.role === 'Admin' 
                    ? 'bg-primary-soft text-primary border-primary/10' 
                    : 'bg-white text-on-surface-variant border-outline'
                }`}>
                  {user.role === 'Admin' ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                  {user.role}
                </div>
                
                <button 
                  className="text-on-surface-variant hover:text-error transition-colors p-2 rounded-xl hover:bg-error-soft opacity-0 group-hover:opacity-100 border border-transparent hover:border-error/10"
                  title="Revoke Access"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
