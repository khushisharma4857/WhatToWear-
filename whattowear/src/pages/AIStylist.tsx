import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send } from 'lucide-react'
import { useWardrobe } from '../contexts/WardrobeContext'
import { aiOutfitSuggestions } from '../data/mockData'

const samplePrompts = [
  'What should I wear to a job interview?',
  'Outfit for a casual Friday at work',
  'Date night outfit suggestions',
  'What goes with my navy blazer?',
]

interface Message { role: 'user' | 'ai'; content: string }

export default function AIStylist() {
  const { items } = useWardrobe()
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hi! I'm your AI stylist. Tell me about the occasion, weather, or what you're looking for, and I'll suggest the perfect outfit from your wardrobe! 👗✨" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const getItem = (id: string) => items.find(i => i.id === id)

  const handleSend = (text?: string) => {
    const msg = text || input
    if (!msg.trim() || loading) return
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setInput('')
    setLoading(true)
    setTimeout(() => {
      const responses = [
        "Based on your wardrobe, I'd suggest pairing your **White Oxford Shirt** with **Khaki Chinos** and **White Sneakers** — perfect for a smart casual look! 👔",
        "Great choice! Your **Navy Blazer** pairs beautifully with the **Black Skinny Jeans** and **Leather Oxford Shoes** for a polished ensemble. 🧥",
        "For that occasion, I recommend your **Silk Blouse** with the **Black Skinny Jeans** — chic yet comfortable. Add the **Red Wool Scarf** if it's cool outside! ✨",
        "Your **Floral Summer Dress** with **White Sneakers** would be perfect! Light, breezy, and stylish for the weather today. 🌸",
      ]
      setMessages(prev => [...prev, { role: 'ai', content: responses[Math.floor(Math.random() * responses.length)] }])
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles size={24} className="text-purple-500" /> AI Stylist
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Your personal styling assistant</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200">Today's Suggestions</h2>
          {aiOutfitSuggestions.map(suggestion => (
            <div key={suggestion.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{suggestion.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{suggestion.description}</p>
                </div>
                <span className="text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-full font-medium">{suggestion.confidence}% match</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-500 dark:text-gray-400">{suggestion.weather}</span>
                <span className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full capitalize">{suggestion.occasion}</span>
              </div>
              <div className="flex gap-2">
                {suggestion.items.map(itemId => {
                  const item = getItem(itemId)
                  if (!item) return null
                  return (
                    <div key={itemId} className="w-12 h-12 rounded-xl flex items-center justify-center text-xl overflow-hidden" style={{ backgroundColor: item.imageColor + '40' }} title={item.name}>
                      {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : item.emoji}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Chat with Stylist</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col h-96">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-sm' : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl rounded-bl-sm px-4 py-2.5">
                    <div className="flex gap-1">
                      {[0, 150, 300].map(d => (
                        <span key={d} className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="p-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask your stylist..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <button onClick={() => handleSend()} disabled={loading} className="bg-purple-600 text-white p-2 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Quick prompts:</p>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map(prompt => (
                <button key={prompt} onClick={() => handleSend(prompt)} className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors">
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
