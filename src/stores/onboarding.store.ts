import { create } from "zustand"

interface OnboardingState {
  location: string | null
  categories: string[]
  businessScale: string | null
  platforms: string[]
  currentStep: 1 | 2 | 3
  setLocation: (location: string) => void
  toggleCategory: (category: string) => void
  setScale: (scale: string) => void
  togglePlatform: (platform: string) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  location: null,
  categories: [],
  businessScale: null,
  platforms: [],
  currentStep: 1,

  setLocation: (location) => set({ location }),

  toggleCategory: (category) =>
    set((state) => ({
      categories: state.categories.includes(category)
        ? state.categories.filter((c) => c !== category)
        : [...state.categories, category],
    })),

  setScale: (businessScale) => set({ businessScale }),

  togglePlatform: (platform) =>
    set((state) => ({
      platforms: state.platforms.includes(platform)
        ? state.platforms.filter((p) => p !== platform)
        : [...state.platforms, platform],
    })),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(3, state.currentStep + 1) as 1 | 2 | 3,
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(1, state.currentStep - 1) as 1 | 2 | 3,
    })),

  reset: () =>
    set({
      location: null,
      categories: [],
      businessScale: null,
      platforms: [],
      currentStep: 1,
    }),
}))
