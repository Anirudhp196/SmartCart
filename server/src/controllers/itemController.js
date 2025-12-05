import {
  listItems,
  createItem,
  updateItem,
  deleteItem,
  getItemById,
} from '../services/itemService.js';

export const getItems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 50;
    const result = await listItems({ page, pageSize });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const postItem = async (req, res, next) => {
  try {
    const payload = { ...req.body, sellerId: req.user.id };
    const item = await createItem(payload);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const putItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await getItemById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    if (item.sellerId !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own items' });
    }

    const updated = await updateItem(id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await getItemById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    if (item.sellerId !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own items' });
    }

    await deleteItem(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
