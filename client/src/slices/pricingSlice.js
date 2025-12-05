import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPricingHistory, getPricingInsight } from '../api/pricing.js';

export const fetchPricingHistory = createAsyncThunk(
  'pricing/history',
  async (itemId) => ({ itemId, data: await getPricingHistory(itemId) }),
);

export const fetchPricingInsight = createAsyncThunk(
  'pricing/insight',
  async (itemId) => ({ itemId, data: await getPricingInsight(itemId) }),
);

const pricingSlice = createSlice({
  name: 'pricing',
  initialState: {
    historyByItem: {},
    insightsByItem: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPricingHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPricingHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.historyByItem[action.payload.itemId] = action.payload.data;
      })
      .addCase(fetchPricingHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchPricingInsight.fulfilled, (state, action) => {
        state.insightsByItem[action.payload.itemId] = action.payload.data;
      });
  },
});

export default pricingSlice.reducer;
