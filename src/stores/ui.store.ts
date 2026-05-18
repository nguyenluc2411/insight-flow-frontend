import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UIState {
  isDarkMode: boolean
  language: "vi" | "en"
  isSidebarOpen: boolean
  toggleDarkMode: () => void
  setLanguage: (lang: "vi" | "en") => void
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      language: "vi",
      isSidebarOpen: false,
      toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
      setLanguage: (language) => set({ language }),
      toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
    }),
    { name: "ui-storage" }
  )
)
