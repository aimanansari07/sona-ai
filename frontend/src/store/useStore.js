import { create } from 'zustand'

const useStore = create((set) => ({
  metal: 'gold',
  location: {
    state: 'Maharashtra',
    city: 'Mumbai',
  },
  purity: '22K',  // Default to 22K (most common in India)
  unit: 10,       // Default to 10 grams
  
  setMetal: (metal) => set({ 
    metal,
    purity: metal === 'gold' ? '22K' : '24K',
    unit: metal === 'gold' ? 10 : 100
  }),
  setLocation: (location) => set({ location }),
  setPurity: (purity) => set({ purity }),
  setUnit: (unit) => set({ unit }),
}))

export default useStore