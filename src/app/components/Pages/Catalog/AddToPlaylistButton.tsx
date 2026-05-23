import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { AddTitleToPlaylistModal } from '../../Common/modals/AddTitleToPlaylistModal';

type Props = {
  movieId: string;
};

export function AddToPlaylistButton({ movieId }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className="w-8 h-8 rounded-full bg-[#111116] border border-[#27272a] flex items-center justify-center text-gray-300 hover:text-white hover:border-[#dc2626] transition-colors"
      >
        <Plus size={16} />
      </button>

      {isOpen && (
        <AddTitleToPlaylistModal
          movieId={movieId}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

