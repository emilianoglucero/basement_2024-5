import { create } from 'zustand'

// Extend this store if you need!

export interface AppStore {
  fontsLoaded: boolean
  setFontsLoaded: (fontsLoaded: boolean) => void
  trophyRef: React.RefObject<HTMLDivElement> | null
  setTrophyRef: (trophyRef: React.RefObject<HTMLDivElement>) => void
}

export const useAppStore = create<AppStore>((set) => ({
  fontsLoaded: false,
  setFontsLoaded: (fontsLoaded: boolean) => set((s) => ({ ...s, fontsLoaded })),
  trophyRef: null,
  setTrophyRef: (trophyRef: React.RefObject<HTMLDivElement>) =>
    set((s) => ({ ...s, trophyRef }))
}))
