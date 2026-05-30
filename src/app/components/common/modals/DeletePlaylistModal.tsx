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
            className="flex-1 btn-sm-cancel"
          >
            Zrušit
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 btn-sm-primary"
          >
            Smazat
          </button>
        </div>
      </div>
    </Modal>
  );
}
