import { StateCreator } from 'zustand';
import { AppState, SubscriptionsState } from '../types';
import { INITIAL_SUBSCRIPTIONS } from '../../data/initialData';
import { updateUserRecord, toggleItemInArray } from '../../utils/storeUtils';

export const createSubscriptionsModule: StateCreator<AppState, [], [], SubscriptionsState> = (set, get) => ({
  subscriptions: INITIAL_SUBSCRIPTIONS,
  toggleSubscription: (service) => {
    const userId = get().currentUser?.id;
    if (!userId) return;

    set((state) => ({
      subscriptions: updateUserRecord(state.subscriptions, userId, (arr) => toggleItemInArray(arr, service))
    }));
  },
});
