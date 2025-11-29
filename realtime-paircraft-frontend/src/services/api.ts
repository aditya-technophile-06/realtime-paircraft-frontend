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
}

export interface AutocompleteResponse {
  suggestion: string;
  position: number;
}

export interface RunCodeResponse {
  output: string;
  error?: string;
  executionTime?: number;
}

export const api = {
  async createRoom(language: string = 'python'): Promise<RoomResponse> {
    const response = await fetch(`${API_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ language }),
    });

    if (!response.ok) {
      throw new Error('Failed to create room');
    }

    return response.json();
  },

  async getRoom(roomId: string): Promise<RoomDetails> {
    const response = await fetch(`${API_URL}/rooms/${roomId}`);

    if (!response.ok) {
      throw new Error('Room not found');
    }

    return response.json();
  },

  async getAutocomplete(request: AutocompleteRequest): Promise<AutocompleteResponse> {
    const response = await fetch(`${API_URL}/rooms/autocomplete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Autocomplete request failed');
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
