import { create } from 'zustand'

export const settings = create((set, get) => ({
  isMuted: false,
  toggleIsMuted: () =>
    set((state) => ({ isMuted: !state.isMuted })),
  setIsMuted: (flag) =>
    set(() => ({
      isMuted: flag,
    })),
  uiLang: "pl-PL",
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

  numberOfNewWords: {
    "pl-PL": 10,
    "de-DE": 10,
    "en-GB": 30,
    "it-IT": 3,
    "es-ES": 10
  },
  
  lang_1: '',
  lang_2: '',
  lang_3: '',
  lang_4: '',
  lang_5: '',
  learn_langs: [],
  setLang_1: (language) =>
    set(() => ({
      lang_1: language,
    })),
  
  setLang_2: (language) =>
    set(() => {
      const state = get();
      return {
        lang_2: language,
        learn_langs: [language, state.lang_3, state.lang_4, state.lang_5],
      };
    }),

  setLang_3: (language) =>
    set(() => {
      const state = get();
      return {
        lang_3: language,
        learn_langs: [state.lang_2, language, state.lang_4, state.lang_5],
      };
    }),

  setLang_4: (language) =>
    set(() => {
      const state = get();
      return {
        lang_4: language,
        learn_langs: [state.lang_2, state.lang_3, language, state.lang_5],
      };
    }),

  setLang_5: (language) =>
    set(() => {
      const state = get();
      return {
        lang_5: language,
        learn_langs: [state.lang_2, state.lang_3, state.lang_4, language],
      };
    }),

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