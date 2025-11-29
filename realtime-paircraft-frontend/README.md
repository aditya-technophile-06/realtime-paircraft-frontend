# PairCraft Frontend

Modern, real-time collaborative coding interface built with React, TypeScript, Redux Toolkit, and Monaco Editor.

## 🏗️ Architecture

### Project Structure

```
realtime-paircraft-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CodeEditor.tsx   # Monaco Editor wrapper with real-time sync
│   │   └── LanguageSelector.tsx  # Language selection dropdown
│   ├── pages/               # Page components (routes)
│   │   ├── Home.tsx         # Landing page with room creation/joining
│   │   └── Room.tsx         # Collaborative coding room
│   ├── store/               # Redux state management
│   │   ├── index.ts         # Store configuration
│   │   └── slices/
│   │       ├── editorSlice.ts   # Editor state (code, language, etc.)
│   │       └── roomSlice.ts     # Room state (users, connection, etc.)
│   ├── services/            # External service integrations
│   │   ├── api.ts           # REST API client
│   │   └── websocket.ts     # WebSocket service
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Application entry point
│   ├── index.css            # Global styles with Tailwind
│   └── vite-env.d.ts        # TypeScript environment definitions
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── .env.example             # Example environment variables
└── README.md                # This file
```

### Technology Stack

- **React 18**: Modern UI library with hooks
- **TypeScript**: Type-safe JavaScript
- **Redux Toolkit**: State management with minimal boilerplate
- **Monaco Editor**: VS Code's powerful code editor
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Vite**: Fast build tool and dev server

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Backend server running (see backend README)

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd realtime-paircraft-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

   Example `.env` file:
   ```
   VITE_API_URL=http://localhost:8000
   VITE_WS_URL=ws://localhost:8000
   VITE_AI_API_KEY=your_groq_or_openrouter_api_key
   VITE_AI_PROVIDER=groq
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## 🎨 Features

### Home Page
- **Create Room**: Start a new collaborative session with language selection
- **Join Room**: Enter an existing room using its ID
- **Modern UI**: Beautiful gradient design with glassmorphism effects
- **Feature Showcase**: Highlights key capabilities

### Collaborative Room
- **Real-time Editing**: See changes from other users instantly
- **Monaco Editor**: Full-featured code editor with syntax highlighting
- **Multi-language Support**: Python, JavaScript, TypeScript, Java, C++, Go, Rust, and more
- **User Presence**: See how many users are in the room
- **Connection Status**: Visual indicator of WebSocket connection
- **Room Sharing**: Copy room ID to clipboard with one click
- **Language Switching**: Change programming language on the fly

### Code Editor Features
- **Syntax Highlighting**: Language-specific syntax coloring
- **Auto-completion**: Smart suggestions as you type
- **Minimap**: Bird's-eye view of your code
- **Line Numbers**: Easy navigation
- **Word Wrap**: Comfortable reading of long lines
- **Format on Type/Paste**: Automatic code formatting

## 🔌 State Management

### Redux Slices

#### Editor Slice
Manages editor-specific state:
- `code`: Current code content
- `language`: Selected programming language
- `cursorPosition`: Current cursor position
- `isAutoCompleteEnabled`: Autocomplete toggle
- `suggestion`: Current autocomplete suggestion

#### Room Slice
Manages room and collaboration state:
- `roomId`: Current room identifier
- `isConnected`: WebSocket connection status
- `users`: List of users in the room
- `userCount`: Number of active users
- `currentUserId`: Current user's unique ID

## 🌐 API Integration

### REST API
- **Create Room**: `POST /rooms`
- **Get Room**: `GET /rooms/{roomId}`
- **Autocomplete**: `POST /rooms/autocomplete`

### WebSocket
- **Connection**: `ws://localhost:8000/ws/{roomId}`
- **Real-time sync**: Bidirectional code updates
- **Presence**: User join/leave notifications
- **Language changes**: Synchronized language selection

## 🎯 Design Decisions

### Component Architecture
- **Functional Components**: Using React hooks for state and effects
- **Type Safety**: Full TypeScript coverage for props and state
- **Separation of Concerns**: Components, services, and state are clearly separated
- **Reusability**: Components are designed to be reusable and composable

### State Management
- **Redux Toolkit**: Reduces boilerplate with createSlice
- **Normalized State**: Efficient state updates and lookups
- **Immutable Updates**: Safe state mutations with Immer
- **Type-safe Actions**: Full TypeScript support

### Real-time Communication
- **WebSocket Service**: Encapsulated WebSocket logic
- **Automatic Reconnection**: Handles temporary disconnections
- **Message Handlers**: Clean event-driven architecture
- **Error Handling**: Graceful degradation on connection issues

### UI/UX
- **Modern Design**: Gradient backgrounds and glassmorphism
- **Responsive**: Works on desktop and tablet devices
- **Accessibility**: Semantic HTML and ARIA labels
- **Visual Feedback**: Loading states, success/error messages
- **Dark Theme**: Easy on the eyes for long coding sessions

## 🚧 Future Enhancements

### High Priority
1. **AI-Powered Autocomplete**
   - Integration with Groq/OpenRouter APIs
   - Context-aware suggestions
   - Multi-line completions
   - Configurable AI providers

2. **Enhanced Presence**
   - Live cursor positions for each user
   - User avatars and names
   - Typing indicators
   - Color-coded user highlights

3. **Code History**
   - Undo/redo functionality
   - Version history viewer
   - Time-travel debugging
   - Export code snapshots

### Medium Priority
4. **Improved Editor**
   - Multiple file support
   - Split view editing
   - Find and replace
   - Code folding
   - Bracket matching

5. **Collaboration Features**
   - Chat sidebar
   - Code comments
   - Annotations
   - Follow mode (follow another user's cursor)

6. **User Experience**
   - Keyboard shortcuts
   - Command palette
   - Customizable themes
   - Font size adjustment

### Low Priority
7. **WebRTC Integration**
   - Audio/video calling UI
   - Screen sharing controls
   - Picture-in-picture mode
   - Recording capabilities

8. **Advanced Features**
   - Code execution results display
   - Integrated terminal
   - Git integration
   - Plugin system

## 🐛 Known Limitations

1. **No Offline Support**: Requires active internet connection
2. **Single File Editing**: Can only edit one file per room
3. **No User Authentication**: Anonymous users only
4. **Limited Mobile Support**: Optimized for desktop/tablet
5. **Basic Autocomplete**: Rule-based, not AI-powered yet
6. **No Code Execution**: Cannot run code in the browser

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000` |
| `VITE_WS_URL` | WebSocket server URL | `ws://localhost:8000` |
| `VITE_AI_API_KEY` | AI provider API key (optional) | - |
| `VITE_AI_PROVIDER` | AI provider (groq/openrouter) | `groq` |

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🎨 Customization

### Tailwind Theme
Edit `tailwind.config.js` to customize colors, spacing, and more:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

### Monaco Editor
Customize editor settings in `CodeEditor.tsx`:

```typescript
options={{
  fontSize: 14,
  theme: 'vs-dark',
  // Add your custom options
}}
```

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Follow React best practices
4. Write meaningful component names
5. Add comments for complex logic
6. Test your changes locally

## 📄 License

This project is part of a technical assessment and is for demonstration purposes only.

## 🙏 Acknowledgments

- **Monaco Editor**: Microsoft's excellent code editor
- **Tailwind CSS**: For the beautiful utility-first CSS framework
- **Lucide**: For the clean and consistent icons
- **Redux Toolkit**: For simplified state management
