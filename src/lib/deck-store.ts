"use client";

import { create } from "zustand";

type DeckState = {
  index: number;
  total: number;
  setTotal: (n: number) => void;
  setIndex: (i: number) => void;
  next: () => void;
  prev: () => void;
  goHome: () => void;
  goEnd: () => void;
};

export const useDeckStore = create<DeckState>((set, get) => ({
  index: 0,
  total: 0,
  setTotal: (n) => set({ total: n }),
  setIndex: (i) => {
    const { total } = get();
    if (total <= 0) return;
    set({ index: Math.max(0, Math.min(total - 1, i)) });
  },
  next: () => {
    const { index, total } = get();
    if (index < total - 1) set({ index: index + 1 });
  },
  prev: () => {
    const { index } = get();
    if (index > 0) set({ index: index - 1 });
  },
  goHome: () => set({ index: 0 }),
  goEnd: () => {
    const { total } = get();
    if (total > 0) set({ index: total - 1 });
  },
}));
