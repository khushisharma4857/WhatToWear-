import { useState } from 'react'
import { Settings, Star, Share2, Edit2, Check, X, Moon, Sun, Copy, CheckCheck } from 'lucide-react'
import { useProfile } from '../contexts/ProfileContext'
import { useWardrobe } from '../contexts/WardrobeContext'
import { useTheme } from '../contexts/ThemeContext'

const avatarOptions = ['👩‍💼', '👨‍💼', '👩', '👨', '🧑', '👩‍🎨', '👨‍🎨', '🧑‍💻', '👸', '🤴']
const styleOptions = ['Business Casual', 'Streetwear', 'Minimalist', 'Bohemian', 'Preppy', 'Athleisure', 'Classic', 'Eclectic']
const colorOptions = ['Navy Blue', 'Black', 'White', 'Beige', 'Olive', 'Burgundy', 'Grey', 'Pastels']
const occasionOptions = ['Work', 'Casual', 'Formal', 'Date Night', 'Weekend', 'Sport']

export default function Profile() {
  const { profile, updateProfile } = useProfile()
  const { items, outfits } = useWardrobe()
  const { dark, toggleDark } = useTheme()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)
  const [copied, setCopied] = useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  const totalWears = items.reduce((sum, item) => sum + item.wearCount, 0)

  const startEdit = () => { setDraft(profile); setEditing(true) }
  const saveEdit = () => { updateProfile(draft); setEditing(false) }
  const cancelEdit = () => setEditing(false)

  const handleShare = async () => {
    const shareUrl = window.location.origin
    const shareText = `Check out my digital wardrobe on WhatToWear! 👗✨\n${shareUrl}`
    if (navigator.share) {
      try {
        await navigator.share({ title: `${profile.name}'s Wardrobe`, text: shareText, url: shareUrl })
        return
      } catch {}
    }
    await navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        {!editing ? (
          <button onClick={startEdit} className="flex items-center gap-1.5 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium">
            <Edit2 size={15} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={cancelEdit} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <X size={18} className="text-gray-500" />
            </button>
            <button onClick={saveEdit} className="flex items-center gap-1.5 bg-purple-600 text-white px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors">
              <Check size={15} /> Save
            </button>
          </div>
        )}
      </div>

      {/* Profile card */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-4">
          <button
            className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl hover:bg-white/30 transition-colors relative"
            onClick={() => editing && setShowAvatarPicker(v => !v)}
            title={editing ? 'Change avatar' : undefined}
          >
            {draft.avatar}
            {editing && <span className="absolute -bottom-1 -right-1 bg-white text-purple-600 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">✎</span>}
          </button>
          <div className="flex-1">
            {editing ? (
              <input
                value={draft.name}
                onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}
                className="bg-white/20 text-white placeholder-white/60 rounded-xl px-3 py-1.5 text-lg font-bold w-full focus:outline-none focus:bg-white/30 mb-1"
              />
            ) : (
              <h2 className="text-xl font-bold">{profile.name}</h2>
            )}
            {editing ? (
              <input
                value={draft.bio}
                onChange={e => setDraft(p => ({ ...p, bio: e.target.value }))}
                className="bg-white/20 text-white/90 placeholder-white/60 rounded-xl px-3 py-1 text-sm w-full focus:outline-none focus:bg-white/30"
                placeholder="Short bio..."
              />
            ) : (
              <p className="text-purple-100 text-sm">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Avatar picker */}
        {editing && showAvatarPicker && (
          <div className="mt-3 flex flex-wrap gap-2 bg-white/10 rounded-xl p-3">
            {avatarOptions.map(a => (
              <button key={a} onClick={() => { setDraft(p => ({ ...p, avatar: a })); setShowAvatarPicker(false) }}
                className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${draft.avatar === a ? 'bg-white/40' : 'hover:bg-white/20'}`}>
                {a}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-5">
          {[
            { label: 'Items', value: items.length },
            { label: 'Outfits', value: outfits.length },
            { label: 'Wears', value: totalWears },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-purple-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Style preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 mb-4">
        <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Style Preferences</h2>
        <div className="space-y-4">
          {/* Favorite style */}
          <div>
            <label className="text-xs text-gray-400 dark:text-gray-500 block mb-1.5">Favorite Style</label>
            {editing ? (
              <div className="flex flex-wrap gap-2">
                {styleOptions.map(s => (
                  <button key={s} onClick={() => setDraft(p => ({ ...p, style: s }))}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${draft.style === s ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-purple-300'}`}>
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{profile.style}</p>
            )}
          </div>
          {/* Favorite color */}
          <div>
            <label className="text-xs text-gray-400 dark:text-gray-500 block mb-1.5">Favorite Color</label>
            {editing ? (
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(c => (
                  <button key={c} onClick={() => setDraft(p => ({ ...p, favoriteColor: c }))}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${draft.favoriteColor === c ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-purple-300'}`}>
                    {c}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{profile.favoriteColor}</p>
            )}
          </div>
          {/* Go-to occasion */}
          <div>
            <label className="text-xs text-gray-400 dark:text-gray-500 block mb-1.5">Go-to Occasion</label>
            {editing ? (
              <div className="flex flex-wrap gap-2">
                {occasionOptions.map(o => (
                  <button key={o} onClick={() => setDraft(p => ({ ...p, occasion: o }))}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${draft.occasion === o ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-purple-300'}`}>
                    {o}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{profile.occasion}</p>
            )}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-all"
        >
          <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700">
            {dark ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-gray-500" />}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{dark ? 'Light Mode' : 'Dark Mode'}</p>
            <p className="text-xs text-gray-400">Switch to {dark ? 'light' : 'dark'} theme</p>
          </div>
          <div className={`w-11 h-6 rounded-full transition-colors ${dark ? 'bg-purple-600' : 'bg-gray-200'}`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow m-0.5 transition-transform ${dark ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-all"
        >
          <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700">
            {copied ? <CheckCheck size={18} className="text-green-500" /> : <Share2 size={18} className="text-gray-500" />}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{copied ? 'Link copied!' : 'Share with Friends & Family'}</p>
            <p className="text-xs text-gray-400">{copied ? 'Paste the link anywhere' : 'Invite others to see your wardrobe'}</p>
          </div>
          {copied ? <CheckCheck size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
        </button>

        {/* Upgrade */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 cursor-pointer hover:shadow-sm transition-all">
          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/40">
            <Star size={18} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Upgrade to Premium</p>
            <p className="text-xs text-gray-400">Unlock unlimited items, AI styling & more</p>
          </div>
          <span className="text-gray-300">›</span>
        </div>
      </div>
    </div>
  )
}
