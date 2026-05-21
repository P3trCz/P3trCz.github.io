import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { AuthView } from './components/auth/AuthView';
import { Layout } from './components/layout/Layout';
import { TitleGrid } from './components/catalog/TitleGrid';
import { PlaylistsView } from './components/lists/PlaylistsView';
import { StatsView } from './components/stats/StatsView';
import { SettingsView } from './components/settings/SettingsView';
import { FriendsView } from './components/friends/FriendsView';

export default function App() {
  const currentUser = useAppStore(state => state.currentUser);

  if (!currentUser) {
    return <AuthView />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TitleGrid />} />
          <Route path="lists" element={<PlaylistsView />} />
          <Route path="stats" element={<StatsView />} />
          <Route path="friends" element={<FriendsView />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
