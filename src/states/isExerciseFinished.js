import { create } from 'zustand'

export const isExerciseFinishedState = create((set) => ({
  isExerciseFinished: false,

  setIsExerciseFinished: (flag) =>
    set(() => {
      // console.log('set isExerciseFinished: ' + flag)
      return {
          isExerciseFinished: flag,
      }
    }
      ),
}))