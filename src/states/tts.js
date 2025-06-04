import { create } from 'zustand';

export const useTTS = create((set, get) => ({
  queue: [],
  isSpeaking: false,
  synthesizer: null,
  isDisposed: false,

  enqueue: (text, lang = 'pl-PL') => {
    set((state) => ({
      queue: [...state.queue, { text, lang }]
    }));
  },

  dequeue: () => {
    const [, ...rest] = get().queue;
    set({ queue: rest });
  },

  setSpeaking: (val) => set({ isSpeaking: val }),

  setSynthesizer: (synth) => set({ synthesizer: synth, isDisposed: false }),

  clearQueue: () => {
    const { synthesizer, isDisposed } = get();

    if (synthesizer && !isDisposed) {
      try {
        synthesizer.close();
      } catch (e) {
        console.warn('[TTS] Błąd przy zamykaniu syntezatora:', e);
      }
    }

    set({ queue: [], isSpeaking: false, synthesizer: null, isDisposed: true });
  },

  markDisposed: () => set({ isDisposed: true }),
}));
