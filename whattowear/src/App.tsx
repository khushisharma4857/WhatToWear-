import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { WardrobeProvider } from './contexts/WardrobeContext'
import { ProfileProvider } from './contexts/ProfileContext'
import Navbar from './components/Navbar'
import Wardrobe from './pages/Wardrobe'
import Outfits from './pages/Outfits'
import AIStylist from './pages/AIStylist'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'

export default function App() {
  return (
    <ThemeProvider>
      <WardrobeProvider>
        <ProfileProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Navbar />
              <main className="pt-4 pb-20 md:pt-16 md:pb-4">
                <Routes>
                  <Route path="/" element={<Wardrobe />} />
                  <Route path="/outfits" element={<Outfits />} />
                  <Route path="/stylist" element={<AIStylist />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </ProfileProvider>
      </WardrobeProvider>
    </ThemeProvider>
  )
}
