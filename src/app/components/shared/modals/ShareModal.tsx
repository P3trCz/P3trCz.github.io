import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Modal } from '../Modal';
import { useSearch } from '../../../hooks/useSearch';
import { SearchInput } from '../SearchInput';

export type ShareItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  tag?: string;
  disabled?: boolean;
  disabledReason?: string;
};

type ShareModalProps = {
  modalTitle: string;
  searchPlaceholder?: string;
  emptyMessage: string;
  noResultsMessage?: string;
  items: ShareItem[];
  onClose: () => void;
  onShare: (selectedId: string, message: string) => void;
  shareBtnText?: string;
  selectionLabel?: string;
};

export function ShareModal({
  modalTitle,
  searchPlaceholder = "Hledat...",
  emptyMessage,
  noResultsMessage = "Žádná položka nenalezena.",
  items,
  onClose,
  onShare,
  shareBtnText = "Sdílet",
  selectionLabel = "Vyberte položku"
}: ShareModalProps) {
  const [selectedId, setSelectedId] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const validItems = items.filter(Boolean);
  const filteredItems = useSearch(validItems, searchQuery, item => [item.title]);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={modalTitle}
    >
      {items.length === 0 ? (
        <div className="text-center text-gray-500 py-6">{emptyMessage}</div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">{selectionLabel}</label>
            
            <div className="mb-3">
              <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={searchPlaceholder}
                />
            </div>

            <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredItems.length === 0 ? (
                <div className="text-center text-gray-500 py-4 text-sm">{noResultsMessage}</div>
              ) : (
                filteredItems.map(item => {
                  const isSelected = selectedId === item.id;
                  
                  return (
                    <div
                      key={item.id}
                      onClick={() => !item.disabled && setSelectedId(selectedId === item.id ? '' : item.id)}
                      className={`selectable-item ${
                        item.disabled
                          ? 'opacity-50 cursor-not-allowed hover:border-[#27272a] hover:text-gray-400'
                          : isSelected
                            ? 'selectable-item--active'
                            : ''
                      }`}
                      title={item.disabled ? item.disabledReason : ""}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        item.disabled
                          ? 'bg-[#0a0a0f] text-gray-500'
                          : isSelected
                            ? 'bg-[#dc2626] text-white'
                            : 'bg-[#0a0a0f] text-gray-400'
                      }`}>
                        {item.icon ? item.icon : item.title.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="font-bold text-sm text-white truncate">{item.title}</div>
                          {item.subtitle && (
                            <div className="text-xs opacity-60 mt-0.5">{item.subtitle}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.tag && (
                           <span className="text-[10px] bg-[#dc2626]/20 text-[#dc2626] px-1.5 py-0.5 rounded uppercase tracking-wider font-normal truncate max-w-[100px]" title={item.tag}>
                             {item.tag}
                           </span>
                        )}
                        {isSelected && <Check size={16} className="text-[#dc2626]" />}
                      </div>
                    </div>
                  );
                })
              )}
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
                if (selectedId) {
                  onShare(selectedId, message);
                }
              }}
              disabled={!selectedId}
              className="flex-1 btn-sm-primary"
            >
              <Share2 size={18} /> {shareBtnText}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
