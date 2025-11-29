import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { Code2, Users, Zap, ArrowRight, Sun, Moon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/themeSlice';

export const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.theme);
  
  const [roomId, setRoomId] = useState('');
  const [createUsername, setCreateUsername] = useState('');
  const [joinUsername, setJoinUsername] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    if (!createUsername.trim()) {
      alert('Please enter your name');
      return;
    }
    setIsCreating(true);
    try {
      const response = await api.createRoom(selectedLanguage);
      localStorage.setItem('username', createUsername.trim());
      navigate(`/room/${response.roomId}?username=${encodeURIComponent(createUsername.trim())}`);
    } catch (error: any) {
      console.error('Failed to create room:', error);
      alert(error?.message || 'Failed to create room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = () => {
    if (!joinUsername.trim()) {
      alert('Please enter your name');
      return;
    }
    if (roomId.trim()) {
      localStorage.setItem('username', joinUsername.trim());
      navigate(`/room/${roomId.trim()}?username=${encodeURIComponent(joinUsername.trim())}`);
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code2 className="w-8 h-8 text-primary-500" />
            <h1 className="text-2xl font-bold">PairCraft</h1>
          </div>
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-300" />
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-blue-500 bg-clip-text text-transparent">
            Real-Time Collaborative Coding
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Code together in real-time with your team. Share a room, write code, and see changes instantly.
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <Users className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Collaborate Live</h3>
              <p className="text-gray-400 text-sm">
                See your teammates' changes in real-time as they type
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <Code2 className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Multi-Language Support</h3>
              <p className="text-gray-400 text-sm">
                Support for Python, JavaScript, TypeScript, and more
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <Zap className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Smart Autocomplete</h3>
              <p className="text-gray-400 text-sm">
                AI-powered suggestions to boost your productivity
              </p>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Create Room Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Create a Room</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={createUsername}
                  onChange={(e) => setCreateUsername(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                </select>
              </div>
              <button
                onClick={handleCreateRoom}
                disabled={isCreating}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isCreating ? 'Creating...' : 'Create Room'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Join Room Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Join a Room</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={joinUsername}
                  onChange={(e) => setJoinUsername(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Room ID
                </label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                  placeholder="Enter room ID..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button
                onClick={handleJoinRoom}
                disabled={!roomId.trim()}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Join Room
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
