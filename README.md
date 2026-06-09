# 75 Hard Tracker

A progressive web app for tracking the 75 Hard challenge — 75 consecutive days of 5 daily tasks. Miss one task and you restart from day 1.

## The Rules

| # | Task |
|---|------|
| 1 | Two 45-minute workouts |
| 2 | One workout must be outdoors |
| 3 | Drink 1 gallon of water |
| 4 | Follow a diet — no cheat meals, no alcohol |
| 5 | Read 10 pages of a non-fiction book |

## Features

- **Daily checklist** — tap each task to mark it done
- **Week strip** — see which days this week you completed everything
- **Progress tracking** — current day, days completed, progress bar
- **History** — full breakdown of every past day and its tasks, with an Edit button to amend any day
- **Backfill** — add previous days to the history so you can start tracking mid-challenge
- **Export** — download any day or all days as Markdown files (Obsidian-compatible)
- **Auto-reset** — if you open the app the next day with tasks unfinished, the challenge resets to day 1
- **PWA** — installable on iOS and Android, works offline

## Stack

- React 18 + TypeScript
- Vite
- Plain CSS with CSS variables (no framework)
- `localStorage` for data — no account or backend needed
- `vite-plugin-pwa` for service worker and install support

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build

```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```

## Installing on your phone

Deploy the `dist/` folder to any HTTPS host (GitHub Pages, Netlify, Vercel), then:

- **iPhone** — open in Safari → Share → Add to Home Screen
- **Android** — open in Chrome → menu → Add to Home Screen

## Data

Everything is stored in `localStorage` on your device. There is no server, no account, and no data sent anywhere.
