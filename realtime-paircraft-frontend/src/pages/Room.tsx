import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCode, setLanguage } from '@/store/slices/editorSlice';
import { setRoomId, setConnected, setCurrentUserId, setCurrentUsername, setUserCount, setUsers, addUser, removeUser, resetRoom } from '@/store/slices/roomSlice';
import type { RoomState } from '@/store/slices/roomSlice';
import { wsService, WebSocketMessage } from '@/services/websocket';
import { api } from '@/services/api';
import { CodeEditor } from '@/components/CodeEditor';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ThemeToggle } from '@/components/ThemeToggle';
import { OutputPanel } from '@/components/OutputPanel';
import { ModelSelector } from '@/components/ModelSelector';
import { Code2, Users, Copy, Check, Home } from 'lucide-react';

export const Room = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  
  const { isConnected, userCount, currentUserId, currentUsername, users } = useAppSelector((state) => state.room as RoomState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [outputExpanded, setOutputExpanded] = useState(true);
  const [outputHeight, setOutputHeight] = useState(200);
  
  // Get username from URL params or localStorage
  const urlUsername = searchParams.get('username');

  useEffect(() => {
    if (!roomId) {
      navigate('/');
      return;
    }

    let isMounted = true;
    let hasConnected = false;

    // Set up WebSocket message handler
    const handleMessage = (message: WebSocketMessage) => {
      if (!isMounted) return;
      
      switch (message.type) {
        case 'init':
          if (message.userId) {
            dispatch(setCurrentUserId(message.userId));
          }
          if (message.username) {
            dispatch(setCurrentUsername(message.username));
          }
          if (message.userCount !== undefined) {
            dispatch(setUserCount(message.userCount));
          }
          if (message.users) {
            dispatch(setUsers(message.users));
          }
          break;

        case 'code_update':
          if (message.code !== undefined) {
            dispatch(setCode(message.code));
          }
          if (message.language) {
            dispatch(setLanguage(message.language));
          }
          break;

        case 'language_change':
          if (message.language) {
            dispatch(setLanguage(message.language));
          }
          break;

        case 'user_joined':
          if (message.userCount !== undefined) {
            dispatch(setUserCount(message.userCount));
          }
          if (message.users) {
            dispatch(setUsers(message.users));
          } else if (message.userId && message.username) {
            dispatch(addUser({ userId: message.userId, username: message.username }));
          }
          break;

        case 'user_left':
          if (message.userCount !== undefined) {
            dispatch(setUserCount(message.userCount));
          }
          if (message.users) {
            dispatch(setUsers(message.users));
          } else if (message.userId) {
            dispatch(removeUser(message.userId));
          }
          break;
      }
    };

    const initializeRoom = async () => {
      // Prevent duplicate connections
      if (hasConnected) return;
      hasConnected = true;
      
      try {
        // Fetch room details with timeout
        const roomDetails = await Promise.race([
          api.getRoom(roomId),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 10000)
          )
        ]);
        
        if (!isMounted) return;
        
        dispatch(setRoomId(roomId));
        dispatch(setCode(roomDetails.code));
        dispatch(setLanguage(roomDetails.language));

        // Get username from URL params, localStorage, or use Anonymous
        const username = urlUsername || localStorage.getItem('username') || 'Anonymous';
        dispatch(setCurrentUsername(username));
        
        // Update localStorage with username from URL if present
        if (urlUsername) {
          localStorage.setItem('username', urlUsername);
        }
        
        // Update URL to include username if not already present
        if (!urlUsername && username !== 'Anonymous') {
          setSearchParams({ username }, { replace: true });
        }

        // Register message handler before connecting
        wsService.onMessage(handleMessage);

        // Connect to WebSocket with username
        await wsService.connect(roomId, username);
        
        if (!isMounted) return;
        
        dispatch(setConnected(true));
        setIsLoading(false);
      } catch (err: any) {
        console.error('Failed to initialize room:', err);
        if (isMounted) {
          // Check if it's a 404 error (room not found)
          if (err?.response?.status === 404 || err?.message?.includes('404')) {
            setError('Room not found. Please check the room ID and try again.');
          } else if (err?.message?.includes('timeout')) {
            setError('Connection timeout. Please check your internet connection and try again.');
          } else {
            setError('Failed to join room. Please try again.');
          }
          setIsLoading(false);
        }
      }
    };

    initializeRoom();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      wsService.removeMessageHandler(handleMessage);
      wsService.disconnect();
      dispatch(resetRoom());
    };
  }, [roomId, navigate, dispatch, urlUsername, setSearchParams]);

  const copyRoomLink = () => {
    if (roomId) {
      // Copy full shareable URL without username (so new users can enter their own)
      const shareUrl = `${window.location.origin}/room/${roomId}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const goHome = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Connecting to room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 mb-4">
            <p className="text-red-400">{error}</p>
          </div>
          <button
            onClick={goHome}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={goHome}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <Code2 className="w-6 h-6 text-primary-500" />
            <h1 className="text-xl font-bold">PairCraft</h1>
          </div>

          <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-400">Room:</span>
            <code className="text-primary-400 font-mono">{roomId}</code>
            <button
              onClick={copyRoomLink}
              className="ml-2 p-1 hover:bg-gray-600 rounded transition-colors"
              title="Copy room ID"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          <ModelSelector />
          
          <div className="relative group">
            <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg cursor-pointer">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm">
                {userCount} {userCount === 1 ? 'user' : 'users'}
              </span>
              {isConnected && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
            {/* Users dropdown */}
            {users.length > 0 && (
              <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="px-3 py-1 text-xs text-gray-400 font-semibold uppercase">Active Users</div>
                {users.map((user) => (
                  <div key={user.userId} className="px-4 py-2 hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{user.username}</span>
                      {user.userId === currentUserId && (
                        <span className="text-xs text-primary-400">(You)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <ThemeToggle />
        </div>
      </header>

      {/* Editor and Output */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-hidden">
          <CodeEditor />
        </div>
        
        {/* Output Panel */}
        <OutputPanel
          isExpanded={outputExpanded}
          onToggle={() => setOutputExpanded(!outputExpanded)}
          height={outputHeight}
          onHeightChange={setOutputHeight}
        />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 px-6 py-2 text-sm text-gray-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentUsername && (
              <span>Logged in as: <span className="text-primary-400 font-semibold">{currentUsername}</span></span>
            )}
            {currentUserId && (
              <span className="text-gray-500">ID: <code className="text-gray-400">{currentUserId}</code></span>
            )}
          </div>
          <div>
            Real-time collaborative coding platform
          </div>
        </div>
      </footer>
    </div>
  );
};
