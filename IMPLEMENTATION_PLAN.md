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
16. [ ] Implement session creation (write to Firebase)
17. [ ] Implement session joining (read by session code)
18. [ ] Implement real-time player list sync
19. [ ] Implement host disconnect detection via .info/connected
20. [ ] Implement host auto-transfer to next player
21. [ ] Implement question sync (all players locked to same question)
22. [ ] Implement answer submission and scoring sync

## Phase 5: Question Data Integration
23. [ ] Merge bilingual + updated JSON files into unified bundles per bundle type
24. [ ] Build question data loader (local JSON or Firebase)
25. [ ] Build question shuffling and distribution logic (10 per level, split across bundles)
26. [ ] Build Guess the Player question component (text input + acceptedAnswers matching)
27. [ ] Build Guess by History component (club badges + text input)
28. [ ] Build Guess the Nation component (player photo + 4 options)
29. [ ] Build Higher or Lower component (two player stats cards + choice)
30. [ ] Build Complete the Lineup component (formation view + blanked slot)
31. [ ] Build Guess by Silhouette component (silhouette image + text input)
32. [ ] Build True or False component (statement + two buttons)

## Phase 6: Game Engine
33. [ ] Implement level transition screen ("Level X Complete!" overlay)
34. [ ] Implement question distribution across 3 levels
35. [ ] Implement 15-second countdown timer with color transitions (green -> yellow -> red)
36. [ ] Implement late join (sync to current question on join)
37. [ ] Implement scoring (10 pts per correct, flat)

## Phase 7: Images & Assets
38. [ ] Download player photos from Wikipedia/Wikimedia for Guess the Nation bundle
39. [ ] Generate silhouette images (CSS filter or pre-rendered PNGs)
40. [ ] Create app icon with dark-green football theme
41. [ ] Create splash screen

## Phase 8: Daily Challenge & Engagement
42. [ ] Build Daily Challenge screen (solo mode, no session needed)
43. [ ] Implement daily streak tracking (AsyncStorage)
44. [ ] Build rematch flow (new session with same players)

## Phase 9: Polish
45. [ ] Add screen transition animations (slide, fade)
46. [ ] Add button press animations (scale feedback)
47. [ ] Add correct/wrong answer feedback animations
48. [ ] Test all 7 bundle types end-to-end
49. [ ] Test bilingual switching (EN <-> AR)
50. [ ] Test RTL layout for Arabic
