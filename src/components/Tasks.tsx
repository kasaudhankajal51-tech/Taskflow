import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Calendar, AlertCircle, Clock, X, User as UserIcon, Check } from 'lucide-react';
import { Task, Project, User } from '../types';
import { api } from '../api';
import TaskDetailModal from './TaskDetailModal';

interface TasksProps {
  user: User;
}

export default function Tasks({ user }: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Task['status'] | 'All'>('All');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'Medium' as Task['priority'],
    status: 'Todo' as Task['status'],
    dueDate: '',
    assignee: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Update default projectId when projects are loaded
  useEffect(() => {
    if (projects.length > 0 && !newTask.projectId) {
      setNewTask(prev => ({ ...prev, projectId: projects[0]._id }));
    }
  }, [projects]);

  const fetchInitialData = async () => {
    try {
      const [tasksData, projectsData, usersData] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects'),
        api.get('/auth/users')
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
      setAllUsers(usersData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!newTask.projectId) {
      setError('Please select a project (stream) for this task.');
      return;
    }

    try {
      // Ensure we are sending IDs, not names
      const payload = {
        ...newTask,
        assignee: newTask.assignee || null
      };
      await api.post('/tasks', payload);
      setSuccess(true);
      setTimeout(() => {
        setShowCreateModal(false);
        setSuccess(false);
        setNewTask(prev => ({
          ...prev,
          title: '',
          description: '',
          dueDate: '',
          assignee: ''
        }));
        fetchInitialData();
      }, 1000);
    } catch (err: any) {
      const msg = err.message ? JSON.parse(err.message).message : 'Failed to create task';
      setError(msg);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const columns: { label: string; status: Task['status'] }[] = [
    { label: 'To Do', status: 'Todo' },
    { label: 'In Progress', status: 'In-Progress' },
    { label: 'Done', status: 'Completed' },
  ];

  const filteredColumns = filter === 'All' 
    ? columns 
    : columns.filter(c => c.status === filter);

  const filterButtons: (Task['status'] | 'All')[] = ['All', 'Todo', 'In-Progress', 'Completed'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold text-ink tracking-tighter leading-none mb-4">Operations</h1>
          <p className="text-on-surface-variant font-medium">Distributed task orchestration across organizational nodes.</p>
        </div>
        <button 
          onClick={() => { setError(''); setShowCreateModal(true); }}
          disabled={projects.length === 0}
          className="bg-ink text-white px-8 py-3.5 rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-ink/20 hover:bg-primary transition-all active:scale-95 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
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
              {btn === 'In-Progress' ? 'Progress' : (btn === 'Completed' ? 'Done' : btn)}
            </button>
          ))}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border border-dashed border-outline p-20 rounded-3xl text-center">
          <p className="text-on-surface-variant font-medium mb-6">You must be part of at least one project to manage tasks.</p>
          {user.role === 'Admin' && (
             <p className="text-xs text-on-surface-variant/60 uppercase tracking-widest font-bold">Go to Portfolios to initialize a stream.</p>
          )}
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-px bg-outline border border-outline overflow-hidden rounded-xl ${filter === 'All' ? 'md:grid-cols-3' : 'max-w-xl mx-auto'}`}>
          {filteredColumns.map((column) => (
            <div key={column.status} className="flex flex-col bg-slate-50/30">
              <div className="flex items-center justify-between p-6 border-b border-outline bg-white">
                <h2 className="text-[10px] font-bold text-on-surface uppercase tracking-[0.2em] flex items-center gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    column.status === 'Todo' ? 'bg-on-surface-variant' : 
                    column.status === 'In-Progress' ? 'bg-primary' : 'bg-success'
                  }`}></span>
                  {column.label}
                  <span className="text-[10px] font-mono text-on-surface-variant/40 ml-1">
                    [{tasks.filter(t => t.status === column.status).length.toString().padStart(2, '0')}]
                  </span>
                </h2>
              </div>

              <div className="flex flex-col p-4 gap-4">
                {tasks.filter(t => t.status === column.status).map((task, i) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleTaskClick(task)}
                    className={`bg-white p-6 group active:scale-[0.98] border border-outline hover:border-primary/30 transition-all cursor-pointer relative shadow-sm hover:shadow-xl hover:shadow-primary/5 ${
                      task.status === 'Completed' ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className={`text-sm font-bold text-ink leading-tight tracking-tight group-hover:text-primary transition-colors ${
                        task.status === 'Completed' ? 'line-through decoration-primary decoration-1' : ''
                      }`}>
                        {task.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-4">
                      <div className="flex items-center gap-2">
                        {task.assignee && (
                          <img 
                            src={task.assignee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee.name)}&background=random`} 
                            alt={task.assignee.name}
                            className="w-7 h-7 rounded-full border border-white object-cover grayscale group-hover:grayscale-0 transition-all"
                          />
                        )}
                        <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">
                          {typeof task.project === 'object' ? task.project.name : 'Stream'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase text-on-surface-variant/60">
                        <Clock className="w-3" />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <button 
                  onClick={() => setShowCreateModal(true)}
                  disabled={projects.length === 0}
                  className="w-full py-4 border border-dashed border-outline hover:border-primary/30 hover:bg-white transition-all flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary cursor-pointer mt-2 disabled:opacity-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Entry
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskDetailModal 
        task={selectedTask} 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchInitialData();
        }} 
      />

      {/* Create Task Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold tracking-tight">Initialize Task</h2>
                  <button onClick={() => setShowCreateModal(false)} className="text-on-surface-variant hover:text-ink">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-error font-medium">{error}</p>
                  </div>
                )}

                {success && (
                   <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-xl flex items-center gap-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <p className="text-sm text-success font-medium">Task successfully initialized.</p>
                  </div>
                )}

                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Title</label>
                    <input 
                      required
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-outline rounded-xl focus:border-primary outline-none transition-all font-medium"
                      placeholder="Task title (min 3 chars)..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Stream</label>
                      <select 
                        required
                        value={newTask.projectId}
                        onChange={(e) => setNewTask({...newTask, projectId: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-outline rounded-xl focus:border-primary outline-none transition-all font-medium"
                      >
                        {projects.map(p => (
                          <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Assignee</label>
                      <select 
                        value={newTask.assignee}
                        onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-outline rounded-xl focus:border-primary outline-none transition-all font-medium"
                      >
                        <option value="">Unassigned</option>
                        {allUsers.map(u => (
                          <option key={u.id || (u as any)._id} value={u.id || (u as any)._id}>{u.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Priority</label>
                      <select 
                        value={newTask.priority}
                        onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                        className="w-full px-4 py-3 bg-slate-50 border border-outline rounded-xl focus:border-primary outline-none transition-all font-medium"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Due Date</label>
                      <input 
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-outline rounded-xl focus:border-primary outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Description</label>
                    <textarea 
                      rows={3}
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-outline rounded-xl focus:border-primary outline-none transition-all font-medium resize-none"
                      placeholder="Detailed instructions..."
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={success}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all mt-4 disabled:opacity-50"
                  >
                    {success ? 'Initialized' : 'Confirm Task'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
