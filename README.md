# Coy Discover

A swipe-based "Discover" tab built for the Coy SDE Intern assignment. A mobile-first Next.js app with a tab bar (blank **Home** tab and **Discover** tab), a swipe deck, and a Matches view.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The SQLite database (`data/coy.db`) is created and seeded with 36 profiles on first request. To reset all swipes and matches, stop the server and delete the `data` folder.

## Stack

- Next.js (App Router) + API routes
- SQLite via `better-sqlite3`
- framer-motion for drag gestures and animations

## API

Next.js routes live under `/api`, so the spec's endpoints map to:

| Spec | Route | Behavior |
|---|---|---|
| `GET /feed` | `GET /api/feed` | Profiles the user has not swiped on |
| `POST /swipe` | `POST /api/swipe` | Body `{ profileId, action: "like" | "pass" }`. Returns `{ match: boolean, profile? }` |
| `GET /matches` | `GET /api/matches` | Mutual matches only |

## Design decisions

- **Privacy is the core promise.** Whether a profile has liked the user is stored in `profiles.likes_me`, and no endpoint ever selects that column. The only way to learn someone liked you is to like them back, and `/swipe` returns profile details only on a mutual match. `/feed` and `/matches` never expose who liked the user.
- **No profile appears twice.** `swipes.profile_id` is the primary key, so the database itself rejects a second swipe. The API returns `409` and `/feed` excludes anything already in `swipes`.
- **Atomic swipes.** Recording a swipe and creating a match happen in a single SQLite transaction, so a swipe is never saved without its match (or vice versa).
- **Persistence.** All swipes and matches live in SQLite and survive reloads.
- **Input validation.** `/swipe` validates `profileId` and `action`, and returns 400, 404, or 409 for bad input.

## Assumptions

- A single logged-in user; no auth.
- Photos are placeholders from picsum.photos.
- Every 4th seeded profile (9 of 36) has already liked the user, so matches can be demoed. Profile 2 (Riya) is the first one.
- Desktop: use the ✕ / ♥ buttons or the ← → arrow keys. Mobile: drag the card.

## Project structure

```
app/api/{feed,swipe,matches}/route.js   API routes
lib/db.js                               schema + seeding
lib/seed.js                             mock profiles
components/                             Discover, SwipeCard, Matches, MatchOverlay, DiscoverTab
app/page.js                             tab bar (Home / Discover)
```