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
  
  currentExercisePage: 'welcomePage',
  setCurrentExercisePage: (newCurrentExercisePage) =>
    set(() => {
      // console.log('set currentExercisePage: ' + newCurrentExercisePage)
      return {
        currentExercisePage: newCurrentExercisePage,
      }
    }),
}))