import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ServiceType, serviceLogos, serviceColors } from '../../data/catalog';
import { usersDb } from '../../data/usersDb';
import { User, LogOut, Key, X, Edit2 } from 'lucide-react';

const availableServices: { id: ServiceType; name: string }[] = [
  { id: 'Netflix', name: 'Netflix' },
  { id: 'HBO Max', name: 'HBO Max' },
  { id: 'Disney Plus', name: 'Disney Plus' },
  { id: 'Prime Video', name: 'Prime Video' },
  { id: 'Apple TV', name: 'Apple TV' },
  { id: 'SkyShowtime', name: 'SkyShowtime' },
  { id: 'Oneplay', name: 'Oneplay' }
];

export function SettingsView() {
  const currentUser = useAppStore(state => state.currentUser);
  const logout = useAppStore(state => state.logout);
  const subscriptionsState = useAppStore(state => state.subscriptions);
  const subscriptions = currentUser ? (subscriptionsState[currentUser.id] || []) : [];
  const toggleSubscription = useAppStore(state => state.toggleSubscription);
  const updateUsername = useAppStore(state => state.updateUsername);

  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  if (!currentUser) return null;

  const handleUsernameChange = () => {
    setUsernameError('');

    if (newUsername.length < 3) {
      setUsernameError('Uživatelské jméno musí mít alespoň 3 znaky.');
      return;
    }

    const existingUser = usersDb.findUserByUsername(newUsername);
    if (existingUser && existingUser.id !== currentUser?.id) {
      setUsernameError('Toto uživatelské jméno je již obsazené.');
      return;
    }

    const updated = usersDb.updateUsername(currentUser!.email, newUsername);
    if (updated) {
      updateUsername(newUsername);
      setUsernameSuccess(true);
      setTimeout(() => {
        setShowUsernameModal(false);
        setNewUsername('');
        setUsernameSuccess(false);
      }, 1500);
    } else {
      setUsernameError('Nepodařilo se změnit uživatelské jméno.');
    }
  };

  const closeUsernameModal = () => {
    setShowUsernameModal(false);
    setNewUsername('');
    setUsernameError('');
    setUsernameSuccess(false);
  };

  const handlePasswordChange = () => {
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('Heslo musí mít alespoň 6 znaků.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Hesla se neshodují.');
      return;
    }

    const updated = usersDb.updatePassword(currentUser.email, newPassword);
    if (updated) {
      setPasswordSuccess(true);
      setTimeout(() => {
        setShowPasswordModal(false);
        setNewPassword('');
        setConfirmPassword('');
        setPasswordSuccess(false);
      }, 1500);
    } else {
      setPasswordError('Nepodařilo se změnit heslo.');
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess(false);
  };

  return (
    <>
      <div className="p-8 pt-2">
        <h1 className="text-3xl font-bold text-white mb-8">Nastavení</h1>

        <div className="space-y-8">
          <section className="bg-[#111116] border border-[#27272a] rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#1c1c24] border border-[#27272a] flex items-center justify-center">
                <User size={32} className="text-gray-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{currentUser.username}</h2>
                <p className="text-gray-400">{currentUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setNewUsername(currentUser.username);
                  setShowUsernameModal(true);
                }}
                className="flex items-center justify-between p-4 bg-[#0a0a0f] border border-[#27272a] rounded-lg hover:border-[#dc2626] transition-colors"
              >
                <div className="flex items-center gap-3 text-white">
                  <Edit2 size={18} className="text-gray-400" />
                  Změnit uživatelské jméno
                </div>
              </button>

              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center justify-between p-4 bg-[#0a0a0f] border border-[#27272a] rounded-lg hover:border-[#dc2626] transition-colors"
              >
                <div className="flex items-center gap-3 text-white">
                  <Key size={18} className="text-gray-400" />
                  Změnit heslo
                </div>
              </button>
            </div>
          </section>

          <section className="bg-[#111116] border border-[#27272a] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Moje předplatná</h2>
            <p className="text-sm text-gray-400 mb-6">Vyberte služby, které si aktuálně předplácíte. Obsah z těchto služeb bude primárně doporučován a označen jako dostupný.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableServices.map(service => {
                const isSubscribed = subscriptions.includes(service.id);
                return (
                  <button
                    key={service.id}
                    onClick={() => toggleSubscription(service.id)}
                    className={`relative p-4 rounded-xl border transition-all ${isSubscribed
                        ? 'bg-[#1c1c24] border-[#dc2626] shadow-[0_0_15px_rgba(220,38,38,0.1)]'
                        : 'bg-[#0a0a0f] border-[#27272a] hover:border-[#3f3f46]'
                      }`}
                  >
                    {isSubscribed && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#dc2626] flex items-center justify-center border-2 border-[#111116] z-10">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                    )}
                    <div className="w-20 h-20 rounded-xl bg-[#0a0a0f] border border-[#27272a] p-3 flex items-center justify-center mb-4 overflow-hidden mx-auto">
                      <img
                        src={serviceLogos[service.id]}
                        alt={service.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="text-center font-medium text-white">{service.name}</div>
                    <div className="text-center text-xs text-gray-500 mt-1">
                      {isSubscribed ? 'Aktivní' : 'Neaktivní'}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="pt-4">
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors font-medium border border-red-500/20"
            >
              <LogOut size={18} />
              Odhlásit se
            </button>
          </section>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closePasswordModal}>
          <div
            className="w-full max-w-md bg-[#111116] rounded-2xl border border-[#27272a] shadow-2xl p-8 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closePasswordModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#1c1c24] text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold text-white mb-6">Změnit heslo</h2>

            {passwordSuccess ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <p className="text-green-400 font-medium">Heslo bylo úspěšně změněno!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nové heslo</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Zadejte nové heslo"
                    className="w-full bg-[#0a0a0f] border border-[#27272a] text-white rounded-lg py-2.5 px-4 focus:outline-none focus:border-[#dc2626] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Potvrďte nové heslo</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Zadejte heslo znovu"
                    className="w-full bg-[#0a0a0f] border border-[#27272a] text-white rounded-lg py-2.5 px-4 focus:outline-none focus:border-[#dc2626] transition-colors"
                  />
                </div>

                {passwordError && (
                  <p className="text-sm text-red-400">{passwordError}</p>
                )}

                <button
                  onClick={handlePasswordChange}
                  className="w-full py-3 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium transition-colors mt-2"
                >
                  Uložit nové heslo
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showUsernameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeUsernameModal}>
          <div
            className="w-full max-w-md bg-[#111116] rounded-2xl border border-[#27272a] shadow-2xl p-8 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeUsernameModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#1c1c24] text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold text-white mb-6">Změnit uživatelské jméno</h2>

            {usernameSuccess ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <p className="text-green-400 font-medium">Uživatelské jméno bylo úspěšně změněno!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nové uživatelské jméno</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    placeholder="Zadejte nové uživatelské jméno"
                    className="w-full bg-[#0a0a0f] border border-[#27272a] text-white rounded-lg py-2.5 px-4 focus:outline-none focus:border-[#dc2626] transition-colors"
                  />
                </div>

                {usernameError && (
                  <p className="text-sm text-red-400">{usernameError}</p>
                )}

                <button
                  onClick={handleUsernameChange}
                  className="w-full py-3 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium transition-colors mt-2"
                >
                  Uložit jméno
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
