import client from './client.js';

export const getCart = () => client.get('/cart').then((res) => res.data);
export const addToCart = (payload) => client.post('/cart/add', payload).then((res) => res.data);
export const removeFromCart = (payload) => client.delete('/cart/remove', { data: payload }).then((res) => res.data);
