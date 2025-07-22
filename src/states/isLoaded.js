import { create } from 'zustand'

export const isLoadedState = create((set) => ({
  isLoaded: false,

  setIsLoaded: (flag) =>
    set(() => {
      // console.log('set isLoaded: ' + flag)
      return {
        isLoaded: flag,
      }
    }),
}))