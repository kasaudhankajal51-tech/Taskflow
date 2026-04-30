import React from 'react';
import { motion } from 'motion/react';
import { Plus, Search, ChevronRight, ListChecks } from 'lucide-react';
import { MOCK_PROJECTS } from '../types';

export default function Projects() {
  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold text-ink tracking-tighter leading-none mb-4">Portfolios</h1>
          <p className="text-on-surface-variant font-medium">Strategic orchestration of concurrent high-fidelity workstreams.</p>
        </div>
        <button className="bg-ink text-white px-8 py-3.5 rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-ink/20 hover:bg-primary transition-all active:scale-95 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Initialize Stream
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-outline border border-outline overflow-hidden rounded-xl">
        {MOCK_PROJECTS.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white p-8 hover:bg-slate-50 transition-all duration-300 relative cursor-pointer flex flex-col h-full"
          >
            <div className="flex justify-between items-start gap-4 mb-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">ID-00{i+1}</span>
              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                project.status === 'On Track' ? 'bg-success-soft text-success' : 'bg-error-soft text-error'
              }`}>
                {project.status}
              </span>
            </div>

            <h3 className="text-xl font-bold text-ink tracking-tight group-hover:text-primary transition-colors mb-4 line-clamp-1">{project.title}</h3>
            
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-12 flex-1 line-clamp-3">
              {project.description}
            </p>

            <div className="space-y-6 pt-6 border-t border-slate-50">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <span>Stream Velocity</span>
                <span className="text-ink font-mono">{Math.round((project.tasksCompleted / project.totalTasks) * 100 || 0)}%</span>
              </div>
              
              <div className="h-0.5 w-full bg-outline relative overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(project.tasksCompleted / project.totalTasks) * 100 || 0}%` }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="absolute inset-y-0 left-0 bg-primary group-hover:bg-ink transition-colors"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex -space-x-1.5">
                  {project.members.map((member, idx) => (
                    <img 
                      key={idx}
                      src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`} 
                      alt={member.name}
                      className="w-7 h-7 rounded-full border border-white object-cover shadow-sm grayscale group-hover:grayscale-0 transition-all"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant group-hover:text-primary">Inspect</span>
                  <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
