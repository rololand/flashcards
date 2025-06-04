import { create } from 'zustand'

export const isLoadedState = create((set) => ({
  isLoaded: false,

  setIsLoaded: (flag) =>
    set(() => ({
        isLoaded: flag,
    })),
}))