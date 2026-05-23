import React, { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { usersDb } from '../../../data/usersDb';
import { Play } from 'lucide-react';

type Props = {
  onNavigate: (view: 'register' | 'forgot-password') => void;
};

export function LoginForm({ onNavigate }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAppStore(state => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setError('');

      const user = usersDb.findUserByEmail(email);
      if (user && user.password === password) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _p, ...userWithoutPassword } = user;
        login(userWithoutPassword);
      } else {
        setError('Neplatný email nebo heslo.');
      }
    }, 500);
  };

  return (
    <div className="w-full max-w-md bg-[#111116] p-8 rounded-2xl border border-[#27272a] shadow-xl">
      <div className="flex flex-col items-center mb-8">
        <div className="border-2 border-red-600 rounded-lg p-2 mb-4">
          <Play size={32} className="fill-red-600 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-white">Přihlášení do StreamHub</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
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
            placeholder="např. admin@streamhub.cz"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-400">Heslo</label>
            <button
              type="button"
              onClick={() => onNavigate('forgot-password')}
              className="text-xs text-[#dc2626] hover:text-[#b91c1c]"
            >
              Zapomenuté heslo
            </button>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-[#0a0a0f] border border-[#27272a] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#dc2626] transition-colors"
            placeholder="Zadejte své heslo"
          />
        </div>

        <button
          type="submit"
          className="w-full btn-action-primary mt-6"
        >
          Přihlásit se
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Nemáte ještě účet?{' '}
        <button
          onClick={() => onNavigate('register')}
          className="text-[#dc2626] hover:text-[#b91c1c] font-medium"
        >
          Zaregistrujte se
        </button>
      </div>
    </div>
  );
}
