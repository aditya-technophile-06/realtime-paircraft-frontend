import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  userId: string;
  username: string;
  cursorPosition?: number;
}

export interface RoomState {
  roomId: string | null;
  isConnected: boolean;
  users: User[];
  userCount: number;
  currentUserId: string | null;
  currentUsername: string | null;
}

const initialState: RoomState = {
  roomId: null,
  isConnected: false,
  users: [],
  userCount: 0,
  currentUserId: null,
  currentUsername: null,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setCurrentUserId: (state, action: PayloadAction<string>) => {
      state.currentUserId = action.payload;
    },
    setCurrentUsername: (state, action: PayloadAction<string>) => {
      state.currentUsername = action.payload;
    },
    setUserCount: (state, action: PayloadAction<number>) => {
      state.userCount = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      const exists = state.users.find(u => u.userId === action.payload.userId);
      if (!exists) {
        state.users.push(action.payload);
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(u => u.userId !== action.payload);
    },
    updateUserCursor: (state, action: PayloadAction<{ userId: string; cursorPosition: number }>) => {
      const user = state.users.find(u => u.userId === action.payload.userId);
      if (user) {
        user.cursorPosition = action.payload.cursorPosition;
      }
    },
    resetRoom: (state) => {
      state.roomId = null;
      state.isConnected = false;
      state.users = [];
      state.userCount = 0;
      state.currentUserId = null;
      state.currentUsername = null;
    },
  },
});

export const {
  setRoomId,
  setConnected,
  setCurrentUserId,
  setCurrentUsername,
  setUserCount,
  setUsers,
  addUser,
  removeUser,
  updateUserCursor,
  resetRoom,
} = roomSlice.actions;

export default roomSlice.reducer;
