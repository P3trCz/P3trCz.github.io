// Stránka playlistů – vytváření, úprava a prohlížení vlastních i sdílených seznamů.
import { useState, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { catalog, Title } from '../../data/catalog';
import { MoreHorizontal, ArrowLeft, Edit2, Trash2, Share2, Plus } from 'lucide-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { TitleDetail } from '../shared/TitleDetail';
import { TitleCard } from './Catalog/TitleCard';
import { Pagination } from '../shared/Pagination';
import { getUsername } from '../../utils/userUtils';
import { RenamePlaylistModal } from '../shared/modals/RenamePlaylistModal';
import { DeletePlaylistModal } from '../shared/modals/DeletePlaylistModal';
import { SearchTitleForPlaylistModal } from '../shared/modals/SearchTitleForPlaylistModal';
import { ShareModal } from '../shared/modals/ShareModal';
import { RemoveFromPlaylistModal } from '../shared/modals/RemoveFromPlaylistModal';
import { Snackbar } from '../shared/Snackbar';
import { SortField, SortOrder, sortTitles } from '../../utils/sortUtils';
import { SortableHeader } from '../shared/SortableHeader';
import { useMyFriends } from '../../hooks/useMyFriends';
import { pluralizeItems } from '../../utils/formatUtils';

export function Playlists() {
  const currentUser = useAppStore(state => state.currentUser);
  const playlistsState = useAppStore(state => state.playlists);
  const watchlistsState = useAppStore(state => state.watchlists);
  const renamePlaylist = useAppStore(state => state.renamePlaylist);
  const deletePlaylist = useAppStore(state => state.deletePlaylist);
  const sharePlaylistAction = useAppStore(state => state.sharePlaylist);
  const createPlaylist = useAppStore(state => state.createPlaylist);
  const addToPlaylist = useAppStore(state => state.addToPlaylist);
  const removeFromPlaylist = useAppStore(state => state.removeFromPlaylist);
  const toggleWatchlist = useAppStore(state => state.toggleWatchlist);
  const language = useAppStore(state => state.language);
  const myFriends = useMyFriends();

  const playlists = currentUser ? (playlistsState[currentUser.id] || []) : [];
  const watchlist = currentUser ? (watchlistsState[currentUser.id] || []) : [];
  const watchHistoryState = useAppStore(state => state.watchHistory);
  const watchHistory = currentUser ? (watchHistoryState[currentUser.id] || []) : [];
  // Unikátní titleIds pro historii, seřazené od nejnovějších
  const historytitleIds = Array.from(new Set([...watchHistory].reverse().map(h => h.titleId)));

  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [titleToRemove, setTitleToRemove] = useState<Title | null>(null);

  const handleSort = (field: SortField) => {
    setCurrentPage(1);
    if (sortField === field) {
      const isDefaultAsc = field === 'title';
      if (isDefaultAsc) {
        if (sortOrder === 'asc') setSortOrder('desc');
        else setSortField(null);
      } else {
        if (sortOrder === 'desc') setSortOrder('asc');
        else setSortField(null);
      }
    } else {
      setSortField(field);
      setSortOrder(field === 'title' ? 'asc' : 'desc');
    }
  };

  const handlePlaylistClick = (id: string | null) => {
    setActivePlaylistId(id);
    setCurrentPage(1);
  };
  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const [shareModalPlaylistId, setShareModalPlaylistId] = useState<string | null>(null);
  const [renameModalPlaylistId, setRenameModalPlaylistId] = useState<string | null>(null);
  const [deleteModalPlaylistId, setDeleteModalPlaylistId] = useState<string | null>(null);
  const [addTitleModalPlaylistId, setAddTitleModalPlaylistId] = useState<string | null>(null);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [renamePlaylistName, setRenamePlaylistName] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setOpenMenuId(null), !!openMenuId);

  const getMovies = (titleIds: string[]) => {
    return titleIds.map(id => catalog.find(m => m.id.toString() === id.toString())).filter(Boolean) as typeof catalog;
  };

  const handleRename = (id: string, currentName: string) => {
    setRenamePlaylistName(currentName);
    setRenameModalPlaylistId(id);
    setOpenMenuId(null);
  };

  const handleDelete = (id: string) => {
    setDeleteModalPlaylistId(id);
    setOpenMenuId(null);
  };

  const renderDetail = () => {
    const isWatchlist = activePlaylistId === '__watchlist__';
    const isHistory = activePlaylistId === '__history__';
    const playlist = (isWatchlist || isHistory) ? null : playlists.find(p => p.id === activePlaylistId);

    if (!isWatchlist && !isHistory && !playlist) {
      handlePlaylistClick(null);
      return null;
    }

    const title = isWatchlist ? 'Přehrát později' : isHistory ? 'Historie sledování' : playlist!.name;
    const allTitles = getMovies(isWatchlist ? watchlist : isHistory ? historytitleIds : playlist!.titleIds);
    const sortedTitles = sortTitles(allTitles, sortField, sortOrder, language);
    const displayedTitles = sortedTitles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
      <div className="p-8 pb-24">
        <button
          onClick={() => handlePlaylistClick(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Zpět na seznamy</span>
        </button>

        <div className="flex justify-between items-start gap-4 flex-wrap mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
            {!isWatchlist && !isHistory && playlist?.fromUserId && (
              <span className="inline-block mt-2 text-[10px] bg-[#dc2626]/20 text-[#dc2626] px-1.5 py-0.5 rounded uppercase tracking-wider">
                Od: {getUsername(playlist.fromUserId)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!isHistory && (
              <button
                onClick={() => setAddTitleModalPlaylistId(isWatchlist ? '__watchlist__' : playlist!.id)}
                className="btn-sm-primary px-4"
              >
                <Plus size={18} /> Přidat titul
              </button>
            )}
            {!isWatchlist && !isHistory && playlist && (
              <button
                onClick={() => playlist.titleIds.length > 0 ? setShareModalPlaylistId(playlist.id) : setSnackbarMsg('Prázdný seznam nelze sdílet!')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${playlist.titleIds.length > 0 ? 'btn-sm-cancel' : 'bg-[#27272a]/50 text-gray-500 cursor-not-allowed'}`}
                title={playlist.titleIds.length === 0 ? "Prázdný seznam nelze sdílet" : ""}
              >
                <Share2 size={18} /> Sdílet
              </button>
            )}
          </div>
        </div>

        <div className="bg-[#0a0a0f] border border-[#27272a] rounded-xl shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr_2fr_1fr_2fr] gap-4 items-center py-4 px-4 border-b border-[#27272a] text-xs font-semibold text-gray-400 tracking-wider bg-[#0a0a0f] rounded-t-xl group">
            <SortableHeader label="TITULY" field="title" currentSortField={sortField} currentSortOrder={sortOrder} onSort={handleSort} />
            <div className="hidden lg:block">TYP</div>
            <SortableHeader label="ŽÁNR" field="genres" currentSortField={sortField} currentSortOrder={sortOrder} onSort={handleSort} className="hidden lg:flex" />
            <SortableHeader label="HODNOCENÍ" field="rating" currentSortField={sortField} currentSortOrder={sortOrder} onSort={handleSort} className="hidden lg:flex" />
            <SortableHeader label="DOSTUPNOST" field="services" currentSortField={sortField} currentSortOrder={sortOrder} onSort={handleSort} className="hidden lg:flex" />
          </div>

          <div className="flex flex-col">
            {displayedTitles.length > 0 ? (
              displayedTitles.map((title, index) => (
                <TitleCard
                  key={`${title.type}-${title.id}`}
                  title={title}
                  onClick={(m) => setSelectedTitle(m)}
                  onRemoveClick={!isHistory ? (m) => setTitleToRemove(m) : undefined}
                  className={index === displayedTitles.length - 1 ? "rounded-b-xl border-b-0" : ""}
                />
              ))
            ) : (
              <div className="py-12 text-center text-gray-500">
                Tento seznam je prázdný.
              </div>
            )}
          </div>
        </div>

        {allTitles.length > 0 && (
          <Pagination
            totalItems={allTitles.length}
            itemsPerPage={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setPageSize}
          />
        )}

        {selectedTitle && (
          <TitleDetail
            title={selectedTitle}
            onClose={() => setSelectedTitle(null)}
          />
        )}

        {titleToRemove && (
          <RemoveFromPlaylistModal
            titleName={titleToRemove.title}
            playlistName={isWatchlist ? 'Přehrát později' : playlist!.name}
            onClose={() => setTitleToRemove(null)}
            onConfirm={() => {
              if (isWatchlist) {
                toggleWatchlist(titleToRemove.id.toString());
              } else if (playlist) {
                removeFromPlaylist(playlist.id, titleToRemove.id.toString());
              }
              setTitleToRemove(null);
              setSnackbarMsg(`Titul byl odstraněn ze seznamu.`);
            }}
          />
        )}
      </div>
    );
  };

  const renderPreview = (titleIds: string[]) => {
    const previewTitles = getMovies(titleIds.slice(0, 4));

    if (previewTitles.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center border border-dashed border-[#27272a] rounded-lg py-8 mb-4 bg-[#0a0a0f]">
          <span className="text-sm text-gray-500 font-medium">Seznam je prázdný</span>
        </div>
      );
    }

    return (
      <div className="flex-1 flex items-center justify-center mb-4 py-4 relative min-h-[140px]">
        <div className="relative h-28 w-full flex justify-center items-center">
          {previewTitles.map((m, idx) => (
            <img
              key={`${m.id}-${idx}`}
              src={m.poster_url}
              alt={m.title}
              className="absolute w-20 h-28 object-cover rounded shadow-2xl border border-[#27272a] transition-all duration-300 group-hover:scale-110"
              style={{
                left: `calc(50% - 40px + ${(idx - (previewTitles.length - 1) / 2) * 20}px)`,
                zIndex: previewTitles.length - idx,
                transform: `rotate(${(idx - (previewTitles.length - 1) / 2) * 8}deg)`,
                opacity: 1
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderOverview = () => {
    const myPlaylists = playlists.filter(pl => !pl.fromUserId);
    const sharedPlaylists = playlists.filter(pl => !!pl.fromUserId);

    const renderPlaylistCard = (pl: typeof playlists[0]) => (
      <div
        key={pl.id}
        onClick={() => handlePlaylistClick(pl.id)}
        className="panel-container-dark hover:border-[#3f3f46] transition-all cursor-pointer group flex flex-col relative shadow-sm hover:shadow-xl"
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-white group-hover:text-[#dc2626] transition-colors truncate pr-8" title={pl.name}>{pl.name}</h2>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === pl.id ? null : pl.id);
            }}
            className="absolute top-6 right-6 text-gray-400 hover:text-white z-10"
          >
            <MoreHorizontal size={20} />
          </button>

          {openMenuId === pl.id && (
            <div
              ref={menuRef}
              className="absolute top-12 right-6 w-48 bg-[#1c1c24] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden z-20"
            >
              <button
                onClick={(e) => { e.stopPropagation(); handleRename(pl.id, pl.name); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-[#27272a] transition-colors"
              >
                <Edit2 size={16} /> Přejmenovat
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (pl.titleIds.length === 0) {
                    setSnackbarMsg('Prázdný seznam nelze sdílet!');
                  } else {
                    setShareModalPlaylistId(pl.id);
                  }
                  setOpenMenuId(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${pl.titleIds.length > 0 ? 'text-gray-300 hover:text-white hover:bg-[#27272a]' : 'text-gray-600 cursor-not-allowed'}`}
                title={pl.titleIds.length === 0 ? "Prázdný seznam nelze sdílet" : ""}
              >
                <Share2 size={16} /> Sdílet
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(pl.id); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={16} /> Odstranit
              </button>
            </div>
          )}
        </div>

        {renderPreview(pl.titleIds)}

        <div className="text-sm text-gray-500 mt-auto pt-2 border-t border-[#27272a]/50 flex justify-between items-center gap-2">
          <span className="whitespace-nowrap shrink-0">{pl.titleIds.length} {pluralizeItems(pl.titleIds.length)}</span>
          {pl.fromUserId && (
            <span className="text-[10px] bg-[#dc2626]/20 text-[#dc2626] px-1.5 py-0.5 rounded uppercase tracking-wider truncate min-w-0" title={`Od: ${getUsername(pl.fromUserId)}`}>
              Od: {getUsername(pl.fromUserId)}
            </span>
          )}
        </div>
      </div>
    );

    return (
      <div className="p-8 pt-2">
        <h1 className="text-3xl font-bold text-white mb-8">Moje seznamy</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            className="bg-[#111116] border border-[#27272a] border-dashed rounded-xl p-6 hover:border-[#dc2626] transition-all flex flex-col items-center justify-center cursor-pointer min-h-[250px] shadow-sm hover:shadow-xl group"
            onClick={() => setIsCreating(true)}
          >
            {isCreating ? (
              <div className="w-full" onClick={e => e.stopPropagation()}>
                <h3 className="text-white font-bold mb-3 text-center">Nový seznam</h3>
                <input
                  type="text"
                  autoFocus
                  placeholder="Název seznamu..."
                  maxLength={32}
                  value={newPlaylistName}
                  onChange={e => setNewPlaylistName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newPlaylistName.trim()) {
                      createPlaylist(newPlaylistName.trim());
                      setNewPlaylistName('');
                      setIsCreating(false);
                    } else if (e.key === 'Escape') {
                      setIsCreating(false);
                      setNewPlaylistName('');
                    }
                  }}
                  className="w-full bg-[#1c1c24] border border-[#27272a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#dc2626] mb-1 text-center"
                />
                <div className={`text-[10px] mb-3 text-center ${newPlaylistName.length >= 32 ? 'text-[#dc2626]' : 'text-gray-500'}`}>
                  {newPlaylistName.length} / 32 {newPlaylistName.length >= 32 ? '(Limit)' : ''}
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setNewPlaylistName('');
                    }}
                    className="btn-sm-cancel px-4 py-1.5"
                  >
                    Zrušit
                  </button>
                  <button
                    onClick={() => {
                      if (newPlaylistName.trim()) {
                        createPlaylist(newPlaylistName.trim());
                        setNewPlaylistName('');
                        setIsCreating(false);
                      }
                    }}
                    disabled={!newPlaylistName.trim()}
                    className="btn-sm-primary px-4 py-1.5"
                  >
                    Vytvořit
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#1c1c24] flex items-center justify-center text-gray-400 group-hover:text-[#dc2626] group-hover:bg-[#dc2626]/10 transition-all mb-4">
                  <Plus size={32} />
                </div>
                <h2 className="text-lg font-bold text-gray-400 group-hover:text-white transition-colors">Vytvořit seznam</h2>
              </>
            )}
          </div>

          <div
            onClick={() => handlePlaylistClick('__history__')}
            className="panel-container-dark hover:border-[#3f3f46] transition-all cursor-pointer group flex flex-col shadow-sm hover:shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white group-hover:text-[#dc2626] transition-colors">Historie sledování</h2>
            </div>

            {renderPreview(historytitleIds)}

            <div className="text-sm text-gray-500 mt-auto pt-2 border-t border-[#27272a]/50">
              {historytitleIds.length} {pluralizeItems(historytitleIds.length)}
            </div>
          </div>

          <div
            onClick={() => handlePlaylistClick('__watchlist__')}
            className="panel-container-dark hover:border-[#3f3f46] transition-all cursor-pointer group flex flex-col shadow-sm hover:shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white group-hover:text-[#dc2626] transition-colors">Přehrát později</h2>
            </div>

            {renderPreview(watchlist)}

            <div className="text-sm text-gray-500 mt-auto pt-2 border-t border-[#27272a]/50">
              {watchlist.length} {pluralizeItems(watchlist.length)}
            </div>
          </div>

          {myPlaylists.map(renderPlaylistCard)}
        </div>

        {sharedPlaylists.length > 0 && (
          <div className="mt-12">
            <h1 className="text-3xl font-bold text-white mb-8">Uložené seznamy od přátel</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sharedPlaylists.map(renderPlaylistCard)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {activePlaylistId ? renderDetail() : renderOverview()}

      {/* Sdílet */}
      {shareModalPlaylistId && (
        <ShareModal
          modalTitle="Sdílet seznam"
          searchPlaceholder="Hledat přítele..."
          emptyMessage="Nemáte přidané žádné přátele."
          selectionLabel="Vyberte přítele"
          shareBtnText="Sdílet s přítelem"
          items={myFriends.filter(Boolean).map(f => ({
            id: f.id,
            title: f.username,
          }))}
          onClose={() => setShareModalPlaylistId(null)}
          onShare={(friendId, message) => {
            const pl = playlists.find(p => p.id === shareModalPlaylistId);
            if (pl) {
              sharePlaylistAction(friendId, pl, message);
              setShareModalPlaylistId(null);
              setSnackbarMsg('Seznam byl úspěšně sdílen!');
            }
          }}
        />
      )}

      {/* Přejmenovat */}
      {renameModalPlaylistId && (
        <RenamePlaylistModal
          playlistId={renameModalPlaylistId}
          currentName={renamePlaylistName}
          onClose={() => setRenameModalPlaylistId(null)}
          onRename={(id, name) => renamePlaylist(id, name)}
        />
      )}

      {/* Smazat */}
      {deleteModalPlaylistId && (
        <DeletePlaylistModal
          playlistName={playlists.find(p => p.id === deleteModalPlaylistId)?.name}
          onClose={() => setDeleteModalPlaylistId(null)}
          onConfirm={() => {
            deletePlaylist(deleteModalPlaylistId);
            setDeleteModalPlaylistId(null);
            if (activePlaylistId === deleteModalPlaylistId) {
              setActivePlaylistId(null);
            }
          }}
        />
      )}

      {/* Přidat titul do seznamu */}
      {addTitleModalPlaylistId && (
        <SearchTitleForPlaylistModal
          playlistName={addTitleModalPlaylistId === '__watchlist__' ? 'Přehrát později' : playlists.find(p => p.id === addTitleModalPlaylistId)?.name || 'Seznam'}
          currentTitleIds={addTitleModalPlaylistId === '__watchlist__' ? watchlist : playlists.find(p => p.id === addTitleModalPlaylistId)?.titleIds || []}
          onClose={() => setAddTitleModalPlaylistId(null)}
          onToggleTitle={(titleId) => {
            if (addTitleModalPlaylistId === '__watchlist__') {
              toggleWatchlist(titleId);
            } else {
              const currentPlaylist = playlists.find(p => p.id === addTitleModalPlaylistId);
              if (currentPlaylist) {
                if (currentPlaylist.titleIds.includes(titleId)) {
                  removeFromPlaylist(addTitleModalPlaylistId, titleId);
                } else {
                  addToPlaylist(addTitleModalPlaylistId, titleId);
                }
              }
            }
          }}
        />
      )}

      <Snackbar message={snackbarMsg} type={snackbarMsg.includes('Prázdný') ? 'error' : 'success'} onClose={() => setSnackbarMsg('')} />
    </>
  );
}