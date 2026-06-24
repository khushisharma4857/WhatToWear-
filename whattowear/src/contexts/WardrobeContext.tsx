import { createContext, useContext, useState, useEffect } from 'react'
import { ClothingItem, Outfit } from '../data/mockData'

interface WardrobeContextType {
  items: ClothingItem[]
  loading: boolean
  addItem: (item: ClothingItem) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  wearItem: (id: string) => Promise<void>
  outfits: Outfit[]
  addOutfit: (outfit: Outfit) => Promise<void>
  deleteOutfit: (id: string) => Promise<void>
}

const WardrobeContext = createContext<WardrobeContextType>({
  items: [], loading: true,
  addItem: async () => {}, deleteItem: async () => {}, wearItem: async () => {},
  outfits: [], addOutfit: async () => {}, deleteOutfit: async () => {},
})

export function WardrobeProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ClothingItem[]>([])
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/items').then(r => r.json()),
      fetch('/api/outfits').then(r => r.json()),
    ]).then(([fetchedItems, fetchedOutfits]) => {
      setItems(fetchedItems)
      setOutfits(fetchedOutfits)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const addItem = async (item: ClothingItem) => {
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    const saved = await res.json()
    setItems(p => [saved, ...p])
  }

  const deleteItem = async (id: string) => {
    await fetch(`/api/items/${id}`, { method: 'DELETE' })
    setItems(p => p.filter(i => i.id !== id))
  }

  const wearItem = async (id: string) => {
    const res = await fetch(`/api/items/${id}/wear`, { method: 'PATCH' })
    const updated = await res.json()
    setItems(p => p.map(i => i.id === id ? updated : i))
  }

  const addOutfit = async (outfit: Outfit) => {
    const res = await fetch('/api/outfits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(outfit),
    })
    const saved = await res.json()
    setOutfits(p => [saved, ...p])
  }

  const deleteOutfit = async (id: string) => {
    await fetch(`/api/outfits/${id}`, { method: 'DELETE' })
    setOutfits(p => p.filter(o => o.id !== id))
  }

  return (
    <WardrobeContext.Provider value={{ items, loading, addItem, deleteItem, wearItem, outfits, addOutfit, deleteOutfit }}>
      {children}
    </WardrobeContext.Provider>
  )
}

export const useWardrobe = () => useContext(WardrobeContext)
