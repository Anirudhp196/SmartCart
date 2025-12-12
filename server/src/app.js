import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import itemRoutes from './routes/itemRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { startPriceDecayScheduler } from './services/pricingService.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/items', itemRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/pricing', pricingRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

// Background price decay scheduler (idle price easing)
startPriceDecayScheduler();

export default app;
