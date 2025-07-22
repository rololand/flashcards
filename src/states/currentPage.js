import { create } from 'zustand'

export const currentPageState = create((set) => ({
  currentPage: 'homePage',

  setCurrentPage: (newCurrentPage) =>
    set(() => {
      // console.log('set currentPage: ' + newCurrentPage)
      return {
        currentPage: newCurrentPage,
      }
    }),
}))