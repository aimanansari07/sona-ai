import { create } from 'zustand'

const useStore = create((set) => ({
  metal: 'gold',
  location: {
    state: 'Maharashtra',
    city: 'Mumbai',
  },
  setMetal: (metal) => set({ metal }),
  setLocation: (location) => set({ location }),
}))

export default useStore