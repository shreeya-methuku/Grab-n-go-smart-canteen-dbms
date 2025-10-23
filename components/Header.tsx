import React from 'react';
import type { View, Student } from '../types';
import { ShieldCheckIcon, HomeIcon, LogoutIcon } from './Icon';

interface HeaderProps {
  user: Partial<Student> | { name: 'Admin' };
  setView: (view: View) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, setView, onLogout }) => {
  const isAdmin = user.name === 'Admin';
  
  const navItems = isAdmin ? 
    [{ id: 'admin', label: 'Dashboard', icon: <ShieldCheckIcon /> }] :
    [{ id: 'home', label: 'Canteens', icon: <HomeIcon /> }];

  return (
    <header className="bg-card/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
            </svg>
            <h1 className="text-xl font-bold text-text-primary hidden sm:block">Grab 'n Go</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-sm text-text-secondary hidden md:block">Welcome, {user.name}</span>
            <nav className="flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as View)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-text-secondary hover:bg-stone-100 hover:text-text-primary`}
                >
                  {item.icon}
                  <span className="hidden md:inline ml-2">{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="w-px h-6 bg-border hidden sm:block"></div>
            <button
              onClick={onLogout}
              className="flex items-center p-2 rounded-md text-sm font-medium transition-colors duration-200 text-red-500 hover:bg-red-50"
              title="Logout"
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};