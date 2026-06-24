import { useWardrobe } from '../contexts/WardrobeContext'

export default function Analytics() {
  const { items } = useWardrobe()

  const totalItems = items.length
  const totalWears = items.reduce((sum, item) => sum + item.wearCount, 0)
  const avgWears = totalItems ? (totalWears / totalItems).toFixed(1) : '0'
  const neverWorn = items.filter(i => i.wearCount === 0).length

  const categoryCounts = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topWorn = [...items].sort((a, b) => b.wearCount - a.wearCount).slice(0, 5)
  const leastWorn = [...items].sort((a, b) => a.wearCount - b.wearCount).slice(0, 5)
  const maxWearCount = Math.max(...items.map(i => i.wearCount), 1)

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wardrobe Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Insights about how you wear your clothes</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Items', value: totalItems, icon: '👗', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300' },
          { label: 'Total Wears', value: totalWears, icon: '✅', bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300' },
          { label: 'Avg Wears/Item', value: avgWears, icon: '📊', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300' },
          { label: 'Never Worn', value: neverWorn, icon: '⚠️', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-300' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-2xl p-4 ${stat.bg} ${stat.text}`}>
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs font-medium opacity-75">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Items by Category</h2>
          <div className="space-y-3">
            {Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">{cat}</span>
                  <span className="text-gray-500 dark:text-gray-400">{count} items</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" style={{ width: `${(count / totalItems) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Most Worn Items</h2>
          <div className="space-y-3">
            {topWorn.map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 overflow-hidden" style={{ backgroundColor: item.imageColor + '40' }}>
                  {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{item.name}</p>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full" style={{ width: `${(item.wearCount / maxWearCount) * 100}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex-shrink-0">{item.wearCount}x</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
        <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Least Worn — Time to Rediscover</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {leastWorn.map(item => (
            <div key={item.id} className="text-center">
              <div className="w-full aspect-square rounded-xl flex items-center justify-center text-3xl mb-2 overflow-hidden" style={{ backgroundColor: item.imageColor + '30' }}>
                {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : item.emoji}
              </div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{item.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{item.wearCount}x worn</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
