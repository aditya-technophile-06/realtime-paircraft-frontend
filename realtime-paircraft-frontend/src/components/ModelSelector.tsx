import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAiModel } from '@/store/slices/editorSlice';
import { api, AIModel } from '@/services/api';
import { Sparkles, ChevronDown } from 'lucide-react';

export const ModelSelector = () => {
  const dispatch = useAppDispatch();
  const { aiModel, isAutoCompleteEnabled } = useAppSelector((state) => state.editor);
  const [models, setModels] = useState<AIModel[]>([
    { key: 'auto', name: 'Auto (Best Available)' },
    { key: 'deepseek', name: 'DeepSeek V3' },
    { key: 'claude-haiku', name: 'Claude 3 Haiku' },
    { key: 'gpt-3.5', name: 'GPT-3.5 Turbo' },
    { key: 'gpt-4o-mini', name: 'GPT-4o Mini' },
    { key: 'llama-3', name: 'Llama 3.1 8B' },
    { key: 'gemini', name: 'Gemini 1.5 Flash' },
    { key: 'mistral', name: 'Mistral 7B' },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Try to fetch models from server
    api.getModels()
      .then((response) => {
        if (response.models && response.models.length > 0) {
          setModels(response.models);
        }
      })
      .catch(() => {
        console.log('Using default models');
      });
  }, []);

  const handleModelChange = (modelKey: string) => {
    dispatch(setAiModel(modelKey));
    setIsOpen(false);
  };

  const currentModelName = models.find(m => m.key === aiModel)?.name || 'Auto';

  if (!isAutoCompleteEnabled) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-200 transition-colors"
        title="Select AI Model"
      >
        <Sparkles className="w-4 h-4 text-yellow-400" />
        <span className="max-w-[120px] truncate">{currentModelName}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-20 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 min-w-[200px]">
            <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700">
              AI Model for Autocomplete
            </div>
            {models.map((model) => (
              <button
                key={model.key}
                onClick={() => handleModelChange(model.key)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors ${
                  aiModel === model.key ? 'text-primary-400 bg-gray-700/50' : 'text-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  {aiModel === model.key && <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />}
                  <span className={aiModel === model.key ? '' : 'ml-3.5'}>{model.name}</span>
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
