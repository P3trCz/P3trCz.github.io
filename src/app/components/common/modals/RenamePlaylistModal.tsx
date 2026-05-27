import React, { useState } from 'react';
import { Modal } from '../Modal';

type RenamePlaylistModalProps = {
  playlistId: string;
  currentName: string;
  onClose: () => void;
  onRename: (playlistId: string, newName: string) => void;
};

export function RenamePlaylistModal({ playlistId, currentName, onClose, onRename }: RenamePlaylistModalProps) {
  const [renamePlaylistName, setRenamePlaylistName] = useState(currentName);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Přejmenovat seznam"
      maxWidth="max-w-sm"
    >
      <div className="space-y-4">
        <div>
          <input
            type="text"
            autoFocus
            value={renamePlaylistName}
            onChange={e => setRenamePlaylistName(e.target.value)}
            maxLength={32}
            placeholder="Nový název seznamu"
            className="w-full bg-[#1c1c24] border border-[#27272a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#dc2626] mb-1 text-center"
          />
          <div className={`text-[10px] mb-3 text-center ${renamePlaylistName.length >= 32 ? 'text-[#dc2626]' : 'text-gray-500'}`}>
            {renamePlaylistName.length} / 32 {renamePlaylistName.length >= 32 ? '(Limit)' : ''}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Zrušit
          </button>
          <button
            onClick={() => {
              if (renamePlaylistName.trim()) {
                onRename(playlistId, renamePlaylistName.trim());
                onClose();
              }
            }}
            disabled={!renamePlaylistName.trim()}
            className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            Uložit
          </button>
        </div>
      </div>
    </Modal>
  );
}
