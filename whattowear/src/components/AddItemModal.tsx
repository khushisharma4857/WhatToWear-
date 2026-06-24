import { useState, useRef } from 'react'
import { X, Upload, ImagePlus, Sparkles, Loader2 } from 'lucide-react'
import { removeBackground } from '@imgly/background-removal'
import { ClothingItem, categories, occasions, seasons } from '../data/mockData'

interface Props {
  onClose: () => void
  onAdd: (item: ClothingItem) => void
}

const emojiByCategory: Record<string, string> = {
  Tops: '👕', Bottoms: '👖', Dresses: '👗',
  Outerwear: '🧥', Shoes: '👟', Accessories: '🧣',
}

type BgState = 'idle' | 'processing' | 'done' | 'error'

export default function AddItemModal({ onClose, onAdd }: Props) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Tops')
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>(['all'])
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(['casual'])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [bgState, setBgState] = useState<BgState>('idle')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please upload an image file.'); return }

    setError('')
    setBgState('processing')
    // Show original immediately so user isn't left waiting
    const originalUrl = URL.createObjectURL(file)
    setImageUrl(originalUrl)

    try {
      const blob = await removeBackground(file)
      const processedUrl = URL.createObjectURL(blob)
      // Revoke the old object URL to free memory
      URL.revokeObjectURL(originalUrl)
      setImageUrl(processedUrl)
      setBgState('done')
    } catch (err) {
      console.warn('Background removal failed, keeping original:', err)
      setBgState('error')
    }
  }

  const toggleSeason = (s: string) => {
    if (s === 'all') { setSelectedSeasons(['all']); return }
    setSelectedSeasons(prev => {
      const without = prev.filter(x => x !== 'all')
      return without.includes(s) ? without.filter(x => x !== s) : [...without, s]
    })
  }

  const toggleOccasion = (o: string) =>
    setSelectedOccasions(prev =>
      prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o]
    )

  const handleSubmit = () => {
    if (!name.trim()) { setError('Please enter a name for your item.'); return }
    if (selectedSeasons.length === 0) { setError('Please select at least one season.'); return }
    if (selectedOccasions.length === 0) { setError('Please select at least one occasion.'); return }
    onAdd({
      id: Date.now().toString(),
      name: name.trim(),
      category,
      color: 'custom',
      season: selectedSeasons,
      occasion: selectedOccasions,
      imageColor: '#e5e7eb',
      imageUrl: imageUrl ?? undefined,
      emoji: emojiByCategory[category] || '👕',
      wearCount: 0,
    })
    onClose()
  }

  const resetImage = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl)
    setImageUrl(null)
    setBgState('idle')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-white dark:bg-gray-800 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Clothing Item</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-3 py-2 rounded-xl">
              {error}
            </div>
          )}

          {/* Photo upload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Photo <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              {bgState === 'processing' && (
                <span className="flex items-center gap-1 text-xs text-purple-500 font-medium">
                  <Loader2 size={11} className="animate-spin" /> Removing background…
                </span>
              )}
              {bgState === 'done' && (
                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <Sparkles size={11} /> Background removed
                </span>
              )}
              {bgState === 'error' && (
                <span className="text-xs text-gray-400">Original photo kept</span>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {imageUrl ? (
              <div
                className="relative rounded-2xl overflow-hidden h-44"
                style={{
                  background:
                    bgState === 'done'
                      ? 'repeating-conic-gradient(#e5e7eb 0% 25%, #f9fafb 0% 50%) 0 0 / 16px 16px'
                      : undefined,
                  backgroundColor: bgState !== 'done' ? '#f3f4f6' : undefined,
                }}
              >
                <img src={imageUrl} alt="preview" className="w-full h-full object-contain" />
                {bgState === 'processing' && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={28} className="text-purple-500 animate-spin" />
                      <p className="text-xs font-medium text-purple-700 dark:text-purple-300">
                        Isolating garment…
                      </p>
                    </div>
                  </div>
                )}
                <button
                  onClick={resetImage}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 transition-colors"
                >
                  <X size={14} />
                </button>
                {bgState !== 'processing' && (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs px-3 py-1.5 rounded-full shadow font-medium"
                  >
                    Change photo
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full h-36 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-500 hover:border-purple-400 hover:text-purple-400 dark:hover:border-purple-500 dark:hover:text-purple-400 transition-colors"
              >
                <div className="flex gap-3">
                  <Upload size={22} />
                  <ImagePlus size={22} />
                </div>
                <span className="text-sm font-medium">Tap to upload or take a photo</span>
                <span className="flex items-center gap-1 text-xs text-purple-400">
                  <Sparkles size={11} /> AI will remove the background automatically
                </span>
              </button>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 block mb-1.5">
              Item Name
            </label>
            <input
              type="text"
              placeholder="e.g. Blue Linen Shirt"
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 block mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.filter(c => c !== 'All').map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 rounded-xl text-sm font-medium border transition-colors ${
                    category === cat
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-300'
                  }`}
                >
                  {emojiByCategory[cat]} {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Season */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 block mb-1.5">
              Season
            </label>
            <div className="flex flex-wrap gap-2">
              {(['all', ...seasons] as string[]).map(s => (
                <button
                  key={s}
                  onClick={() => toggleSeason(s)}
                  className={`px-3 py-1.5 rounded-full text-sm capitalize border transition-colors ${
                    selectedSeasons.includes(s)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-300'
                  }`}
                >
                  {s === 'all' ? 'All Seasons' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Occasion */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 block mb-1.5">
              Occasion
            </label>
            <div className="flex flex-wrap gap-2">
              {occasions.map(o => (
                <button
                  key={o}
                  onClick={() => toggleOccasion(o)}
                  className={`px-3 py-1.5 rounded-full text-sm capitalize border transition-colors ${
                    selectedOccasions.includes(o)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-300'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={bgState === 'processing'}
            className="flex-1 py-3 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {bgState === 'processing' ? 'Processing…' : 'Add to Wardrobe'}
          </button>
        </div>
      </div>
    </div>
  )
}
