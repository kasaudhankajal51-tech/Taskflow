import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Tasks from './components/Tasks';
import Team from './components/Team';
import { Screen, User } from './types';
import { api } from './api';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await api.get('/auth/me');
          setUser(userData);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'projects': return <Projects user={user} />;
      case 'tasks': return <Tasks user={user} />;
      case 'team': return <Team user={user} />;
      case 'profile': return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
           <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <span className="text-3xl font-bold">SJ</span>
           </div>
           <h2 className="text-2xl font-bold">Sarah Jenkins</h2>
           <p className="text-on-surface-variant">Profile view under construction.</p>
           <button 
             onClick={() => setActiveScreen('dashboard')}
             className="text-primary font-semibold hover:underline"
           >
             Return to Dashboard
           </button>
        </div>
      );
      default: return <Dashboard user={user} />;
    }
  };

  return (
    <Layout 
      activeScreen={activeScreen} 
      onScreenChange={setActiveScreen}
      user={user}
      onLogout={handleLogout}
    >
      {renderScreen()}
    </Layout>
  );
}

