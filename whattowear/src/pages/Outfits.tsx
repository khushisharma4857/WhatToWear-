import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useWardrobe } from '../contexts/WardrobeContext'
import OutfitBuilderModal from '../components/OutfitBuilderModal'

export default function Outfits() {
  const { items, outfits, addOutfit, deleteOutfit } = useWardrobe()
  const [showBuilder, setShowBuilder] = useState(false)

  const getItem = (id: string) => items.find(i => i.id === id)

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {showBuilder && (
        <OutfitBuilderModal
          items={items}
          onClose={() => setShowBuilder(false)}
          onSave={outfit => { addOutfit(outfit); setShowBuilder(false) }}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Outfits</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{outfits.length} saved outfits</p>
        </div>
        <button
          onClick={() => setShowBuilder(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          <Plus size={16} /> Create Outfit
        </button>
      </div>

      {outfits.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">👗</span>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No outfits yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Hit "Create Outfit" to build your first one</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {outfits.map(outfit => (
            <div key={outfit.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow group">
              <div className="flex gap-2 mb-3 flex-wrap">
                {outfit.items.map(itemId => {
                  const item = getItem(itemId)
                  if (!item) return null
                  return (
                    <div
                      key={itemId}
                      className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: item.imageColor + '40' }}
                      title={item.name}
                    >
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        : item.emoji}
                    </div>
                  )
                })}
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">{outfit.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full capitalize">{outfit.occasion}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{outfit.createdAt}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteOutfit(outfit.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  title="Delete outfit"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() => setShowBuilder(true)}
            className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-500 hover:border-purple-300 dark:hover:border-purple-500 hover:text-purple-400 transition-colors min-h-[140px]"
          >
            <Plus size={24} />
            <span className="text-sm font-medium">Create New Outfit</span>
          </button>
        </div>
      )}
    </div>
  )
}
