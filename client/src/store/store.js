import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../slices/cartSlice.js';
import itemsReducer from '../slices/itemsSlice.js';
import pricingReducer from '../slices/pricingSlice.js';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    items: itemsReducer,
    pricing: pricingReducer,
  },
});

export default store;
