import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { Auth } from './components/Pages/Auth/Auth';
import { Layout } from './components/Layout/Layout';
import { TitleGrid } from './components/Pages/Catalog/TitleGrid';
import { Playlists } from './components/Pages/Playlists';
import { Stats } from './components/Pages/Stats/Stats';
import { Settings } from './components/Pages/Settings';
import { Friends } from './components/Pages/Friends';
import { MarkAsWatchedModal } from './components/shared/modals/MarkAsWatchedModal';

export default function App() {
  const currentUser = useAppStore(state => state.currentUser);

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TitleGrid />} />
          <Route path="lists" element={<Playlists />} />
          <Route path="stats" element={<Stats />} />
          <Route path="friends" element={<Friends />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <MarkAsWatchedModal />
    </BrowserRouter>
  );
}
