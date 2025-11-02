import React, { useState } from 'react';
import type { Student } from '../types';
import { Card } from './Card';

// --- FIXED: FormField is now defined outside of LoginPage ---
// This prevents it from being re-created on every render.
const FormField: React.FC<{
  label: string;
  type: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}> = ({ label, type, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-3 bg-stone-100 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
    />
  </div>
);

interface LoginPageProps {
  onLogin: (details: Omit<Student, 'student_id' | 'address_id' | 'age' | 'dob'>) => void;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
  const [name, setName] = useState('');
  const [srn, setSrn] = useState('');
  const [email, setEmail] = useState('');
  const [semester, setSemester] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !srn || !email || !semester) {
      setError('All fields are required.');
      return;
    }
    setError('');
    onLogin({ 
      name, 
      srn, 
      email, 
      semester: parseInt(semester, 10),
      department: 'CSE', // Mock data
      phone: '1234567890' // Mock data
    });
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{backgroundImage: "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop')"}}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative w-full max-w-md animate-fade-in-up">
        <Card title="Student Login" className="bg-card/95">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Full Name" type="text" value={name} onChange={setName} placeholder="e.g., Rohan Sharma" />
            <FormField label="SRN (Student Registration No.)" type="text" value={srn} onChange={setSrn} placeholder="e.g., PES1UG21CS001" />
            <FormField label="Email" type="email" value={email} onChange={setEmail} placeholder="e.g., rohan@example.com" />
            <FormField label="Semester" type="number" value={semester} onChange={setSemester} placeholder="e.g., 5" />
            
            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex items-center justify-between pt-2">
              <button 
                type="button" 
                onClick={onBack}
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                &larr; Back to Role Selection
              </button>
              <button 
                type="submit"
                className="bg-primary hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Login
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
