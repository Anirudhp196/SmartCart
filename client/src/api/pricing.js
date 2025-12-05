import client from './client.js';

export const getPricingHistory = (itemId) =>
  client.get(`/pricing/history/${itemId}`).then((res) => res.data);

export const getPricingInsight = (itemId) =>
  client.get(`/pricing/insights/${itemId}`).then((res) => res.data);
