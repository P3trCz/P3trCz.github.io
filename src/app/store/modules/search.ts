import { StateCreator } from 'zustand';
import { AppState, SearchState } from '../types';

export const createSearchModule: StateCreator<AppState, [], [], SearchState> = (set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
});
