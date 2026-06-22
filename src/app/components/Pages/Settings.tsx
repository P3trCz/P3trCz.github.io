// Stránka nastavení – správa streamovacích služeb a změna údajů účtu.
import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { serviceLogos, ServiceType } from '../../data/catalog';
import { User, LogOut, Key, Edit2, Link } from 'lucide-react';
import { Snackbar } from '../shared/Snackbar';
import { ChangeUsernameModal } from '../shared/modals/ChangeUsernameModal';
import { ChangePasswordModal } from '../shared/modals/ChangePasswordModal';
import { ServiceCredentialsModal } from '../shared/modals/ServiceCredentialsModal';
import { AVAILABLE_SERVICES } from '../../constants';

export function Settings() {
  const currentUser = useAppStore(state => state.currentUser);
  const logout = useAppStore(state => state.logout);
  const subscriptionsState = useAppStore(state => state.subscriptions);
  const subscriptions = currentUser ? (subscriptionsState[currentUser.id] || []) : [];
  const toggleSubscription = useAppStore(state => state.toggleSubscription);

  const [showUsernameModal, setShowUsernameModal] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const [syncServiceId, setSyncServiceId] = useState<ServiceType | null>(null);

  if (!currentUser) return null;

  return (
    <>
      <div className="p-8 pt-2">
        <h1 className="text-3xl font-bold text-white mb-8">Nastavení</h1>

        <div className="space-y-8">
          <section className="panel-container-dark">
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
                onClick={() => setShowUsernameModal(true)}
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

          <section className="panel-container-dark">
            <h2 className="text-xl font-semibold text-white mb-2">Moje předplatná</h2>
            <p className="text-sm text-gray-400 mb-6">Vyberte služby, které si aktuálně předplácíte. Obsah z těchto služeb bude zobrazený v katalogu.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {AVAILABLE_SERVICES.map(service => {
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
                    <div className="text-center text-xs text-gray-500 mt-1 mb-3">
                      {isSubscribed ? 'Aktivní' : 'Neaktivní'}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSyncServiceId(service.id);
                      }}
                      className="px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-xs text-white rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                      <Link size={12} />
                      Připojit
                    </button>
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

      {/* Změna hesla */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={() => {
          setSnackbarMsg('Heslo bylo úspěšně změněno!');
          setSnackbarType('success');
          setShowPasswordModal(false);
        }}
      />

      {/* Změna uživatelského jména */}
      <ChangeUsernameModal
        isOpen={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        onSuccess={() => {
          setSnackbarMsg('Uživatelské jméno bylo úspěšně změněno!');
          setSnackbarType('success');
          setShowUsernameModal(false);
        }}
      />

      <Snackbar message={snackbarMsg} type={snackbarType} onClose={() => setSnackbarMsg('')} />

      {syncServiceId && (
        <ServiceCredentialsModal
          service={syncServiceId}
          onClose={() => setSyncServiceId(null)}
        />
      )}
    </>
  );
}