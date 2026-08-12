"use client";

import { create } from "zustand";

type DeckState = {
  index: number;
  total: number;
  ids: string[];
  setTotal: (n: number) => void;
  setIds: (ids: string[]) => void;
  setIndex: (i: number) => void;
  jumpToId: (id: string) => void;
  next: () => void;
  prev: () => void;
  goHome: () => void;
  goEnd: () => void;
};

export const useDeckStore = create<DeckState>((set, get) => ({
  index: 0,
  total: 0,
  ids: [],
  setTotal: (n) => set({ total: n }),
  setIds: (ids) => set({ ids }),
  setIndex: (i) => {
    const { total } = get();
    if (total <= 0) return;
    set({ index: Math.max(0, Math.min(total - 1, i)) });
  },
  jumpToId: (id) => {
    const { ids } = get();
    const i = ids.indexOf(id);
    if (i >= 0) get().setIndex(i);
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
