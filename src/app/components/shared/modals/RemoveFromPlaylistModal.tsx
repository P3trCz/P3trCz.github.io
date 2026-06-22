import { AlertTriangle } from 'lucide-react';
import { Modal } from '../Modal';

type Props = {
  titleName: string;
  playlistName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function RemoveFromPlaylistModal({ titleName, playlistName, onClose, onConfirm }: Props) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Odstranit ze seznamu" maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center p-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle size={32} className="text-[#dc2626]" />
        </div>
        
        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          Opravdu si přejete odstranit titul <span className="text-white font-bold">{titleName}</span> ze seznamu <span className="text-white font-bold">{playlistName}</span>?
        </p>

        <div className="flex w-full gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl font-medium bg-[#27272a] text-white hover:bg-[#3f3f46] transition-colors"
          >
            Zrušit
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-xl font-medium bg-[#dc2626] text-white hover:bg-[#b91c1c] transition-colors"
          >
            Odstranit
          </button>
        </div>
      </div>
    </Modal>
  );
}
