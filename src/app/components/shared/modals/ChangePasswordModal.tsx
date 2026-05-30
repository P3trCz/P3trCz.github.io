// Modál pro změnu hesla přihlášeného uživatele. Validuje délku a shodu hesel.
import { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { useAppStore } from '../../../store/useAppStore';
import { usersDb } from '../../../data/usersDb';

export interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ChangePasswordModal({ isOpen, onClose, onSuccess }: ChangePasswordModalProps) {
  const currentUser = useAppStore(state => state.currentUser);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
    }
  }, [isOpen]);

  if (!currentUser) return null;

  const handlePasswordChange = () => {
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('Heslo musí mít alespoň 6 znaků!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Hesla se neshodují!');
      return;
    }

    const updated = usersDb.updatePassword(currentUser.email, newPassword);
    if (updated) {
      onSuccess();
    } else {
      setPasswordError('Nepodařilo se změnit heslo!');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Změnit heslo"
    >
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
          className="btn-action-primary w-full mt-2"
        >
          Uložit nové heslo
        </button>
      </div>
    </Modal>
  );
}
