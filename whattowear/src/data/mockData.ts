export interface ClothingItem {
  id: string
  name: string
  category: string
  color: string
  season: string[]
  occasion: string[]
  imageColor: string
  imageUrl?: string
  emoji: string
  wearCount: number
  lastWorn?: string
}

export interface Outfit {
  id: string
  name: string
  items: string[]
  occasion: string
  createdAt: string
}

export const clothingItems: ClothingItem[] = [
  { id: '1', name: 'White Oxford Shirt', category: 'Tops', color: 'white', season: ['spring', 'summer', 'fall'], occasion: ['work', 'casual'], imageColor: '#f5f5f5', emoji: '👔', wearCount: 12, lastWorn: '2026-06-20' },
  { id: '2', name: 'Navy Blazer', category: 'Outerwear', color: 'navy', season: ['fall', 'winter', 'spring'], occasion: ['work', 'formal'], imageColor: '#1e3a5f', emoji: '🧥', wearCount: 8, lastWorn: '2026-06-18' },
  { id: '3', name: 'Black Skinny Jeans', category: 'Bottoms', color: 'black', season: ['all'], occasion: ['casual', 'work'], imageColor: '#1a1a1a', emoji: '👖', wearCount: 25, lastWorn: '2026-06-22' },
  { id: '4', name: 'Floral Summer Dress', category: 'Dresses', color: 'multicolor', season: ['summer', 'spring'], occasion: ['casual', 'date'], imageColor: '#f9a8d4', emoji: '👗', wearCount: 5, lastWorn: '2026-06-10' },
  { id: '5', name: 'Grey Cashmere Sweater', category: 'Tops', color: 'grey', season: ['fall', 'winter'], occasion: ['casual', 'work'], imageColor: '#9ca3af', emoji: '🧶', wearCount: 15, lastWorn: '2026-03-15' },
  { id: '6', name: 'White Sneakers', category: 'Shoes', color: 'white', season: ['all'], occasion: ['casual', 'sport'], imageColor: '#ffffff', emoji: '👟', wearCount: 40, lastWorn: '2026-06-24' },
  { id: '7', name: 'Leather Oxford Shoes', category: 'Shoes', color: 'brown', season: ['all'], occasion: ['work', 'formal'], imageColor: '#92400e', emoji: '👞', wearCount: 18, lastWorn: '2026-06-19' },
  { id: '8', name: 'Silk Blouse', category: 'Tops', color: 'cream', season: ['spring', 'summer', 'fall'], occasion: ['work', 'formal', 'date'], imageColor: '#fef3c7', emoji: '👚', wearCount: 7, lastWorn: '2026-06-15' },
  { id: '9', name: 'Khaki Chinos', category: 'Bottoms', color: 'khaki', season: ['spring', 'summer', 'fall'], occasion: ['casual', 'work'], imageColor: '#d4a574', emoji: '👖', wearCount: 20, lastWorn: '2026-06-21' },
  { id: '10', name: 'Red Wool Scarf', category: 'Accessories', color: 'red', season: ['fall', 'winter'], occasion: ['casual', 'work'], imageColor: '#dc2626', emoji: '🧣', wearCount: 10, lastWorn: '2026-02-10' },
  { id: '11', name: 'Denim Jacket', category: 'Outerwear', color: 'blue', season: ['spring', 'fall'], occasion: ['casual'], imageColor: '#3b82f6', emoji: '🧥', wearCount: 14, lastWorn: '2026-04-20' },
  { id: '12', name: 'Little Black Dress', category: 'Dresses', color: 'black', season: ['all'], occasion: ['formal', 'date', 'party'], imageColor: '#111827', emoji: '👗', wearCount: 6, lastWorn: '2026-05-30' },
]

export const outfits: Outfit[] = [
  { id: '1', name: 'Business Casual Monday', items: ['1', '2', '9', '7'], occasion: 'work', createdAt: '2026-06-01' },
  { id: '2', name: 'Weekend Casual', items: ['5', '3', '6'], occasion: 'casual', createdAt: '2026-06-10' },
  { id: '3', name: 'Date Night', items: ['12', '7'], occasion: 'date', createdAt: '2026-06-15' },
]

export const aiOutfitSuggestions = [
  {
    id: 's1',
    name: 'Smart Casual for Today',
    description: 'Perfect for a warm summer day at the office',
    items: ['1', '9', '6'],
    weather: '☀️ 75°F',
    occasion: 'work',
    confidence: 94,
  },
  {
    id: 's2',
    name: 'Evening Out',
    description: 'Chic and comfortable for a dinner date',
    items: ['8', '3', '7'],
    weather: '🌆 Evening',
    occasion: 'date',
    confidence: 88,
  },
  {
    id: 's3',
    name: 'Weekend Brunch',
    description: 'Relaxed and stylish for weekend plans',
    items: ['4', '6'],
    weather: '⛅ 68°F',
    occasion: 'casual',
    confidence: 91,
  },
]

export const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories']
export const occasions = ['work', 'casual', 'formal', 'date', 'sport', 'party']
export const seasons = ['spring', 'summer', 'fall', 'winter']
