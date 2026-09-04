# Kora Party — Detailed Implementation Plan

## Status Legend
- [x] = Done
- [ ] = Pending

---

## Phase 1: Project Setup & Config
1. [x] Initialize React Native project with Expo SDK 57
2. [x] Install Firebase, NativeWind v4, navigation, gesture handler, reanimated
3. [x] Configure NativeWind: babel.config.js, metro.config.js, global.css, tailwind.config.js
4. [x] Set up folder structure: src/screens, components, context, utils, types, data, navigation, hooks

## Phase 2: Theme & UI Foundation
5. [x] Create color constants (dark-green palette replacing purple from Dribbble design)
6. [x] Create language context with EN/AR translations
7. [x] Create TypeScript types for GameSession, Player, Question, BundleType
8. [x] Create Firebase config placeholder

## Phase 3: Navigation & Core Screens
9. [x] Set up React Navigation stack (Home, CreateGame, JoinGame, Lobby, Game, Result)
10. [x] Build Home screen (dark theme, green accents, card-based layout)
11. [x] Build Create Game screen (bundle selector with toggle cards)
12. [x] Build Join Game screen (code input with large styled field)
13. [x] Build Lobby screen (session code display, player list, copy button)
14. [x] Build Game screen (question card, timer bar, 4-option answers, result state)
15. [x] Build Result screen (winner card, leaderboard list, rematch button)

## Phase 4: Firebase Realtime Database
16. [x] Implement session creation (write to Firebase)
17. [x] Implement session joining (read by session code)
18. [x] Implement real-time player list sync
19. [x] Implement host disconnect detection via .info/connected
20. [x] Implement host auto-transfer to next player
21. [x] Implement question sync (all players locked to same question, seeded from session)
22. [x] Implement answer submission and scoring sync
23. [x] Late join sync (GameScreen builds same seeded question set; livescore from Firebase)

## Phase 4b: Player Identity
23. [x] Create PlayerProvider with persistent identity (AsyncStorage)
24. [x] First-launch name entry modal
25. [x] Join flow joins real Firebase session + validates existence

## Phase 5: Question Data Integration
x. [x] Merge bilingual + updated JSON files into unified bundles per bundle type
x. [x] Build question data loader (local JSON or Firebase)
x. [x] Build question shuffling and distribution logic (10 per level, split across bundles)
x. [x] Build all 7 bundle-type question components (QuestionRenderer)

## Phase 6: Game Engine
33. [x] Implement level transition screen ("Level X Complete!" overlay)
34. [x] Implement question distribution across 3 levels
35. [x] Implement 15-second countdown timer with color transitions (green -> yellow -> red)
36. [x] Implement late join (sync to current question on join)
37. [x] Implement scoring (10 pts per correct, flat)
38. [x] Sync answers + scores to Firebase so all players see live leaderboard
38b. [x] Result screen reads live ranked players from Firebase

## Phase 7: Images & Assets
38. [ ] Download player photos from Wikipedia/Wikimedia for Guess the Nation bundle
39. [ ] Generate silhouette images (CSS filter or pre-rendered PNGs)
40. [ ] Create app icon with dark-green football theme
41. [ ] Create splash screen

## Phase 8: Daily Challenge & Engagement
42. [x] Build Daily Challenge screen (solo mode, no session needed)
43. [x] Implement daily streak tracking (AsyncStorage)
44. [x] Build rematch flow (new session with same players)

## Phase 9: Polish
45. [ ] Add screen transition animations (slide, fade)
46. [x] Add button press animations (scale feedback)
47. [x] Add correct/wrong answer feedback animations
48. [ ] Test all 7 bundle types end-to-end
49. [ ] Test bilingual switching (EN <-> AR)
50. [ ] Test RTL layout for Arabic
