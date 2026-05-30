import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Modal } from '../Modal';
import { useSearch } from '../../../hooks/useSearch';
import { SearchInput } from '../SearchInput';

type SharePlaylistWithFriendModalProps = {
  friends: { id: string; username: string }[];
  onClose: () => void;
  onShare: (friendId: string, message: string) => void;
};

export function SharePlaylistWithFriendModal({ friends, onClose, onShare }: SharePlaylistWithFriendModalProps) {
  const [selectedFriendId, setSelectedFriendId] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const validFriends = friends.filter((f): f is { id: string; username: string } => Boolean(f));
  const filteredFriends = useSearch(validFriends, searchQuery, f => [f.username]);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Sdílet seznam"
    >
      {friends.length === 0 ? (
        <div className="text-center text-gray-500 py-6">Nemáte přidané žádné přátele.</div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Vyberte přítele</label>
            
            <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Hledat přítele..."
              />

            <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredFriends.length === 0 ? (
                <div className="text-center text-gray-500 py-4 text-sm">Žádný přítel nenalezen.</div>
              ) : (
                filteredFriends.map(friend => {
                if (!friend) return null;
                const isSelected = selectedFriendId === friend.id;
                return (
                  <div
                    key={friend.id}
                    onClick={() => setSelectedFriendId(selectedFriendId === friend.id ? '' : friend.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${isSelected
                      ? 'bg-[#dc2626]/10 border-[#dc2626] text-white'
                      : 'bg-[#1c1c24] border-[#27272a] text-gray-400 hover:border-[#3f3f46] hover:text-white'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isSelected
                      ? 'bg-[#dc2626] text-white'
                      : 'bg-[#0a0a0f] text-gray-400'
                      }`}>
                      {friend.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <div className="font-bold text-sm text-white break-all">{friend.username}</div>
                    </div>
                    {isSelected && <Check size={16} className="text-[#dc2626]" />}
                  </div>
                );
              }))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Zpráva (nepovinné)</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Podívej se na tohle. Je to opravdu hustý!"
              className="w-full form-input-dark h-24 resize-none"
            ></textarea>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 btn-sm-cancel"
            >
              Zrušit
            </button>
            <button
              onClick={() => {
                if (selectedFriendId) {
                  onShare(selectedFriendId, message);
                }
              }}
              disabled={!selectedFriendId}
              className="flex-1 btn-sm-primary"
            >
              <Share2 size={18} /> Sdílet s přítelem
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
