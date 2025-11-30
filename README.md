# PairCraft Frontend

Modern, real‑time collaborative coding UI built with React, TypeScript, Redux Toolkit, and Monaco Editor. This README focuses on the web client that consumes the FastAPI backend.

## 🚀 Live Deployments

| Service | URL |
| --- | --- |
| Frontend (Vercel) | `https://paircraft-ai.vercel.app/`|
| Backend (Render) | `https://paircraft-backend-zgsv.onrender.com` |

Update `VITE_API_URL`/`VITE_WS_URL` whenever backend URL changes.

## 🗂️ Directory Structure

```
realtime-paircraft-frontend/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── CodeEditor.tsx   # Monaco wrapper with AI inline suggestions & remote cursors
│   │   ├── ModelSelector.tsx
│   │   └── LanguageSelector.tsx
│   ├── pages/
│   │   ├── Home.tsx         # Landing page (create/join room)
│   │   └── Room.tsx         # Collaborative editor surface
│   ├── services/            # REST + WebSocket clients
│   │   ├── api.ts
│   │   └── websocket.ts
│   ├── store/               # Redux Toolkit slices
│   │   ├── editorSlice.ts
│   │   └── roomSlice.ts
│   ├── App.tsx / main.tsx   # Routing bootstrap
│   └── index.css            # Tailwind + custom styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## ✨ Current Features

- Monaco editor with inline AI ghost text (Tab accept / Esc dismiss).
- Debounced AI calls (600 ms) via backend `/rooms/autocomplete`.
- Real‑time collaboration through WebSockets with remote cursor labels + active typer tracking.
- Room creation/join flows, user identity stored in URL params/localStorage.
- Model selector tied to backend `/rooms/models` list.
- Theme toggle, responsive glassmorphism UI, keyboard hints.

## 🧱 Architecture & Design Choices

- **React + Vite** for fast DX, TypeScript for safety.
- **Redux Toolkit** centralizes editor/room state for deterministic updates.
- **Services layer** isolates REST/WebSocket clients so components stay declarative.
- **Monaco InlineCompletionsProvider** used instead of custom decorations to mimic Copilot experience.
- **URL‑driven usernames**: ensures unique shareable room links; remote cursors show only active typers.
- **Environment driven config**: Single source of truth for API/WS URLs and AI provider selection.

## 🧪 Running Locally

```bash
cd realtime-paircraft-frontend
cp .env.example .env        # Then edit values
npm install
npm run dev                 # http://localhost:5173
```

Required `.env` keys:

```ini
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_AI_PROVIDER=OpenRouter
```

> Never store real API keys on the frontend. The backend already proxies OpenRouter.

### Production Build

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder (Vercel does this automatically when `Root Directory = realtime-paircraft-frontend`).

## 🔗 Interacting with the Backend

- `POST /rooms` – Create room (returns `roomId`).
- `GET /rooms/{roomId}` – Fetch existing room state.
- `GET /rooms/models` – List available AI models.
- `POST /rooms/autocomplete` – Fetch AI suggestion (frontend debounces requests).
- `POST /rooms/run` – Execute code snippet (Python/JS/etc.).
- `WS /ws/{roomId}?username=...` – Real‑time code + presence sync.

## ⚙️ Deployment Notes

- **Vercel Settings**
  - Root Directory: `realtime-paircraft-frontend`
  - Install command: `npm install`
  - Build command: `npm run build`
  - Output: `dist`
  - Env Vars: `VITE_API_URL`, `VITE_WS_URL`, `VITE_AI_PROVIDER`
- **Backend URL swaps** require redeploying frontend so Vite inlines new values.

## 🖼️ UI Gallery

1. **Landing Page – Create & Join Rooms**

   ![Landing page showing create/join cards](realtime-paircraft-frontend/public/screenshots/Screenshot%202025-11-30%20at%2011.28.55%E2%80%AFAM.png)

2. **AI Model Selector**

   ![AI model selector dropdown](realtime-paircraft-frontend/public/screenshots/Screenshot%202025-11-30%20at%2011.09.40%E2%80%AFAM.png)

3. **Language Selector**

   ![Language selector dropdown](realtime-paircraft-frontend/public/screenshots/Screenshot%202025-11-30%20at%2011.09.47%E2%80%AFAM.png)

4. **Light Theme Editor**

   ![Editor in light theme](realtime-paircraft-frontend/public/screenshots/Screenshot%202025-11-30%20at%2011.10.05%E2%80%AFAM.png)

5. **Remote Users & Active Typers**

   ![Remote cursor label + user count](realtime-paircraft-frontend/public/screenshots/Screenshot%202025-11-30%20at%2011.02.40%E2%80%AFAM.png)


   ![Active typer label below cursor](realtime-paircraft-frontend/public/screenshots/Screenshot%202025-11-30%20at%2011.04.24%E2%80%AFAM.png)

6. **AI Ghost Text Suggestion**

   ![Ghost text suggestion after debounce](realtime-paircraft-frontend/public/screenshots/Screenshot%202025-11-30%20at%2011.05.57%E2%80%AFAM.png)

7. **Code Output**

   ![Execution output panel](realtime-paircraft-frontend/public/screenshots/Screenshot%202025-11-30%20at%2011.09.18%E2%80%AFAM.png)




## 🛣️ Limitations & Future Work

| Area | Current State | Potential Improvements |
| --- | --- | --- |
| Authentication | Anonymous usernames | Add OAuth / magic-link auth per room |
| Presence | Cursor labels + count | WebRTC audio/video, typing indicators per line |
| Files | Single shared buffer | Multi-file tree & git-style history |
| AI | Inline completions only | Chat-based code review, AI pair debugging |
| Collaboration UX | Manual share links | Invite links + email notifications |

Additional stretch goals: integrated chat sidebar, screen sharing via WebRTC, offline aware caching, mobile-optimized layout.

## 📐 With More Time

- Build a command palette + keyboard shortcuts.
- Add optimistic undo/redo synced through CRDTs instead of full-document patches.
- Ship a Cypress smoke suite to verify room flows after each deploy.

## 📄 License & Attribution

Project created for the PairCraft collaborative editor demo. Uses Monaco Editor, Tailwind, Lucide icons, and Redux Toolkit.

