import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Task, Project, User } from '../types';
import { api } from '../api';
import TaskDetailModal from './TaskDetailModal';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, projectsData] = await Promise.all([
          api.get('/tasks'),
          api.get('/projects')
        ]);
        setTasks(tasksData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In-Progress').length;
  const todoTasks = tasks.filter(t => t.status === 'Todo').length;
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed').length;

  const stats = [
    { label: 'Total Tasks', value: tasks.length.toString(), icon: BarChart3, color: 'text-primary' },
    { label: 'Completed', value: completedTasks.toString(), icon: CheckCircle2, color: 'text-success' },
    { label: 'In Progress', value: inProgressTasks.toString(), icon: Clock, color: 'text-slate-400' },
    { label: 'Overdue', value: overdueTasks.toString(), icon: AlertCircle, color: 'text-error' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold text-ink tracking-tighter leading-none mb-4">Hello, {user.name.split(' ')[0]}</h1>
          <p className="text-on-surface-variant font-medium max-w-lg">Monitoring organizational velocity and resource allocation across distributed task flows.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-primary-soft px-4 py-2 rounded-lg border border-primary/10">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          Live Intelligence
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white border border-outline p-8 flex flex-col justify-between hover:bg-ink hover:text-white transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex justify-between items-start relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{stat.label}</span>
              <stat.icon className={`w-4 h-4 transition-colors ${stat.color} group-hover:text-white`} />
            </div>
            <div className="mt-12 relative z-10">
              <div className="text-5xl font-light tracking-tighter mb-2 font-sans">{stat.value}</div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-success group-hover:text-success/80">
                <TrendingUp className="w-3 h-3" />
                <span>Steady Velocity</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors"></div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Status Distribution */}
        <section className="lg:col-span-1 space-y-8">
          <div className="industrial-header">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            Resource Distribution
          </div>
          
          <div className="bg-white border border-outline p-10 flex flex-col items-center justify-center space-y-12">
            <div className="relative w-48 h-48">
               <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="16" fill="transparent" stroke="var(--color-outline)" strokeWidth="1.5" />
                <motion.circle 
                  cx="18" cy="18" r="16" fill="transparent" stroke="var(--color-primary)" strokeWidth="2.5" 
                  strokeDasharray={`${completionRate}, 100`} 
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${completionRate}, 100` }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-light tracking-tighter text-ink">{completionRate}%</span>
                <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-on-surface-variant">Complete</span>
              </div>
            </div>

            <div className="w-full space-y-6">
              {[
                { label: 'Completed', val: completedTasks, color: 'bg-primary' },
                { label: 'In Progress', val: inProgressTasks, color: 'bg-slate-300' },
                { label: 'To Do', val: todoTasks, color: 'bg-slate-100' },
                { label: 'Overdue', val: overdueTasks, color: 'bg-error' }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-3 ${item.color} rounded-full transition-all group-hover:h-5`}></div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant group-hover:text-ink">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold font-mono tracking-tighter">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* High Priority Alerts */}
        <section className="lg:col-span-2 space-y-8">
          <div className="industrial-header justify-between">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse"></span>
              Immediate Attention
            </div>
            <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary-soft px-3 py-1.5 rounded transition-colors border border-transparent hover:border-primary/10">
              Audit Full Stack
            </button>
          </div>

          <div className="space-y-px bg-outline border border-outline">
            {tasks.filter(t => (t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed') || t.priority === 'High').slice(0, 5).map((task) => (
              <div 
                key={task._id}
                onClick={() => handleTaskClick(task)}
                className="flex items-center justify-between p-6 bg-white hover:bg-slate-50 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-10 h-10 flex items-center justify-center border ${task.priority === 'High' ? 'border-error/20 bg-error-soft text-error' : 'border-outline bg-surface text-primary'}`}>
                    {task.priority === 'High' ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-ink text-sm tracking-tight group-hover:text-primary transition-colors">{task.title}</h4>
                    <p className="text-[10px] uppercase font-bold tracking-[0.15em] text-on-surface-variant mt-1.5 flex items-center gap-2">
                       <Calendar className="w-3 h-3" />
                       Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  {task.assignee && (
                    <img 
                      src={task.assignee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee.name)}&background=random`} 
                      alt={task.assignee.name}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm group-hover:border-primary transition-colors"
                    />
                  )}
                  <div className="w-8 h-8 rounded-full border border-outline flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:border-primary transition-all">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="p-12 text-center bg-white">
                <p className="text-on-surface-variant font-medium">No tasks found. Initialize your first task to see insights.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <TaskDetailModal 
        task={selectedTask} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
