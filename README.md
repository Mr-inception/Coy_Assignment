# Coy Discover

A swipe-based "Discover" tab built for the Coy SDE Intern assignment. A mobile-first Next.js app with a tab bar (blank **Home** tab and **Discover** tab), a swipe deck, and a Matches view.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. No native dependencies and no setup. Swipes and matches are saved to `data/db.json`, which is created on the first swipe. To reset the demo, stop the server and delete the `data` folder.

## Stack

- Next.js (App Router) + API routes
- JSON-file persistence (`data/db.json`), all storage logic in `lib/store.js`
- framer-motion for drag gestures and animations

## API

Next.js routes live under `/api`, so the spec's endpoints map to:

| Spec | Route | Behavior |
|---|---|---|
| `GET /feed` | `GET /api/feed` | Profiles the user has not swiped on |
| `POST /swipe` | `POST /api/swipe` | Body `{ profileId, action: "like" | "pass" }`. Returns `{ match: boolean, profile? }` |
| `GET /matches` | `GET /api/matches` | Mutual matches only |

## Design decisions

- **Privacy is the core promise.** Whether a profile has liked the user (`likesMe`) lives only in the server-side seed data and is stripped by `publicProfile()` before anything is returned. No endpoint ever exposes it. The only way to learn someone liked you is to like them back, and `/swipe` returns profile details only on a mutual match. `/feed` and `/matches` never reveal who liked the user.
- **No profile appears twice.** Swipes are stored keyed by profile id. `/feed` excludes anything already swiped, and a repeat `POST /swipe` returns `409`.
- **Atomic swipe + match.** Reading state, checking for a duplicate, recording the swipe, and creating the match happen in one synchronous step with no awaits in between, so a swipe is never saved without its match.
- **Persistence.** Swipes and matches survive page reloads and server restarts.
- **Input validation.** `/swipe` validates `profileId` and `action`, and returns 400, 404, or 409 for bad input.
- **Why a JSON file.** It has zero native dependencies, so `npm install` works on any OS and Node version. For production I would move to Postgres with a unique constraint on `(user_id, profile_id)` to make the duplicate-swipe guard hold across multiple servers.

## Assumptions

- A single logged-in user; no auth.
- Photos are placeholders from picsum.photos.
- Every 4th seeded profile (9 of 36) has already liked the user, so matches can be demoed. Profile 2 (Riya) is the first one.
- Desktop: use the ✕ / ♥ buttons or the ← → arrow keys. Mobile: drag the card.

## Project structure

```
app/api/{feed,swipe,matches}/route.js   API routes
lib/store.js                            persistence + match logic
lib/seed.js                             36 mock profiles
components/                             Discover, SwipeCard, Matches, MatchOverlay, DiscoverTab
app/page.js                             tab bar (Home / Discover)
```