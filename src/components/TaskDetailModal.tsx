import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, AlignLeft, CheckCircle2, Clock, AlertTriangle, Trash2, Edit2, Check } from 'lucide-react';
import { Task, User as UserType } from '../types';
import { api } from '../api';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

  useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        assignee: task.assignee
      });
      fetchUsers();
    }
  }, [task]);

  const fetchUsers = async () => {
    try {
      const users = await api.get('/auth/users');
      setAllUsers(users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  if (!task) return null;

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const payload = {
        ...editedTask,
        assignee: (editedTask.assignee as any)?.id || editedTask.assignee || null
      };
      await api.patch(`/tasks/${task._id}`, payload);
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: Task['status']) => {
    setLoading(true);
    try {
      await api.patch(`/tasks/${task._id}`, { status: newStatus });
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setLoading(true);
    try {
      await api.delete(`/tasks/${task._id}`);
      onClose();
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[100]"
          />
          
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl pointer-events-auto overflow-hidden border border-outline flex flex-col"
            >
              <div className="p-6 border-b border-outline flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    task.status === 'Completed' ? 'bg-success-soft text-success' : 'bg-primary-soft text-primary'
                  }`}>
                    {task.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {isEditing ? 'Editing Task' : 'Task Detail'}
                    </span>
                    <h2 className="text-sm font-bold text-on-surface uppercase tracking-tight">ID-{task._id.slice(-4).toUpperCase()}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`p-2 rounded-xl transition-all ${isEditing ? 'bg-primary text-white' : 'hover:bg-slate-100 text-on-surface-variant'}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleDeleteTask}
                    className="p-2 hover:bg-error/10 rounded-xl transition-all text-error/60 hover:text-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-outline"
                  >
                    <X className="w-4 h-4 text-on-surface-variant" />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                <section className="space-y-3">
                  {isEditing ? (
                    <input 
                      value={editedTask.title}
                      onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                      className="text-2xl font-bold tracking-tight text-on-surface leading-tight w-full bg-slate-50 border border-outline rounded-xl px-4 py-2 outline-none focus:border-primary"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold tracking-tight text-on-surface leading-tight">
                      {task.title}
                    </h1>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                      task.status === 'Completed' ? 'bg-success-soft text-success border-success/10' :
                      task.status === 'In-Progress' ? 'bg-primary-soft text-primary border-primary/10' :
                      'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {task.status}
                    </span>
                    {isEditing ? (
                      <select 
                        value={editedTask.priority}
                        onChange={(e) => setEditedTask({...editedTask, priority: e.target.value as any})}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-slate-50 border border-outline outline-none"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200">
                        {task.priority} Priority
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
                    {isEditing ? (
                      <input 
                        type="date"
                        value={editedTask.dueDate}
                        onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
                        className="text-xs font-bold bg-slate-50 border border-outline rounded-lg px-3 py-1.5 outline-none w-full"
                      />
                    ) : (
                      <p className="text-sm font-bold text-on-surface">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date set'}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <User className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Assignee</span>
                    </div>
                    {isEditing ? (
                      <select 
                        value={(editedTask.assignee as any)?.id || (editedTask.assignee as any) || ''}
                        onChange={(e) => setEditedTask({...editedTask, assignee: e.target.value})}
                        className="text-xs font-bold bg-slate-50 border border-outline rounded-lg px-3 py-1.5 outline-none w-full"
                      >
                        <option value="">Unassigned</option>
                        {allUsers.map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    ) : (
                      task.assignee ? (
                        <div className="flex items-center gap-2">
                          <img 
                            src={task.assignee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee.name)}&background=random`} 
                            alt={task.assignee.name}
                            className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                          />
                          <span className="text-xs font-bold text-on-surface">{task.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-on-surface-variant">Unassigned</span>
                      )
                    )}
                  </div>
                </div>

                <section className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <AlignLeft className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Description</span>
                  </div>
                  {isEditing ? (
                    <textarea 
                      value={editedTask.description}
                      onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                      className="text-sm font-medium w-full bg-slate-50 border border-outline rounded-xl px-4 py-3 outline-none focus:border-primary resize-none"
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
                      {task.description || "No detailed description provided for this task."}
                    </p>
                  )}
                </section>
              </div>

              <div className="p-6 bg-slate-50/50 border-t border-outline flex gap-3">
                {isEditing ? (
                  <button 
                    disabled={loading}
                    onClick={handleUpdate}
                    className="flex-1 bg-primary text-white font-bold text-[10px] py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    Save Changes
                  </button>
                ) : (
                  <>
                    {task.status !== 'Todo' && (
                      <button 
                        disabled={loading}
                        onClick={() => handleUpdateStatus('Todo')}
                        className="flex-1 bg-white border border-outline hover:border-primary text-on-surface font-bold text-[10px] py-3 rounded-xl transition-all uppercase tracking-widest disabled:opacity-50"
                      >
                        Move to Todo
                      </button>
                    )}
                    {task.status !== 'In-Progress' && (
                      <button 
                        disabled={loading}
                        onClick={() => handleUpdateStatus('In-Progress')}
                        className="flex-1 bg-white border border-outline hover:border-primary text-on-surface font-bold text-[10px] py-3 rounded-xl transition-all uppercase tracking-widest disabled:opacity-50"
                      >
                        In Progress
                      </button>
                    )}
                    {task.status !== 'Completed' && (
                      <button 
                        disabled={loading}
                        onClick={() => handleUpdateStatus('Completed')}
                        className="flex-1 bg-primary text-white font-bold text-[10px] py-3 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all uppercase tracking-widest disabled:opacity-50"
                      >
                        Complete Task
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
