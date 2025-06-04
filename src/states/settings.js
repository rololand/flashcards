import { create } from 'zustand'

export const settings = create((set) => ({
  isMuted: false,
  toggleIsMuted: () =>
    set((state) => ({ isMuted: !state.isMuted })),

  primaryLanguage: 'pl-PL',
  setPrimaryLanguage: (language) =>
    set(() => ({
      primaryLanguage: language,
    })),
  
  secondaryLanguage: 'de-DE',
  setSecondaryLanguage: (language) =>
    set(() => ({
      secondaryLanguage: language,
    })),
  
  tokenRef: null,
  setTokenRef: (language) =>
    set(() => ({
      tokenRef: language,
    })),
  
  regionRef: null,
  setRegionRef: (language) =>
    set(() => ({
      regionRef: language,
    })),
}))