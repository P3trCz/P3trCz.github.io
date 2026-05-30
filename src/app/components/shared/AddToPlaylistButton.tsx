import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { AddTitleToPlaylistModal } from './modals/AddTitleToPlaylistModal';
import { useAppStore } from '../../store/useAppStore';

type Props = {
  titleId: string;
};

export function AddToPlaylistButton({ titleId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = useAppStore(state => state.currentUser);
  const playlistsState = useAppStore(state => state.playlists);
  const watchlistsState = useAppStore(state => state.watchlists);

  const userPlaylists = currentUser ? (playlistsState[currentUser.id] || []) : [];
  const userWatchlist = currentUser ? (watchlistsState[currentUser.id] || []) : [];

  const isInWatchlist = userWatchlist.includes(titleId);
  const isInAnyPlaylist = userPlaylists.some(p => p.titleIds.includes(titleId));
  const isSaved = isInWatchlist || isInAnyPlaylist;

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
          isSaved
            ? 'bg-red-500/10 border-[#dc2626] text-[#dc2626]'
            : 'bg-[#111116] border-[#27272a] text-gray-500 hover:text-white hover:border-[#dc2626]'
        }`}
        title={isSaved ? 'Upravit zařazení do seznamů' : 'Přidat do seznamu'}
      >
        <Bookmark size={16} className={isSaved ? 'fill-[#dc2626]' : ''} />
      </button>

      {isOpen && (
        <AddTitleToPlaylistModal
          titleId={titleId}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}


