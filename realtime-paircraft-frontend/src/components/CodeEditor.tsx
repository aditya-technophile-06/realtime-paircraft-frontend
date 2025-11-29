import { useEffect, useRef, useCallback, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCode, setCursorPosition } from '@/store/slices/editorSlice';
import { wsService, WebSocketMessage } from '@/services/websocket';
import { api } from '@/services/api';
import type * as Monaco from 'monaco-editor';

interface CodeEditorProps {
  readOnly?: boolean;
}

interface RemoteCursor {
  userId: string;
  username: string;
  lineNumber: number;
  column: number;
  color: string;
}

const getUserColor = (userId: string): string => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const CodeEditor = ({ readOnly = false }: CodeEditorProps) => {
  const dispatch = useAppDispatch();
  const { code, language, isAutoCompleteEnabled, aiModel } = useAppSelector((state) => state.editor);
  const { theme } = useAppSelector((state) => state.theme);
  const currentUserId = useAppSelector((state) => state.room.currentUserId);
  
  const editorTheme = theme === 'light' ? 'vs' : 'vs-dark';
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const cursorUpdateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const cursorLabelsRef = useRef<HTMLDivElement[]>([]);
  const providerRef = useRef<Monaco.IDisposable | null>(null);
  const [remoteCursors, setRemoteCursors] = useState<Map<string, RemoteCursor>>(new Map());
  const [activeTypers, setActiveTypers] = useState<Set<string>>(new Set()); // Track who is actively typing
  const [hasSuggestion, setHasSuggestion] = useState(false);
  const isLocalEditRef = useRef<boolean>(true); // Track if edit is from local user or remote
  const typerTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRequestIdRef = useRef<number>(0);
  
  const stateRef = useRef({ language, aiModel, isAutoCompleteEnabled });
  const lastCodeRef = useRef<string>(code);
  
  useEffect(() => {
    stateRef.current = { language, aiModel, isAutoCompleteEnabled };
  }, [language, aiModel, isAutoCompleteEnabled]);
  
  // When code prop changes (from remote updates), update our ref
  useEffect(() => {
    // Only update if it's different from what we last sent
    if (code !== lastCodeRef.current) {
      lastCodeRef.current = code;
      isLocalEditRef.current = false; // Mark as remote edit
    }
  }, [code]);

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const newDecorations: Monaco.editor.IModelDeltaDecoration[] = [];
    
    // Remove old cursor labels
    cursorLabelsRef.current.forEach(label => label.remove());
    cursorLabelsRef.current = [];
    
    remoteCursors.forEach((cursor) => {
      // Only show labels for OTHER users who are ACTIVELY TYPING
      if (cursor.userId === currentUserId || !activeTypers.has(cursor.userId)) {
        return;
      }
      
      // Add cursor line decoration
      newDecorations.push({
        range: new monaco.Range(cursor.lineNumber, cursor.column, cursor.lineNumber, cursor.column + 1),
        options: {
          className: `remote-cursor-decoration`,
          beforeContentClassName: `remote-cursor-line-${cursor.color.replace('#', '')}`,
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        }
      });
      
      // Create floating username label below cursor
      const editorDom = editor.getDomNode();
      if (editorDom) {
        const coords = editor.getScrolledVisiblePosition({ lineNumber: cursor.lineNumber, column: cursor.column });
        if (coords) {
          const label = document.createElement('div');
          label.className = 'remote-cursor-label';
          label.textContent = cursor.username;
          label.style.cssText = `
            position: absolute;
            left: ${coords.left}px;
            top: ${coords.top + 20}px;
            background: ${cursor.color};
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            white-space: nowrap;
            z-index: 100;
            pointer-events: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          `;
          editorDom.appendChild(label);
          cursorLabelsRef.current.push(label);
          
          // Add dynamic style for cursor color
          const styleId = `cursor-style-${cursor.color.replace('#', '')}`;
          if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
              .remote-cursor-line-${cursor.color.replace('#', '')} {
                border-left: 2px solid ${cursor.color} !important;
                margin-left: -2px;
              }
            `;
            document.head.appendChild(style);
          }
        }
      }
    });
    
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);
  }, [remoteCursors, currentUserId, activeTypers]);

  useEffect(() => {
    const handleMessage = (message: WebSocketMessage) => {
      // Track cursor positions
      if (message.type === 'cursor_position' && message.userId && message.userId !== currentUserId) {
        setRemoteCursors(prev => {
          const newMap = new Map(prev);
          newMap.set(message.userId!, {
            userId: message.userId!,
            username: message.username || 'Anonymous',
            lineNumber: message.lineNumber || 1,
            column: message.column || 1,
            color: getUserColor(message.userId!),
          });
          return newMap;
        });
      }
      
      // Mark user as actively typing when they send code updates
      if (message.type === 'code_update' && message.userId && message.userId !== currentUserId) {
        const userId = message.userId;
        
        // Mark as active typer
        setActiveTypers(prev => new Set(prev).add(userId));
        
        // Clear any existing timeout for this user
        if (typerTimeoutsRef.current.has(userId)) {
          clearTimeout(typerTimeoutsRef.current.get(userId)!);
        }
        
        // Remove from active typers after 2 seconds of no typing
        const timeout = setTimeout(() => {
          setActiveTypers(prev => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
          typerTimeoutsRef.current.delete(userId);
        }, 2000);
        
        typerTimeoutsRef.current.set(userId, timeout);
      }
      
      if (message.type === 'user_left' && message.userId) {
        setRemoteCursors(prev => {
          const newMap = new Map(prev);
          newMap.delete(message.userId!);
          return newMap;
        });
      }
    };

    wsService.onMessage(handleMessage);
    return () => wsService.removeMessageHandler(handleMessage);
  }, [currentUserId]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    const styleId = 'paircraft-editor-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .remote-cursor-decoration {
          background-color: rgba(255, 107, 107, 0.2);
        }
        .remote-cursor-label {
          animation: fadeIn 0.2s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .monaco-editor .ghost-text-decoration,
        .monaco-editor .ghost-text-decoration-preview {
          opacity: 0.6 !important;
          color: #888 !important;
        }
        .suggest-preview-text {
          opacity: 0.7 !important;
        }
      `;
      document.head.appendChild(style);
    }

    if (providerRef.current) {
      providerRef.current.dispose();
    }

    providerRef.current = monaco.languages.registerInlineCompletionsProvider(
      { pattern: '**' }, 
      {
        provideInlineCompletions: async (model, position, _context, token) => {
          if (!stateRef.current.isAutoCompleteEnabled || !isLocalEditRef.current) {
            return { items: [] };
          }

          const code = model.getValue();
          const offset = model.getOffsetAt(position);
          
          if (code.trim().length < 3) {
            return { items: [] };
          }

          // Debounce: wait 600ms before making API call
          const requestId = ++lastRequestIdRef.current;
          
          await new Promise<void>((resolve) => {
            if (debounceTimeoutRef.current) {
              clearTimeout(debounceTimeoutRef.current);
            }
            
            debounceTimeoutRef.current = setTimeout(() => {
              resolve();
            }, 600);
          });
          
          // Check if this request is stale (newer request was made)
          if (requestId !== lastRequestIdRef.current || token.isCancellationRequested) {
            console.log('⏭️ Request cancelled (newer request pending)');
            return { items: [] };
          }

          try {
            console.log('🤖 Fetching AI completion after 600ms delay...', { offset, lang: stateRef.current.language });
            
            const response = await api.getAutocomplete({
              code,
              cursorPosition: offset,
              language: stateRef.current.language,
              model: stateRef.current.aiModel,
            });

            if (token.isCancellationRequested || requestId !== lastRequestIdRef.current) {
              console.log('⏭️ Response discarded (request cancelled)');
              return { items: [] };
            }

            if (response.suggestion && response.suggestion.trim()) {
              console.log('✅ Got suggestion:', response.suggestion.substring(0, 100));
              setHasSuggestion(true);
              
              return {
                items: [{
                  insertText: response.suggestion,
                  range: new monaco.Range(
                    position.lineNumber,
                    position.column,
                    position.lineNumber,
                    position.column
                  ),
                }],
              };
            }
          } catch (error) {
            console.error('❌ Autocomplete error:', error);
          }

          setHasSuggestion(false);
          return { items: [] };
        },
        freeInlineCompletions: () => {
          setHasSuggestion(false);
        },
      }
    );

    editor.onDidChangeCursorPosition((e) => {
      const position = editor.getModel()?.getOffsetAt(e.position) || 0;
      dispatch(setCursorPosition(position));
      
      if (cursorUpdateTimeoutRef.current) {
        clearTimeout(cursorUpdateTimeoutRef.current);
      }
      
      cursorUpdateTimeoutRef.current = setTimeout(() => {
        if (wsService.isConnected()) {
          wsService.send({
            type: 'cursor_position',
            cursorPosition: position,
            lineNumber: e.position.lineNumber,
            column: e.position.column,
          });
        }
      }, 100);
    });
  };

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (value === undefined) return;

    if (value === lastCodeRef.current) {
      return;
    }
    
    isLocalEditRef.current = true;
    
    lastCodeRef.current = value;
    
    dispatch(setCode(value));

    if (wsService.isConnected()) {
      wsService.send({
        type: 'code_update',
        code: value,
        language,
      });
    }
  }, [dispatch, language]);

  useEffect(() => {
    return () => {
      if (cursorUpdateTimeoutRef.current) {
        clearTimeout(cursorUpdateTimeoutRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (providerRef.current) {
        providerRef.current.dispose();
      }
      cursorLabelsRef.current.forEach(label => label.remove());
      typerTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return (
    <div className="h-full w-full relative">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={handleCodeChange}
        onMount={handleEditorDidMount}
        theme={editorTheme}
        options={{
          readOnly,
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
          inlineSuggest: {
            enabled: true,
            showToolbar: 'onHover',
            mode: 'subword',
          },
          suggest: {
            preview: true,
            previewMode: 'subwordSmart',
          },
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          parameterHints: { enabled: true },
        }}
      />
      
      {hasSuggestion && (
        <div className="absolute bottom-4 right-4 bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-300 z-10 shadow-lg flex items-center gap-3">
          <span>
            <kbd className="bg-gray-700 px-2 py-0.5 rounded text-white font-mono text-xs">Tab</kbd>
            <span className="ml-1">Accept</span>
          </span>
          <span>
            <kbd className="bg-gray-700 px-2 py-0.5 rounded text-white font-mono text-xs">Esc</kbd>
            <span className="ml-1">Dismiss</span>
          </span>
        </div>
      )}
    </div>
  );
};
