// Modál pro změnu uživatelského jména. Kontroluje unikátnost jména a max. délku 24 znaků.
import { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { useAppStore } from '../../../store/useAppStore';
import { usersDb } from '../../../data/usersDb';

export interface ChangeUsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ChangeUsernameModal({ isOpen, onClose, onSuccess }: ChangeUsernameModalProps) {
  const currentUser = useAppStore(state => state.currentUser);
  const updateUsername = useAppStore(state => state.updateUsername);

  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNewUsername(currentUser?.username || '');
      setUsernameError('');
    }
  }, [isOpen, currentUser]);

  if (!currentUser) return null;

  const handleUsernameChange = () => {
    setUsernameError('');

    if (newUsername.length < 1) {
      setUsernameError('Uživatelské jméno musí mít alespoň 1 znak!');
      return;
    }

    const existingUser = usersDb.findUserByUsername(newUsername);
    if (existingUser && existingUser.id !== currentUser.id) {
      setUsernameError('Toto uživatelské jméno je již obsazené!');
      return;
    }

    const updated = usersDb.updateUsername(currentUser.email, newUsername);
    if (updated) {
      updateUsername(newUsername);
      onSuccess();
    } else {
      setUsernameError('Nepodařilo se změnit uživatelské jméno!');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Změnit uživatelské jméno"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Nové uživatelské jméno</label>
          <input
            type="text"
            value={newUsername}
            onChange={e => setNewUsername(e.target.value)}
            placeholder="Zadejte nové uživatelské jméno"
            maxLength={24}
            className="w-full bg-[#0a0a0f] border border-[#27272a] text-white rounded-lg py-2.5 px-4 focus:outline-none focus:border-[#dc2626] transition-colors"
          />
          <div className={`text-xs mt-1 text-right ${newUsername.length >= 24 ? 'text-[#dc2626]' : 'text-gray-500'}`}>
            {newUsername.length} / 24 {newUsername.length >= 24 ? '(Dosažen limit)' : ''}
          </div>
        </div>

        {usernameError && (
          <p className="text-sm text-red-400">{usernameError}</p>
        )}

        <button
          onClick={handleUsernameChange}
          className="btn-action-primary w-full mt-2"
        >
          Uložit jméno
        </button>
      </div>
    </Modal>
  );
}
