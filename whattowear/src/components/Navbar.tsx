import { Link, useLocation } from 'react-router-dom'
import { Shirt, LayoutGrid, Sparkles, BarChart2, User, Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const navItems = [
  { path: '/', label: 'Wardrobe', icon: Shirt },
  { path: '/outfits', label: 'Outfits', icon: LayoutGrid },
  { path: '/stylist', label: 'AI Stylist', icon: Sparkles },
  { path: '/analytics', label: 'Analytics', icon: BarChart2 },
  { path: '/profile', label: 'Profile', icon: User },
]

export default function Navbar() {
  const location = useLocation()
  const { dark, toggleDark } = useTheme()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-around md:justify-start md:gap-8 py-2">
          <div className="hidden md:flex items-center gap-2 mr-8">
            <span className="text-2xl">👗</span>
            <span className="font-bold text-lg text-purple-700 dark:text-purple-400">WhatToWear</span>
          </div>
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col md:flex-row items-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  active
                    ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30'
                    : 'text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs md:text-sm">{label}</span>
              </Link>
            )
          })}
          <button
            onClick={toggleDark}
            className="ml-auto p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden md:flex"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  )
}
