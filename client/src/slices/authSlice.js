import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login as loginApi, register as registerApi } from '../api/auth.js';

const storedUser = JSON.parse(localStorage.getItem('smartcart_user') || 'null');
const storedToken = localStorage.getItem('smartcart_token');

const persistSession = ({ user, token }) => {
  localStorage.setItem('smartcart_user', JSON.stringify(user));
  localStorage.setItem('smartcart_token', token);
};

export const registerUser = createAsyncThunk('auth/register', async (payload) => registerApi(payload));
export const loginUser = createAsyncThunk('auth/login', async (payload) => loginApi(payload));

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    token: storedToken,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('smartcart_user');
      localStorage.removeItem('smartcart_token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        persistSession(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        persistSession(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
