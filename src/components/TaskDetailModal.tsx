import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, AlignLeft, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Task } from '../types';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl pointer-events-auto overflow-hidden border border-outline flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-outline flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    task.status === 'Done' ? 'bg-success-soft text-success' : 
                    task.isOverdue ? 'bg-error-soft text-error' : 'bg-primary-soft text-primary'
                  }`}>
                    {task.status === 'Done' ? <CheckCircle2 className="w-5 h-5" /> : 
                     task.isOverdue ? <AlertTriangle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Task Detail</span>
                    <h2 className="text-sm font-bold text-on-surface uppercase tracking-tight">ID-{task.id.toUpperCase()}</h2>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-outline"
                >
                  <X className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                <section className="space-y-3">
                  <h1 className="text-2xl font-bold tracking-tight text-on-surface leading-tight">
                    {task.title}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                      task.status === 'Done' ? 'bg-success-soft text-success border-success/10' :
                      task.status === 'In Progress' ? 'bg-primary-soft text-primary border-primary/10' :
                      'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {task.status}
                    </span>
                    {task.isOverdue && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-error-soft text-error border border-error/10">
                        Overdue
                      </span>
                    )}
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <Calendar className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Due Date</span>
                    </div>
                    <p className={`text-sm font-bold ${task.isOverdue ? 'text-error' : 'text-on-surface'}`}>
                      {task.dueDate}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <User className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Assignees</span>
                    </div>
                    <div className="flex -space-x-2">
                      {task.assignees.map((a, i) => (
                        <div key={i} className="group relative">
                          <img 
                            src={a.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=random`} 
                            alt={a.name}
                            className="w-8 h-8 rounded-full border-2 border-white object-cover"
                          />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-on-surface text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {a.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <section className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <AlignLeft className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Description</span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
                    {task.description || "No detailed description provided for this task."}
                  </p>
                </section>
              </div>

              {/* Footer Actions */}
              <div className="p-6 bg-slate-50/50 border-t border-outline flex gap-3">
                <button className="flex-1 bg-white border border-outline hover:border-primary text-on-surface font-bold text-xs py-3 rounded-xl transition-all uppercase tracking-widest">
                  Edit Task
                </button>
                <button className="flex-1 bg-primary text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all uppercase tracking-widest">
                  Mark as {task.status === 'Done' ? 'Active' : 'Complete'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
