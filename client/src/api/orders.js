import client from './client.js';

export const checkout = () => client.post('/orders/checkout').then((res) => res.data);
export const fetchOrders = () => client.get('/orders/history').then((res) => res.data);
