# WhatToWear - Frontend Architecture

## Project Structure

```
whatwear-mobile/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignupScreen.tsx
│   │   │   ├── OAuthButtons.tsx
│   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   └── OnboardingFlow.tsx
│   │   │
│   │   ├── wardrobe/
│   │   │   ├── WardrobeGrid.tsx
│   │   │   ├── ItemCard.tsx
│   │   │   ├── ItemDetails.tsx
│   │   │   ├── ItemUpload.tsx
│   │   │   ├── CameraCapture.tsx
│   │   │   ├── ImageProcessor.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── WardrobeStats.tsx
│   │   │
│   │   ├── outfit-builder/
│   │   │   ├── OutfitCanvas.tsx
│   │   │   ├── Mannequin.tsx
│   │   │   ├── LayerControl.tsx
│   │   │   ├── ItemSelector.tsx
│   │   │   ├── ColorHarmonyIndicator.tsx
│   │   │   ├── OutfitPreview.tsx
│   │   │   ├── SaveOutfitModal.tsx
│   │   │   └── OutfitList.tsx
│   │   │
│   │   ├── ai-assistant/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── RecommendationCard.tsx
│   │   │   ├── AskAssistant.tsx
│   │   │   ├── RecommendationList.tsx
│   │   │   ├── ContextSelector.tsx
│   │   │   └── StylingTips.tsx
│   │   │
│   │   ├── social/
│   │   │   ├── FeedScreen.tsx
│   │   │   ├── PostCard.tsx
│   │   │   ├── UserProfile.tsx
│   │   │   ├── ShareModal.tsx
│   │   │   ├── CommentThread.tsx
│   │   │   ├── FollowButton.tsx
│   │   │   ├── SaveButton.tsx
│   │   │   └── DiscoveryScreen.tsx
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── EditProfile.tsx
│   │   │   ├── SettingsScreen.tsx
│   │   │   ├── PrivacySettings.tsx
│   │   │   ├── NotificationSettings.tsx
│   │   │   └── AccountSettings.tsx
│   │   │
│   │   └── shared/
│   │       ├── TabBar.tsx
│   │       ├── Header.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── Modal.tsx
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Chip.tsx
│   │       ├── BottomSheet.tsx
│   │       └── Toast.tsx
│   │
│   ├── screens/
│   │   ├── AuthStack.tsx
│   │   ├── MainStack.tsx
│   │   ├── RootNavigator.tsx
│   │   └── Navigation.ts
│   │
│   ├── hooks/
│   │   ├── useWardrobe.ts
│   │   ├── useAIAssistant.ts
│   │   ├── useOutfits.ts
│   │   ├── useSocial.ts
│   │   ├── useAuth.ts
│   │   ├── useImage.ts
│   │   ├── useLocation.ts
│   │   └── useWeather.ts
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── wardrobe.service.ts
│   │   ├── outfit.service.ts
│   │   ├── ai.service.ts
│   │   ├── social.service.ts
│   │   ├── storage.service.ts
│   │   ├── image.service.ts
│   │   └── notifications.service.ts
│   │
│   ├── store/
│   │   ├── store.ts (Redux setup)
│   │   ├── slices/
│   │   │   ├── auth.slice.ts
│   │   │   ├── wardrobe.slice.ts
│   │   │   ├── outfits.slice.ts
│   │   │   ├── ai.slice.ts
│   │   │   ├── social.slice.ts
│   │   │   └── ui.slice.ts
│   │   └── api/
│   │       └── api.slice.ts (RTK Query)
│   │
│   ├── utils/
│   │   ├── colors.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   ├── analytics.ts
│   │   ├── permissions.ts
│   │   └── helpers.ts
│   │
│   ├── types/
│   │   ├── models.ts
│   │   ├── api.ts
│   │   ├── navigation.ts
│   │   └── common.ts
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   ├── fonts/
│   │   └── animations/
│   │
│   ├── styles/
│   │   ├── theme.ts
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   └── animations.ts
│   │
│   └── App.tsx
│
├── e2e/
│   ├── auth.e2e.ts
│   ├── wardrobe.e2e.ts
│   ├── outfit-builder.e2e.ts
│   └── social.e2e.ts
│
├── __tests__/
│   ├── components/
│   ├── services/
│   ├── utils/
│   └── hooks/
│
├── app.json
├── tsconfig.json
├── package.json
└── README.md
```

## Tech Stack

**Core Framework**: React Native 0.72+
**Language**: TypeScript
**State Management**: Redux Toolkit + RTK Query
**Navigation**: React Navigation 6.x
**UI Components**: React Native Paper + Custom Components
**Image Processing**: react-native-vision-camera, expo-image
**Async Storage**: AsyncStorage, SQLite (local)
**HTTP Client**: Axios + RTK Query
**Drag & Drop**: react-native-gesture-handler, react-native-reanimated
**Testing**: Jest, React Native Testing Library, Detox (E2E)
**Build**: EAS Build (Expo)

## Key Screens & Features

### Authentication Flow
```typescript
// Login → Email + Password / OAuth (Google, Apple)
// Sign Up → Email Registration + Profile Setup
// Onboarding → Style Quiz → Photo Upload → Ready
```

### Main App Navigation (Bottom Tab)
```
1. Wardrobe (Grid view + Upload)
2. Outfit Builder (Canvas + Drag-drop)
3. AI Assistant (Chat)
4. Social/Feed (Discover + Share)
5. Profile (Settings)
```

## Critical Implementation Details

### Image Upload Pipeline
```typescript
// 1. Camera/Gallery Capture
// 2. Local compression & validation
// 3. Upload to S3 (multipart if large)
// 4. Call AI classification API
// 5. Display results for manual review
// 6. Save to local DB + remote DB
```

### Outfit Canvas (Drag & Drop)
```typescript
// Uses: Gesture Handler + Reanimated
// State: Redux for outfit composition
// Real-time: Preview updates on item drag
// Validation: Color harmony checks
// Save: Persists to backend
```

### AI Assistant Chat
```typescript
// Real-time message input
// Streaming responses from Claude/GPT-4
// Image attachment support (reference items)
// Auto-suggest outfits inline
// Conversation history saved locally
```

## Performance Optimization

**Image Caching**: 
- Use React Native Fast Image
- HTTP caching headers (30 days)
- Local file system cache

**State Management**:
- Memoize selectors (Reselect)
- Lazy load outfit items
- Paginate wardrobe (limit 20 at a time)

**Network**:
- Request debouncing (search 300ms)
- Batch API calls
- Offline support (Redux persist)

**Rendering**:
- FlatList with getItemLayout
- Virtualization for long lists
- useMemo for heavy computations

