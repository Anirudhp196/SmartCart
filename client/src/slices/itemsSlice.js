import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchItems as fetchItemsApi,
  createItem as createItemApi,
  updateItem as updateItemApi,
  deleteItem as deleteItemApi,
} from '../api/items.js';
import { addItemToCart } from './cartSlice.js';

export const fetchItems = createAsyncThunk(
  'items/fetchAll',
  async (params = {}) => fetchItemsApi(params),
);
export const createNewItem = createAsyncThunk('items/create', async (payload) => createItemApi(payload));
export const updateExistingItem = createAsyncThunk(
  'items/update',
  async ({ id, data }) => updateItemApi(id, data),
);
export const removeItem = createAsyncThunk('items/delete', async (id) => {
  await deleteItemApi(id);
  return id;
});

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    selectedItem: null,
    page: 1,
    pageSize: 50,
    total: 0,
    totalPages: 0,
  },
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createNewItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateExistingItem.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        );
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        // Optimistically decrement inventory locally for the item added to cart
        const { itemId, quantity = 1 } = action.meta?.arg || {};
        if (!itemId) return;
        state.items = state.items.map((item) => {
          if (item.id !== itemId) return item;
          const nextQty = Math.max(0, (item.inventory?.quantity || 0) - quantity);
          return {
            ...item,
            inventory: item.inventory ? { ...item.inventory, quantity: nextQty } : { quantity: nextQty },
          };
        });
      });
  },
});

export const { setSelectedItem } = itemsSlice.actions;
export default itemsSlice.reducer;
