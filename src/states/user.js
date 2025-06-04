import { create } from 'zustand'

export const userState = create((set) => ({
  userName: '',
  isLogged: false,

  setUserName: (newUserName) =>
    set(() => ({
        userName: newUserName,
    })),

  setIsLogged: (flag) =>
    set(() => ({
        isLogged: flag,
    })),
}))