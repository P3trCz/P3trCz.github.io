import { StateCreator } from 'zustand';
import { AppState, ServicesCredentialsState } from '../types';

export const createServicesCredentialsModule: StateCreator<
  AppState,
  [],
  [],
  ServicesCredentialsState
> = (set) => ({
  servicesCredentials: {},
  setServiceCredentials: (service, credentials) =>
    set((state) => {
      const userId = state.currentUser?.id;
      if (!userId) return state;

      return {
        servicesCredentials: {
          ...state.servicesCredentials,
          [userId]: {
            ...state.servicesCredentials[userId],
            [service]: credentials,
          },
        },
      };
    }),
});
