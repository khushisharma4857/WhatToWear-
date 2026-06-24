import { createContext, useContext, useState } from 'react'

export interface UserProfile {
  name: string
  bio: string
  avatar: string
  style: string
  favoriteColor: string
  occasion: string
}

interface ProfileContextType {
  profile: UserProfile
  updateProfile: (p: Partial<UserProfile>) => void
}

const defaultProfile: UserProfile = {
  name: 'Emma Johnson',
  bio: 'Fashion enthusiast & wardrobe organizer',
  avatar: '👩‍💼',
  style: 'Business Casual',
  favoriteColor: 'Navy Blue',
  occasion: 'Work',
}

const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  updateProfile: () => {},
})

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile)
  const updateProfile = (p: Partial<UserProfile>) => setProfile(prev => ({ ...prev, ...p }))
  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => useContext(ProfileContext)
