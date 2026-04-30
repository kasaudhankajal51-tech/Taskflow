import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, MoreHorizontal, Calendar, AlertTriangle, CheckCircle2, Filter, Clock } from 'lucide-react';
import { MOCK_TASKS, Task } from '../types';
import TaskDetailModal from './TaskDetailModal';

export default function Tasks() {
  const [filter, setFilter] = useState<Task['status'] | 'All'>('All');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const columns: { label: string; status: Task['status'] }[] = [
    { label: 'To Do', status: 'To Do' },
    { label: 'In Progress', status: 'In Progress' },
    { label: 'Done', status: 'Done' },
  ];

  const filteredColumns = filter === 'All' 
    ? columns 
    : columns.filter(c => c.status === filter);

  const filterButtons: (Task['status'] | 'All')[] = ['All', 'To Do', 'In Progress', 'Done'];

  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold text-ink tracking-tighter leading-none mb-4">Operations</h1>
          <p className="text-on-surface-variant font-medium">Distributed task orchestration across organizational nodes.</p>
        </div>
        <button className="bg-ink text-white px-8 py-3.5 rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-ink/20 hover:bg-primary transition-all active:scale-95 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Initialize Task
        </button>
      </header>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-1 p-1 rounded-lg border border-outline bg-white shadow-sm">
          {filterButtons.map((btn) => (
            <button
              key={btn}
              onClick={() => setFilter(btn)}
              className={`px-6 py-2 rounded font-bold text-[10px] uppercase tracking-[0.15em] transition-all whitespace-nowrap ${
                filter === btn
                  ? 'bg-ink text-white shadow-xl shadow-ink/10'
                  : 'text-on-surface-variant hover:text-ink bg-transparent hover:bg-slate-50'
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-px bg-outline border border-outline overflow-hidden rounded-xl ${filter === 'All' ? 'md:grid-cols-3' : 'max-w-xl mx-auto'}`}>
        {filteredColumns.map((column) => (
          <div key={column.status} className="flex flex-col bg-slate-50/30">
            <div className="flex items-center justify-between p-6 border-b border-outline bg-white">
              <h2 className="text-[10px] font-bold text-on-surface uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                {column.label}
                <span className="text-[10px] font-mono text-on-surface-variant/40 ml-1">
                  [{MOCK_TASKS.filter(t => t.status === column.status).length.toString().padStart(2, '0')}]
                </span>
              </h2>
            </div>

            <div className="flex flex-col p-4 gap-4">
              {MOCK_TASKS.filter(t => t.status === column.status).map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleTaskClick(task)}
                  className={`bg-white p-6 group active:scale-[0.98] border border-outline hover:border-primary/30 transition-all cursor-pointer relative shadow-sm hover:shadow-xl hover:shadow-primary/5 ${
                    task.status === 'Done' ? 'opacity-70' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-sm font-bold text-ink leading-tight tracking-tight group-hover:text-primary transition-colors ${
                      task.status === 'Done' ? 'line-through decoration-primary decoration-1' : ''
                    }`}>
                      {task.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-4">
                    <div className="flex -space-x-1">
                      {task.assignees.map((a, idx) => (
                        <img 
                          key={idx}
                          src={a.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=random`} 
                          alt={a.name}
                          className="w-7 h-7 rounded-full border border-white object-cover grayscale group-hover:grayscale-0 transition-all"
                        />
                      ))}
                    </div>
                    
                    <div className={`flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase ${
                      task.isOverdue ? 'text-error' : 'text-on-surface-variant/60'
                    }`}>
                      {task.isOverdue ? <AlertTriangle className="w-3" /> : <Clock className="w-3" />}
                      {task.dueDate}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <button className="w-full py-4 border border-dashed border-outline hover:border-primary/30 hover:bg-white transition-all flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary cursor-pointer mt-2">
                <Plus className="w-3.5 h-3.5" />
                New Entry
              </button>
            </div>
          </div>
        ))}
      </div>

      <TaskDetailModal 
        task={selectedTask} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
