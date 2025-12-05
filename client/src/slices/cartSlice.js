import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addToCart, getCart, removeFromCart } from '../api/cart.js';

const enrichCart = (cart) => {
  if (!cart) return { items: [], total: 0 };
  const total = cart.cartItems.reduce(
    (sum, ci) => sum + ci.item.currentPrice * ci.quantity,
    0,
  );
  return { ...cart, total };
};

export const fetchCart = createAsyncThunk('cart/fetch', async () => getCart());
export const addItemToCart = createAsyncThunk('cart/add', async (payload) => addToCart(payload));
export const removeItemFromCart = createAsyncThunk('cart/remove', async (payload) => removeFromCart(payload));

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    data: { cartItems: [], total: 0 },
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = enrichCart(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.data = enrichCart(action.payload);
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.data = enrichCart(action.payload);
      });
  },
});

export default cartSlice.reducer;
