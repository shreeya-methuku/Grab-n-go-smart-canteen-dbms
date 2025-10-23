import React, { useState } from 'react';
import { Header } from './components/Header';
import { MenuPage } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CanteenSelectionPage } from './components/HomeDashboard';
import { LoginSelector } from './components/LoginSelector';
import { LoginPage } from './components/LoginPage';
import type { View, Student, Canteen } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>('loginSelector');
  const [user, setUser] = useState<Partial<Student> | null>(null);
  const [selectedCanteen, setSelectedCanteen] = useState<Canteen | null>(null);

  const handleRoleSelect = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setView('studentLogin');
    } else {
      setUser({ name: 'Admin' });
      setView('admin');
    }
  };

  const handleLogin = (details: Omit<Student, 'student_id' | 'address_id' | 'age' | 'dob'>) => {
    setUser({ ...details, student_id: 1 }); // Mock user
    setView('canteenSelector');
  };

  const handleSelectCanteen = (canteen: Canteen) => {
    setSelectedCanteen(canteen);
    setView('menu');
  };
  
  const handleSetView = (newView: View) => {
    if (newView === 'home') {
      setView('canteenSelector');
    } else {
      setView(newView);
    }
  }

  const handleLogout = () => {
    setUser(null);
    setSelectedCanteen(null);
    setView('loginSelector');
  };

  const renderView = () => {
    switch (view) {
      case 'loginSelector':
        return <LoginSelector onSelect={handleRoleSelect} />;
      case 'studentLogin':
        return <LoginPage onLogin={handleLogin} onBack={() => setView('loginSelector')}/>;
      case 'admin':
        return <AdminDashboard />;
      case 'canteenSelector':
        return <CanteenSelectionPage onSelectCanteen={handleSelectCanteen} />;
      case 'menu':
        if (selectedCanteen) {
          return <MenuPage canteen={selectedCanteen} />;
        }
        // Fallback if no canteen is selected
        setView('canteenSelector');
        return <CanteenSelectionPage onSelectCanteen={handleSelectCanteen} />;
      default:
        return <LoginSelector onSelect={handleRoleSelect} />;
    }
  };

  const showHeader = user && (view === 'canteenSelector' || view === 'menu' || view === 'admin');
  const isFullScreenView = view === 'loginSelector' || view === 'studentLogin';

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans" style={{backgroundImage: `radial-gradient(#e7e5e4 1px, transparent 1px)`, backgroundSize: '1.5rem 1.5rem'}}>
      {showHeader && <Header user={user} setView={handleSetView} onLogout={handleLogout} />}
      <main key={view} className={`${isFullScreenView ? '' : 'container mx-auto p-4 sm:p-6 lg:p-8'}`}>
        {renderView()}
      </main>
    </div>
  );
};

export default App;