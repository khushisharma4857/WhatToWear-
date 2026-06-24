import { useState } from 'react'
import { X, Check, Plus } from 'lucide-react'
import { ClothingItem, Outfit, occasions } from '../data/mockData'

interface Props {
  items: ClothingItem[]
  onClose: () => void
  onSave: (outfit: Outfit) => void
}

export default function OutfitBuilderModal({ items, onClose, onSave }: Props) {
  const [name, setName] = useState('')
  const [occasion, setOccasion] = useState('casual')
  const [selected, setSelected] = useState<string[]>([])
  const [filterCat, setFilterCat] = useState('All')
  const [error, setError] = useState('')

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))]

  const filtered = items.filter(i => filterCat === 'All' || i.category === filterCat)

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleSave = () => {
    if (!name.trim()) { setError('Give your outfit a name.'); return }
    if (selected.length < 2) { setError('Pick at least 2 items.'); return }
    onSave({
      id: Date.now().toString(),
      name: name.trim(),
      items: selected,
      occasion,
      createdAt: new Date().toISOString().split('T')[0],
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Build an Outfit</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Selected preview */}
        {selected.length > 0 && (
          <div className="px-5 pt-4 flex gap-2 flex-wrap">
            {selected.map(id => {
              const item = items.find(i => i.id === id)!
              return (
                <div key={id} className="relative">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl border-2 border-purple-500"
                    style={{ backgroundColor: item.imageColor + '40' }}
                    title={item.name}
                  >
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                      : item.emoji}
                  </div>
                  <button
                    onClick={() => toggle(id)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                  >×</button>
                </div>
              )
            })}
          </div>
        )}

        {/* Name & occasion */}
        <div className="px-5 pt-4 space-y-3">
          {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl">{error}</p>}
          <input
            type="text"
            placeholder="Outfit name, e.g. Friday Casual"
            value={name}
            onChange={e => { setName(e.target.value); setError('') }}
            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <div className="flex gap-2 flex-wrap">
            {occasions.map(o => (
              <button
                key={o}
                onClick={() => setOccasion(o)}
                className={`px-3 py-1.5 rounded-full text-xs capitalize border transition-colors ${
                  occasion === o
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-300'
                }`}
              >{o}</button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="px-5 pt-3 flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap border transition-colors ${
                filterCat === cat
                  ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-900 border-transparent'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
              }`}
            >{cat}</button>
          ))}
        </div>

        {/* Items grid */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          <div className="grid grid-cols-3 gap-2">
            {filtered.map(item => {
              const isSelected = selected.includes(item.id)
              return (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className={`relative rounded-2xl overflow-hidden border-2 transition-all text-left ${
                    isSelected
                      ? 'border-purple-500 shadow-md scale-95'
                      : 'border-gray-100 dark:border-gray-600 hover:border-purple-300'
                  }`}
                >
                  <div
                    className="h-24 flex items-center justify-center text-3xl"
                    style={{ backgroundColor: item.imageColor + '40' }}
                  >
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      : item.emoji}
                  </div>
                  <div className="p-1.5 bg-white dark:bg-gray-800">
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-100 truncate">{item.name}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check size={11} className="text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
            <Plus size={16} /> Save Outfit
          </button>
        </div>
      </div>
    </div>
  )
}
