import React, { useState } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Tasks from './components/Tasks';
import Team from './components/Team';
import { Screen } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard': return <Dashboard />;
      case 'projects': return <Projects />;
      case 'tasks': return <Tasks />;
      case 'team': return <Team />;
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
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeScreen={activeScreen} onScreenChange={setActiveScreen}>
      {renderScreen()}
    </Layout>
  );
}

