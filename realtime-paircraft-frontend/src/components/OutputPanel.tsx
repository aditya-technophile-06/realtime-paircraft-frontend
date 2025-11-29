import { useState } from 'react';
import { Play, Trash2, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { api } from '@/services/api';

interface OutputPanelProps {
  isExpanded: boolean;
  onToggle: () => void;
  height: number;
  onHeightChange: (height: number) => void;
}

export const OutputPanel = ({ isExpanded, onToggle, height, onHeightChange }: OutputPanelProps) => {
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const code = useAppSelector((state) => state.editor.code);
  const language = useAppSelector((state) => state.editor.language);
  const roomId = useAppSelector((state) => state.room.roomId);

  const handleRun = async () => {
    if (!roomId) return;
    
    setIsRunning(true);
    setError(null);
    setOutput('Running...\n');
    
    try {
      const result = await api.runCode(roomId, code, language);
      setOutput(result.output || 'Code executed successfully (no output)');
      if (result.error) {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to run code');
      setOutput('');
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setOutput('');
    setError(null);
  };

  const handleDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = startY - moveEvent.clientY;
      const newHeight = Math.max(100, Math.min(500, startHeight + delta));
      onHeightChange(newHeight);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div 
      className="bg-gray-800 border-t border-gray-700 flex flex-col"
      style={{ height: isExpanded ? height : 40 }}
    >
      {/* Header with drag handle */}
      <div 
        className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700 cursor-ns-resize select-none"
        onMouseDown={handleDrag}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onToggle}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            <span className="text-sm font-medium">Output</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Run
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Output content */}
      {isExpanded && (
        <div className="flex-1 overflow-auto p-4 font-mono text-sm">
          {error ? (
            <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
          ) : output ? (
            <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
          ) : (
            <span className="text-gray-500">Click "Run" to execute your code...</span>
          )}
        </div>
      )}
    </div>
  );
};
