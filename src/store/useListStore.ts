import { create } from 'zustand';
import type { MealSummary } from '../types';

type Source =
  | { view: 'list'; query: string }
  | { view: 'gallery'; filters: string[] }
  | { view: null };

interface ListState {
  // The current in-memory list the user is browsing 
  items: MealSummary[];
  setItems: (items: MealSummary[]) => void;

  source: Source;
  setSource: (s: Source) => void;
}

export const useListStore = create<ListState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  source: { view: null },
  setSource: (source) => set({ source }),
}));
