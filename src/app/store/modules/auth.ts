import { StateCreator } from 'zustand';
import { AppState, AuthState } from '../types';

export const createAuthModule: StateCreator<AppState, [], [], AuthState> = (set) => ({
  currentUser: null,
  language: 'cs',
  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null, searchQuery: '' }),
  setLanguage: (lang) => set({ language: lang }),
  updateUsername: (newUsername) => set(state => ({
    currentUser: state.currentUser ? { ...state.currentUser, username: newUsername } : null
  })),
});
