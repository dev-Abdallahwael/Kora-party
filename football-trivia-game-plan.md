# Football Trivia Game — Business & Features Plan

## 1. Concept

A synchronous multiplayer football-knowledge game. A host opens the app, creates a session by picking one or more question "bundles," and shares a session ID with friends. Everyone plays through 3 timed levels together, locked to the same question at the same time, and the player with the most points at the end wins.

## 2. Tech Stack

- React Native
- Firebase (backend/database)
- Tailwind / NativeWind for styling
- Ads for monetization

## 3. Game Structure

- **Session:** host creates a game, selects one or more bundles (minimum 1 — a host can start with just a single bundle if they want), and receives a shareable session ID for friends to join.
- **Levels:** every game has 3 levels, 10 questions each. A short "Level X complete!" transition screen plays between levels before the next one begins.
- **Question distribution:** within a level, the 10 questions are split as evenly as possible across the bundles the host selected (e.g. 2 bundles → 5/5; 3 bundles → 4/3/3).
- **Timer:** every question has a 15-second timer. Once time expires, no more answers are accepted and the game advances. All players stay locked to the same question at the same time — no one can advance early even if they've already answered.
- **Scoring:** a correct answer is worth 10 points, flat (no speed bonus). The winner is whoever has the most total points across all 3 levels at the end.
- **Session size:** no fixed player cap.
- **Late join:** a friend can join a session after it has already started, jumping in from whatever question is currently active (they simply won't have points from questions asked before they joined).
- **Host disconnect:** if the host disconnects or closes the app mid-game, host status automatically transfers to another player already in the session, and the game continues uninterrupted.

## 4. Question Bundles

**Core bundles:**
- **Guess the Player** — text clues (medium–hard difficulty), user types the player's name. Covers players active any time from 2000 through 2026. Answer matching accepts common nicknames/short names (e.g. "CR7," "Ronaldo") in addition to full names, and is not case-sensitive.
- **Guess the Player by History** — shown the badges of clubs a player played for across his career, user types the player's name (same matching rules as above).
- **Guess the Player's Nation** — shown a player's photo, user picks the nationality from multiple-choice options.
- **Higher or Lower** — shown two players' stats (goals, caps, trophies, etc.), user picks which is higher.
- **Complete the Lineup** — a famous starting XI shown with 2–3 players blanked out, user identifies who's missing.
- **Guess by Silhouette** — a player shown only as a shadow/outline, user types the name.
- **True or False** — a football fact or stat shown, user answers true or false.

**Deferred:** an XO (Tic-Tac-Toe) bundle was considered but doesn't fit this session format, since it requires exactly 2 players. It's set aside as a possible future standalone 1v1 mode outside the main multiplayer structure, not part of this build.

## 5. Post-Game & Engagement Features

- **Post-game leaderboard/summary screen** — final ranking plus a per-question breakdown of who got what right.
- **Rematch button** — start a new session with the same group in one tap, skipping the host/join flow.
- **Daily challenge** — a single-player daily question set, no session or friends required — gives people a reason to open the app solo, every day.
- **Streaks & achievements** — lightweight tracking (e.g. correct-answer streaks, days played in a row) to encourage repeat play.

## 6. Content Plan

- A large question bank stored in Firebase, target ~200 questions per bundle, pulled/generated to be genuinely challenging for real football fans rather than casual/easy trivia, covering as wide a range of players as possible.
- Questions are randomized per session/level rather than shown in a fixed order.

## 7. Monetization

- Ads (consistent with the earlier home-services app's approach), no other monetization method specified yet for this app.

## 8. Open Items (not yet decided)

- Exact ad placement (e.g. between levels, on the lobby/join screen, post-game screen)
- Whether "Daily Challenge" scores feed into any account-level stats/profile
- Account/identity model for players (name-only guest join vs. persistent profile) — not yet discussed
- Minimum/maximum number of bundles beyond "at least 1" (no upper limit discussed)
