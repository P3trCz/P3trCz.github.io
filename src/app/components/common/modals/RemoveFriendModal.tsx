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
            onClick={onClose}
            className="flex-1 btn-sm-cancel"
          >
            Zrušit
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 btn-sm-primary"
          >
            Odstranit
          </button>
        </div>
      </div>
    </Modal>
  );
}
