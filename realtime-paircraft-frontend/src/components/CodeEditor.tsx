import { useEffect, useRef, useCallback } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCode, setCursorPosition } from '@/store/slices/editorSlice';
import { wsService } from '@/services/websocket';
import { api } from '@/services/api';
import * as monaco from 'monaco-editor';

interface CodeEditorProps {
  readOnly?: boolean;
}

export const CodeEditor = ({ readOnly = false }: CodeEditorProps) => {
  const dispatch = useAppDispatch();
  const { code, language, isAutoCompleteEnabled } = useAppSelector((state) => state.editor);
  const { theme } = useAppSelector((state) => state.theme);
  
  // Map app theme to Monaco editor theme
  const editorTheme = theme === 'light' ? 'vs' : 'vs-dark';
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const autocompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Listen for cursor position changes
    editor.onDidChangeCursorPosition((e) => {
      const position = editor.getModel()?.getOffsetAt(e.position) || 0;
      dispatch(setCursorPosition(position));
    });
  };

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (value === undefined) return;

    dispatch(setCode(value));

    // Send code update via WebSocket
    if (wsService.isConnected()) {
      wsService.send({
        type: 'code_update',
        code: value,
        language,
      });
    }

    // Trigger autocomplete after typing stops
    if (isAutoCompleteEnabled) {
      if (autocompleteTimeoutRef.current) {
        clearTimeout(autocompleteTimeoutRef.current);
      }

      autocompleteTimeoutRef.current = setTimeout(async () => {
        const cursorPosition = editorRef.current?.getModel()?.getOffsetAt(
          editorRef.current.getPosition()!
        ) || 0;

        try {
          const response = await api.getAutocomplete({
            code: value,
            cursorPosition,
            language,
          });

          if (response.suggestion) {
            // You can show the suggestion in the editor here
            console.log('Autocomplete suggestion:', response.suggestion);
          }
        } catch (error) {
          console.error('Autocomplete error:', error);
        }
      }, 600);
    }
  }, [dispatch, language, isAutoCompleteEnabled]);

  useEffect(() => {
    return () => {
      if (autocompleteTimeoutRef.current) {
        clearTimeout(autocompleteTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="h-full w-full">
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
          tabSize: 2,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          parameterHints: { enabled: true },
        }}
      />
    </div>
  );
};
