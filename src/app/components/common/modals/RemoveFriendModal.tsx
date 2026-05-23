import React from 'react';
import { Modal } from '../Modal';

type RemoveFriendModalProps = {
  friendToRemove: { id: string; name: string } | null;
  onClose: () => void;
  onConfirm: () => void;
};

export function RemoveFriendModal({ friendToRemove, onClose, onConfirm }: RemoveFriendModalProps) {
  if (!friendToRemove) return null;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Odstranit přítele"
      maxWidth="max-w-sm"
    >
      <div className="space-y-6">
        <p className="text-gray-300 break-words">
          Opravdu si přejete odebrat uživatele <strong className="text-white break-all">{friendToRemove.name}</strong> z přátel? Tato akce je nevratná.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Odstranit
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Zrušit
          </button>
        </div>
      </div>
    </Modal>
  );
}
