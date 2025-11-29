import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditorState {
  code: string;
  language: string;
  cursorPosition: number;
  isAutoCompleteEnabled: boolean;
  suggestion: string;
}

const initialState: EditorState = {
  code: '# Welcome to PairCraft!\n# Start coding...\n\n',
  language: 'python',
  cursorPosition: 0,
  isAutoCompleteEnabled: true,
  suggestion: '',
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setCursorPosition: (state, action: PayloadAction<number>) => {
      state.cursorPosition = action.payload;
    },
    setSuggestion: (state, action: PayloadAction<string>) => {
      state.suggestion = action.payload;
    },
    toggleAutoComplete: (state) => {
      state.isAutoCompleteEnabled = !state.isAutoCompleteEnabled;
    },
    resetEditor: (state) => {
      state.code = initialState.code;
      state.language = initialState.language;
      state.cursorPosition = 0;
      state.suggestion = '';
    },
  },
});

export const {
  setCode,
  setLanguage,
  setCursorPosition,
  setSuggestion,
  toggleAutoComplete,
  resetEditor,
} = editorSlice.actions;

export default editorSlice.reducer;
