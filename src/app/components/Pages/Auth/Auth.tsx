import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

type AuthState = 'login' | 'register' | 'forgot-password';

export function Auth() {
  const [currentView, setCurrentView] = useState<AuthState>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4 font-sans text-white">
      {currentView === 'login' && <LoginForm onNavigate={setCurrentView} />}
      {currentView === 'register' && <RegisterForm onNavigate={setCurrentView} />}
      {currentView === 'forgot-password' && <ForgotPasswordForm onNavigate={setCurrentView} />}
    </div>
  );
}
