const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

export interface WebSocketMessage {
  type: string;
  roomId?: string;
  userId?: string;
  username?: string;
  code?: string;
  language?: string;
  cursorPosition?: number;
  lineNumber?: number;
  column?: number;
  userCount?: number;
  users?: Array<{ userId: string; username: string }>;
  selection?: any;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private roomId: string | null = null;
  private username: string = 'Anonymous';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 2000;
  private messageHandlers: ((message: WebSocketMessage) => void)[] = [];
  private intentionalClose = false;
  private isConnecting = false;

  connect(roomId: string, username: string = 'Anonymous'): Promise<void> {
    // Prevent multiple simultaneous connection attempts
    if (this.isConnecting) {
      return Promise.resolve();
    }
    
    // If already connected to the same room, don't reconnect
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.roomId === roomId) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.isConnecting = true;
      this.roomId = roomId;
      this.username = username || localStorage.getItem('username') || 'Anonymous';
      this.intentionalClose = false;
      
      const wsUrl = `${WS_URL}/ws/${roomId}?username=${encodeURIComponent(this.username)}`;

      // Set connection timeout
      const connectionTimeout = setTimeout(() => {
        if (this.isConnecting) {
          this.isConnecting = false;
          if (this.ws) {
            this.ws.close();
            this.ws = null;
          }
          reject(new Error('WebSocket connection timeout'));
        }
      }, 5000); // 5 second timeout

      try {
        // Close existing connection first
        if (this.ws) {
          this.intentionalClose = true;
          this.ws.close();
          this.ws = null;
        }

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          clearTimeout(connectionTimeout);
          console.log('WebSocket connected as:', this.username);
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.messageHandlers.forEach(handler => handler(message));
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          clearTimeout(connectionTimeout);
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(new Error('WebSocket connection failed'));
        };

        this.ws.onclose = (event) => {
          clearTimeout(connectionTimeout);
          console.log('WebSocket disconnected, code:', event.code);
          this.isConnecting = false;
          
          // Only attempt reconnect if not intentionally closed
          if (!this.intentionalClose && event.code !== 4001) {
            this.attemptReconnect();
          }
        };
      } catch (error) {
        clearTimeout(connectionTimeout);
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.roomId && !this.intentionalClose) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) as ${this.username}...`);
      
      setTimeout(() => {
        if (this.roomId && !this.intentionalClose) {
          this.connect(this.roomId, this.username).catch(console.error);
        }
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  send(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  onMessage(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler: (message: WebSocketMessage) => void) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  disconnect() {
    this.intentionalClose = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.roomId = null;
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export const wsService = new WebSocketService();
