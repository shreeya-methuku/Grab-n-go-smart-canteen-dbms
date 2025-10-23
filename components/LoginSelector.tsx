import React from 'react';
import { Card } from './Card';
import { UserIcon, ShieldCheckIcon } from './Icon';

interface LoginSelectorProps {
  onSelect: (role: 'student' | 'admin') => void;
}

export const LoginSelector: React.FC<LoginSelectorProps> = ({ onSelect }) => {
  return (
    <div 
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4"
        style={{backgroundImage: "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto-format&fit=crop')"}}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative text-center max-w-4xl mx-auto animate-fade-in-up">
        <div className="flex justify-center items-center space-x-4 mb-4">
            <svg className="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
            </svg>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight animate-text-gradient">Welcome to Grab 'n Go</h1>
        </div>
        <p className="mt-2 text-lg text-stone-200 max-w-2xl mx-auto">
          The easiest way to order food on campus. Please select your role to continue.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card
            title="I'm a Student"
            icon={<UserIcon large />}
            description="Browse menus, place orders, and give feedback."
            onClick={() => onSelect('student')}
            className="text-center p-8 bg-card/90 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20"
          />
          <Card
            title="I'm an Administrator"
            icon={<ShieldCheckIcon large />}
            description="Manage stock, view sales, and respond to feedback."
            onClick={() => onSelect('admin')}
            className="text-center p-8 bg-card/90 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20"
          />
        </div>
      </div>
    </div>
  );
};