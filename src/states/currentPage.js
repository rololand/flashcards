import { create } from 'zustand'

export const currentPageState = create((set) => ({
  currentPage: 'homePage',

  setCurrentPage: (newCurrentPage) =>
    set(() => ({
        currentPage: newCurrentPage,
    })),
}))