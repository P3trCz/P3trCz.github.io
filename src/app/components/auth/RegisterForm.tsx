import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { usersDb } from '../../data/usersDb';
import { Play } from 'lucide-react';

type Props = {
  onNavigate: (view: 'login') => void;
};

export function RegisterForm({ onNavigate }: Props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAppStore(state => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (usersDb.findUserByEmail(email)) {
      setError('Uživatel s tímto emailem již existuje.');
      return;
    }
    
    if (usersDb.findUserByUsername(username)) {
      setError('Toto uživatelské jméno je již zabrané.');
      return;
    }

    const newUser = usersDb.createUser({ username, email, password });
    const { password: _, ...userWithoutPassword } = newUser;
    login(userWithoutPassword);
  };

  return (
    <div className="w-full max-w-md bg-[#111116] p-8 rounded-2xl border border-[#27272a] shadow-xl">
      <div className="flex flex-col items-center mb-8">
        <div className="border-2 border-red-600 rounded-lg p-2 mb-4">
          <Play size={32} className="fill-red-600 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-white">Vytvořit účet</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Uživatelské jméno</label>
          <input
            type="text"
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full bg-[#0a0a0f] border border-[#27272a] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#dc2626] transition-colors"
            placeholder="Vaše přezdívka"
          />
        </div>

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
          <label className="block text-sm font-medium text-gray-400 mb-1">Heslo</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-[#0a0a0f] border border-[#27272a] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#dc2626] transition-colors"
            placeholder="Zvolte si bezpečné heslo"
            minLength={6}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium py-2.5 rounded-lg transition-colors mt-6"
        >
          Zaregistrovat se
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Již máte účet?{' '}
        <button
          onClick={() => onNavigate('login')}
          className="text-[#dc2626] hover:text-[#b91c1c] font-medium"
        >
          Přihlaste se
        </button>
      </div>
    </div>
  );
}
