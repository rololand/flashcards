import { create } from 'zustand'

export const userState = create((set) => ({
  userName: '',
  isLogged: false,
  isAdmin: false,
  isActive: false,
  isEditor: false,

  setUserName: (newUserName) =>
    set(() => ({
        userName: newUserName,
    })),

  setIsLogged: (flag) =>
    set(() => ({
        isLogged: flag,
    })),
  
  setIsAdmin: (flag) =>
  set(() => ({
      isAdmin: flag,
  })),

  setIsActive: (flag) =>
  set(() => ({
      isActive: flag,
  })),

  setIsEditor: (flag) =>
  set(() => ({
      isEditor: flag,
  })),
}))