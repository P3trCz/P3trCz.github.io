import React, { useState } from 'react';
import { ListVideo, Check, Share2 } from 'lucide-react';
import { Playlist } from '../../../store/useAppStore';
import { Modal } from '../Modal';
import { getUsername } from '../../../utils/userUtils';
import { pluralizeItems } from '../../../utils/formatUtils';
import { SearchInput } from '../SearchInput';

type SharePlaylistModalProps = {
  friendName: string;
  playlists: Playlist[];
  onClose: () => void;
  onShare: (playlistId: string, message: string) => void;
};

export function SharePlaylistModal({ friendName, playlists, onClose, onShare }: SharePlaylistModalProps) {
  const [selectedList, setSelectedList] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaylists = playlists.filter(pl => 
    pl.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Sdílet seznam s ${friendName}`}
    >
      {playlists.length === 0 ? (
        <div className="text-center text-gray-500 py-6">Nemáte žádné vlastní seznamy ke sdílení.</div>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-end mb-3">
              <label className="block text-sm font-medium text-gray-400">Vyberte seznam</label>
            </div>
            <div className="mb-4">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Hledat seznam..."
              />
            </div>
            
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredPlaylists.map(pl => (
                <div
                  key={pl.id}
                  onClick={() => pl.titleIds.length > 0 && setSelectedList(selectedList === pl.id ? '' : pl.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${pl.titleIds.length === 0
                      ? 'bg-[#0a0a0f] border-[#27272a] opacity-50 cursor-not-allowed'
                      : selectedList === pl.id
                        ? 'bg-[#dc2626]/10 border-[#dc2626] text-white cursor-pointer'
                        : 'bg-[#1c1c24] border-[#27272a] text-gray-400 hover:border-[#3f3f46] hover:text-white cursor-pointer'
                    }`}
                  title={pl.titleIds.length === 0 ? "Prázdný seznam nelze sdílet" : ""}
                >
                  <div className={`p-2 rounded-lg ${selectedList === pl.id ? 'bg-[#dc2626] text-white' : 'bg-[#0a0a0f] text-gray-500'}`}>
                    <ListVideo size={20} />
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="font-bold truncate flex items-center gap-2">
                      <span className="truncate">{pl.name}</span>
                    </div>
                    <div className="text-xs opacity-60 mt-0.5">
                      {pl.titleIds.length} {pluralizeItems(pl.titleIds.length)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {pl.fromUserId && (
                      <span className="text-[10px] bg-[#dc2626]/20 text-[#dc2626] px-1.5 py-0.5 rounded uppercase tracking-wider font-normal truncate max-w-[100px]" title={`Od: ${getUsername(pl.fromUserId)}`}>
                        Od: {getUsername(pl.fromUserId)}
                      </span>
                    )}
                    {selectedList === pl.id && <Check size={18} className="text-[#dc2626]" />}
                  </div>
                </div>
              ))}
              {filteredPlaylists.length === 0 && (
                <div className="text-center text-gray-500 py-4 text-sm">Žádný seznam neodpovídá hledání.</div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Zpráva (nepovinné)</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Podívej se na tohle. Je to opravdu hustý!"
              className="w-full form-input-dark h-24 resize-none transition-colors"
            ></textarea>
          </div>

          <button
            onClick={() => onShare(selectedList, message)}
            disabled={!selectedList}
            className="w-full flex items-center justify-center gap-2 btn-action-primary mt-2 shadow-lg shadow-red-900/20"
          >
            <Share2 size={18} /> Odeslat seznam
          </button>
        </div>
      )}
    </Modal>
  );
}

