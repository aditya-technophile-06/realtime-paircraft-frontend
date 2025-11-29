import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setLanguage, setCode } from '@/store/slices/editorSlice';
import { wsService } from '@/services/websocket';
import { Code2 } from 'lucide-react';
import { DEFAULT_CODE } from '@/constants/defaultCode';

const SUPPORTED_LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' },
];

export const LanguageSelector = () => {
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.editor.language);

  const handleLanguageChange = (newLanguage: string) => {
    dispatch(setLanguage(newLanguage));
    
    // Set default code for the new language
    const defaultCode = DEFAULT_CODE[newLanguage] || `// Start coding in ${newLanguage}\n`;
    dispatch(setCode(defaultCode));

    // Notify other users via WebSocket
    if (wsService.isConnected()) {
      wsService.send({
        type: 'language_change',
        language: newLanguage,
        code: defaultCode,
      });
    }
  };

  return (
    <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
      <Code2 className="w-4 h-4 text-gray-400" />
      <select
        value={language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="bg-gray-700 text-white px-3 py-1.5 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};
