import React from 'react';
import { Download } from 'lucide-react';
import { Playlist } from '../../../store/useAppStore';
import { catalog, Title } from '../../../data/catalog';
import { Modal } from '../Modal';
import { TitleTile } from '../../Pages/Catalog/TitleTile';
import { getUsername } from '../../../utils/userUtils';
import { pluralizeItems } from '../../../utils/formatUtils';

type PreviewPlaylistModalProps = {
  playlist: Playlist;
  onClose: () => void;
  onViewMovie: (title: Title) => void;
  onSave: () => void;
};

export function PreviewPlaylistModal({ playlist, onClose, onViewMovie, onSave }: PreviewPlaylistModalProps) {
  const titleIds = playlist.titleIds;
  const titles = titleIds.map(id => catalog.find(m => m.id.toString() === id.toString())).filter(Boolean) as Title[];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={playlist.name}
      maxWidth="max-w-2xl"
      zIndex="z-[80]"
      noPadding={true}
    >
      <div className="flex flex-col h-full">
        <div className="px-6 py-2 border-b border-[#27272a] bg-[#111116] flex items-center gap-2">
          <span className="text-xs text-gray-500">{titles.length} {pluralizeItems(titles.length)}</span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-[#dc2626] font-medium">Od uživatele: {getUsername(playlist.fromUserId)}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#0a0a0f]">
          {titles.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Tento seznam je prázdný.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {titles.map(title => (
                <TitleTile key={title.id} title={title} onClick={onViewMovie} />
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#27272a] flex justify-between gap-4 bg-[#111116]">
          <button onClick={onClose} className="flex-1 btn-action-cancel">
            Zavřít náhled
          </button>
          <button onClick={onSave} className="flex-1 btn-action-primary flex items-center justify-center gap-2">
            <Download size={18} /> Uložit seznam
          </button>
        </div>
      </div>
    </Modal>
  );
}

