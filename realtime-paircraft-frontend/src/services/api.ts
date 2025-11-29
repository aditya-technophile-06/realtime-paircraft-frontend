const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface RoomResponse {
  roomId: string;
}

export interface RoomDetails {
  id: string;
  code: string;
  language: string;
  created_at: string;
}

export interface AutocompleteRequest {
  code: string;
  cursorPosition: number;
  language: string;
  model?: string;
}

export interface AutocompleteResponse {
  suggestion: string;
  position: number;
}

export interface AIModel {
  key: string;
  name: string;
}

export interface RunCodeResponse {
  output: string;
  error?: string;
  executionTime?: number;
}

export const api = {
  async createRoom(language: string = 'python'): Promise<RoomResponse> {
    try {
      const response = await fetch(`${API_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language }),
      });

      if (!response.ok) {
        const error: any = new Error('Failed to create room');
        error.response = { status: response.status };
        throw error;
      }

      return response.json();
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        const error: any = new Error('Cannot connect to server. Please check if the backend is running.');
        error.response = { status: 0 };
        throw error;
      }
      throw err;
    }
  },

  async getRoom(roomId: string): Promise<RoomDetails> {
    try {
      const response = await fetch(`${API_URL}/rooms/${roomId}`);

      if (!response.ok) {
        const error: any = new Error(response.status === 404 ? 'Room not found' : 'Failed to get room');
        error.response = { status: response.status };
        throw error;
      }

      return response.json();
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        const error: any = new Error('Cannot connect to server. Please check if the backend is running.');
        error.response = { status: 0 };
        throw error;
      }
      throw err;
    }
  },

  async getAutocomplete(request: AutocompleteRequest): Promise<AutocompleteResponse> {
    const response = await fetch(`${API_URL}/rooms/autocomplete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: request.code,
        cursorPosition: request.cursorPosition,
        language: request.language,
        model: request.model || 'auto',
      }),
    });

    if (!response.ok) {
      throw new Error('Autocomplete request failed');
    }

    return response.json();
  },

  async getModels(): Promise<{ models: AIModel[] }> {
    const response = await fetch(`${API_URL}/rooms/models`);
    
    if (!response.ok) {
      throw new Error('Failed to get models');
    }

    return response.json();
  },

  async runCode(roomId: string, code: string, language: string): Promise<RunCodeResponse> {
    const response = await fetch(`${API_URL}/rooms/${roomId}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Code execution failed' }));
      throw new Error(error.detail || 'Code execution failed');
    }

    return response.json();
  },
};
