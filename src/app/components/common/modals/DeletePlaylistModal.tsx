import React from 'react';
import { Modal } from '../Modal';

type DeletePlaylistModalProps = {
  playlistName: string | undefined;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeletePlaylistModal({ playlistName, onClose, onConfirm }: DeletePlaylistModalProps) {
  if (!playlistName) return null;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Smazat seznam"
      maxWidth="max-w-sm"
    >
      <div className="space-y-6">
        <p className="text-gray-300 break-words">
          Opravdu si přejete smazat seznam <strong className="text-white break-all">{playlistName}</strong>? Tato akce je nevratná.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Zrušit
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Smazat
          </button>
        </div>
      </div>
    </Modal>
  );
}
