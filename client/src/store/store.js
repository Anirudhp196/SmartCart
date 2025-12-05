import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice.js';
import cartReducer from '../slices/cartSlice.js';
import itemsReducer from '../slices/itemsSlice.js';
import pricingReducer from '../slices/pricingSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    items: itemsReducer,
    pricing: pricingReducer,
  },
});

export default store;
