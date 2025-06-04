import { create } from 'zustand'

export const isExerciseFinishedState = create((set) => ({
  isExerciseFinished: false,

  setIsExerciseFinished: (flag) =>
    set(() => ({
        isExerciseFinished: flag,
    })),
}))