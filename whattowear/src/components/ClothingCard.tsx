import { Trash2, Shirt } from 'lucide-react'
import { ClothingItem } from '../data/mockData'

interface Props {
  item: ClothingItem
  onDelete: (id: string) => void
  onWear: (id: string) => void
}

export default function ClothingCard({ item, onDelete, onWear }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="h-44 relative overflow-hidden bg-gray-100 dark:bg-gray-700">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{ backgroundColor: item.imageColor + '40' }}
          >
            {item.emoji}
          </div>
        )}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
            {item.wearCount}× worn
          </span>
        </div>
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onWear(item.id)}
            className="bg-purple-500 hover:bg-purple-600 text-white p-1.5 rounded-full shadow"
            title="Mark as worn today"
          >
            <Shirt size={13} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow"
            title="Delete item"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <div className="p-3">
        <p className="font-medium text-gray-800 dark:text-gray-100 text-sm truncate">{item.name}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.category}</p>
        <div className="flex gap-1 mt-2 flex-wrap">
          {item.occasion.slice(0, 2).map(occ => (
            <span key={occ} className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full capitalize">
              {occ}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
