import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, ChevronRight, X, AlertCircle, Trash2, Users } from 'lucide-react';
import { Project, User } from '../types';
import { api } from '../api';

interface ProjectsProps {
  user: User;
}

export default function Projects({ user }: ProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', members: [] as string[] });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [projectsData, usersData] = await Promise.all([
        api.get('/projects'),
        api.get('/auth/users')
      ]);
      setProjects(projectsData);
      setAllUsers(usersData);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '', members: [] });
      fetchInitialData();
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('WARNING: Deleting this stream will also delete all associated tasks. Continue?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchInitialData();
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Only the project owner can delete this stream.');
    }
  };

  const toggleMember = (userId: string) => {
    setNewProject(prev => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId]
    }));
  };

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
          <h1 className="text-5xl font-bold text-ink tracking-tighter leading-none mb-4">Portfolios</h1>
          <p className="text-on-surface-variant font-medium">Strategic orchestration of concurrent high-fidelity workstreams.</p>
        </div>
        {user.role === 'Admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-ink text-white px-8 py-3.5 rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-ink/20 hover:bg-primary transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Initialize Stream
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-outline border border-outline overflow-hidden rounded-xl">
        {projects.map((project, i) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white p-8 hover:bg-slate-50 transition-all duration-300 relative cursor-pointer flex flex-col h-full"
          >
            <div className="flex justify-between items-start gap-4 mb-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">ID-{project._id.slice(-4).toUpperCase()}</span>
              <div className="flex items-center gap-2">
                {user.role === 'Admin' && project.owner._id === user.id && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteProject(project._id); }}
                    className="p-1.5 hover:bg-error/10 text-error/40 hover:text-error rounded transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-success-soft text-success">
                  Active
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-ink tracking-tight group-hover:text-primary transition-colors mb-4 line-clamp-1">{project.name}</h3>
            
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-12 flex-1 line-clamp-3">
              {project.description}
            </p>

            <div className="space-y-6 pt-6 border-t border-slate-50">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <span>Owner</span>
                <span className="text-ink font-mono">{project.owner.name}</span>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex -space-x-1.5">
                  <img 
                    src={project.owner.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.owner.name)}&background=random`} 
                    alt={project.owner.name}
                    className="w-7 h-7 rounded-full border border-white object-cover shadow-sm grayscale group-hover:grayscale-0 transition-all"
                  />
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

      {/* Create Project Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 overflow-y-auto max-h-[85vh]">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold tracking-tight">Initialize Stream</h2>
                  <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-ink">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-error font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleCreateProject} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Stream Name</label>
                    <input 
                      required
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-outline rounded-xl focus:border-primary outline-none transition-all font-medium"
                      placeholder="e.g. Q4 Growth Initiative"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Description</label>
                    <textarea 
                      required
                      rows={3}
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-outline rounded-xl focus:border-primary outline-none transition-all font-medium resize-none"
                      placeholder="Strategic objectives and KPIs..."
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      Assign Stream Members
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {allUsers.filter(u => u.id !== user.id).map(u => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => toggleMember(u.id)}
                          className={`flex items-center gap-3 p-2 rounded-xl border transition-all text-left ${
                            newProject.members.includes(u.id)
                              ? 'bg-primary/5 border-primary text-primary'
                              : 'bg-white border-outline hover:border-slate-300'
                          }`}
                        >
                          <img 
                            src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`} 
                            className="w-6 h-6 rounded-full"
                            alt=""
                          />
                          <span className="text-xs font-bold truncate">{u.name.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    disabled={isCreating}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {isCreating ? 'Provisioning...' : 'Confirm Initialization'}
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
