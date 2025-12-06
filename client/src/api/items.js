import client from './client.js';

export const fetchItems = ({
  page = 1,
  pageSize = 50,
  minPrice,
  maxPrice,
  search,
} = {}) =>
  client
    .get('/items', {
      params: {
        page,
        pageSize,
        minPrice,
        maxPrice,
        search,
      },
    })
    .then((res) => res.data);
export const createItem = (payload) => client.post('/items', payload).then((res) => res.data);
export const updateItem = (id, payload) => client.put(`/items/${id}`, payload).then((res) => res.data);
export const deleteItem = (id) => client.delete(`/items/${id}`);
