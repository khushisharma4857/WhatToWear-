import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { categories, ClothingItem } from '../data/mockData'
import { useWardrobe } from '../contexts/WardrobeContext'
import ClothingCard from '../components/ClothingCard'
import AddItemModal from '../components/AddItemModal'

export default function Wardrobe() {
  const { items, loading, addItem, deleteItem, wearItem } = useWardrobe()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filtered = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {showModal && (
        <AddItemModal onClose={() => setShowModal(false)} onAdd={(item: ClothingItem) => addItem(item)} />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Wardrobe</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} items · {filtered.length} showing</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search your wardrobe..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-purple-300'
            }`}
          >{cat}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl mb-4 block">👗</span>
          <p className="text-lg font-medium">No items found</p>
          <p className="text-sm">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map(item => (
            <ClothingCard key={item.id} item={item} onDelete={deleteItem} onWear={wearItem} />
          ))}
        </div>
      )}
    </div>
  )
}
