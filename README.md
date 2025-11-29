Build Prototype – Full-Stack Python API Developer
===============================================

Overview
--------
Build a simplified real-time pair-programming web application. Two users should be able to join the same room, edit code at the same time, and see each other’s changes instantly. The system should also provide an AI-style autocomplete suggestion (this can be mocked and does not need to be real AI).


**Stack Required**
- Backend: Python, FastAPI, WebSockets
- Frontend: React, TypeScript, Redux Toolkit (minimal implementation acceptable)

1. Core Requirements
--------------------

### A. Room Creation & Joining
- Users can create a new room (generate a room ID).
- Users can join an existing room via a URL such as `/room/<roomId>`.
- No authentication is required.

### B. Real-Time Collaborative Coding
- Implement WebSockets so that two users in the same room share a code editor.
- When one user types, the other should see updates immediately.
- A simple syncing approach is fine (last-write wins or basic diffing).
- In-memory storage for each room’s code state is acceptable.

### C. AI Autocomplete (Mocked)
- Provide a POST endpoint `/autocomplete` that accepts `{ code: "…", cursorPosition: number, language: "python" }`.
- Return a simple mocked suggestion (static, rule-based, etc.).
- On the frontend, when the user stops typing for ~600 ms, call this endpoint and show the suggestion in the editor.

2. Backend Requirements (FastAPI)
---------------------------------
- REST endpoints:
  - `POST /rooms` → returns `{ roomId }`
  - `POST /autocomplete` → returns a mocked suggestion
- WebSocket endpoint: `/ws/<roomId>` for real-time code updates.
- Maintain room state in a Postgres database.
- Organize code with a clean project structure (routers, services, etc.).

3. Minimal Frontend Requirements (React + TypeScript + Redux)
-------------------------------------------------------------
- Implement a minimal UI for creating/joining rooms and editing code collaboratively.
- Integrate the mocked autocomplete by calling the backend when typing pauses (~600 ms).
- Optional: basic browser demo or Postman demonstration of functionality.

4. Deliverables
---------------
1. Git repository containing:
   - `/backend` folder (FastAPI project)
2. README explaining:
   - How to run both services
   - Architecture and design choices
   - What you would improve with more time
   - Any limitations
3. (Optional) A deployed demo link.

5. Evaluation Criteria
----------------------
- Backend structure and clarity
- WebSocket implementation quality
- Code readability and maintainability
- Functionality of real-time collaboration
- Attention to detail in the README
- Optional improvements or enhancements

6. Enhancements & Future Work
-----------------------------

### WebRTC-Based Real-Time Calling
Add low-latency audio/video chat so collaborators can speak while coding:
- **Signaling:** Reuse the FastAPI backend (REST or WebSocket) to exchange SDP offers/answers and ICE candidates between peers.
- **STUN/TURN:** Configure a public STUN server (e.g., `stun.l.google.com:19302`) for NAT traversal; add a TURN server (Coturn) for reliability behind strict firewalls.
- **Frontend Integration:** Use the WebRTC API (`RTCPeerConnection`, `getUserMedia`) to capture audio/video streams and render remote feeds in the React UI.
- **Room Coordination:** Tie peer connections to existing room IDs so joining a room automatically negotiates media alongside the shared editor.

### Additional Differentiators
1. **Presence & Activity Indicators** – show live cursors, typing indicators, and participant avatars to convey who is editing what.
2. **Time-Travel History** – persist room code snapshots in Postgres or Redis streams to allow replaying or reverting edits.
3. **AI Assistance Upgrades** – expand the mocked autocomplete into contextual suggestions (e.g., lint hints, docstring generation) with configurable provider hooks.
4. **Testing & Deployment Tooling** – add linting (ruff/eslint), unit tests (pytest, vitest), and a Docker-based deployment workflow for one-command spins on Render/Fly.io.
5. **Security & Reliability** – add rate limiting, server-side validation, and optional magic-link authentication for private rooms.