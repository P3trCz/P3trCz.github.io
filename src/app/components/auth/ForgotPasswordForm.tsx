import React, { useState } from 'react';
import { usersDb } from '../../data/usersDb';
import { Play, ArrowLeft } from 'lucide-react';

type Props = {
  onNavigate: (view: 'login') => void;
};

export function ForgotPasswordForm({ onNavigate }: Props) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = usersDb.findUserByEmail(email);
    if (!user) {
      setStatus('error');
      setMessage('Účet s tímto emailem neexistuje.');
      return;
    }

    const success = usersDb.updatePassword(email, newPassword);
    if (success) {
      setStatus('success');
      setMessage('Heslo bylo úspěšně změněno. Nyní se můžete přihlásit.');
    } else {
      setStatus('error');
      setMessage('Něco se pokazilo, zkuste to prosím znovu.');
    }
  };

  return (
    <div className="w-full max-w-md bg-[#111116] p-8 rounded-2xl border border-[#27272a] shadow-xl">
      <button 
        onClick={() => onNavigate('login')}
        className="flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        Zpět na přihlášení
      </button>

      <div className="flex flex-col items-center mb-8">
        <div className="border-2 border-red-600 rounded-lg p-2 mb-4">
          <Play size={32} className="fill-red-600 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-white">Obnova hesla</h2>
      </div>

      {status === 'success' ? (
        <div className="text-center">
          <div className="p-4 rounded bg-green-500/10 border border-green-500/20 text-green-400 mb-6">
            {message}
          </div>
          <button
            onClick={() => onNavigate('login')}
            className="w-full btn-action-primary"
          >
            Přejít k přihlášení
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === 'error' && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {message}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#27272a] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#dc2626] transition-colors"
              placeholder="Zadejte svůj email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nové heslo</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#27272a] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#dc2626] transition-colors"
              placeholder="Zadejte nové heslo"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full btn-action-primary mt-6"
          >
            Změnit heslo
          </button>
        </form>
      )}
    </div>
  );
}
