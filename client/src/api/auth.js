import client from './client.js';

export const register = (payload) => client.post('/auth/register', payload).then((res) => res.data);
export const login = (payload) => client.post('/auth/login', payload).then((res) => res.data);
