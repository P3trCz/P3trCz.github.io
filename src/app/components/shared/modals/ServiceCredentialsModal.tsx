import { useState } from 'react';
import { Modal } from '../Modal';
import { ServiceType } from '../../../data/catalog';
import { useAppStore } from '../../../store/useAppStore';

type ServiceCredentialsModalProps = {
  service: ServiceType;
  onClose: () => void;
};

export function ServiceCredentialsModal({ service, onClose }: ServiceCredentialsModalProps) {
  const currentUser = useAppStore(state => state.currentUser);
  const servicesCredentials = useAppStore(state => state.servicesCredentials);
  const setServiceCredentials = useAppStore(state => state.setServiceCredentials);

  const existingCreds = currentUser && servicesCredentials[currentUser.id]?.[service]
    ? servicesCredentials[currentUser.id]?.[service]
    : { username: '', password: '' };

  const [username, setUsername] = useState(existingCreds?.username || '');
  const [password, setPassword] = useState(existingCreds?.password || '');

  const handleSave = () => {
    setServiceCredentials(service, { username, password });
    onClose();
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Připojit ${service}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">E-mail nebo uživatelské jméno</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#111116] border border-[#27272a] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#dc2626] transition-colors"
            placeholder="Vaše přihlašovací jméno"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Heslo</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#111116] border border-[#27272a] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#dc2626] transition-colors"
            placeholder="Vaše heslo"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors bg-[#27272a] hover:bg-[#3f3f46] text-white"
          >
            Zrušit
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors bg-[#dc2626] hover:bg-[#b91c1c] text-white"
          >
            Uložit
          </button>
        </div>
      </div>
    </Modal>
  );
}
