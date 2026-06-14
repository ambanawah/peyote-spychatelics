import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: { id: string; name: string; email: string; role: string } | null;
  accessToken: string | null;
  isLoading: boolean;
}

const initialState: AuthState = { user: null, accessToken: null, isLoading: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: any; accessToken: string }>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export const selectCurrentUser = (s: any) => s.auth.user;
export const selectIsAdmin = (s: any) => s.auth.user?.role === 'ADMIN';
export default authSlice.reducer;
