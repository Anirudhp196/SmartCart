import {
  listItems,
  createItem,
  updateItem,
  deleteItem,
  getItemById,
} from '../services/itemService.js';
import { handleItemView } from '../services/pricingService.js';

export const getItems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 50;
    const { minPrice, maxPrice, search, trackViews } = req.query;

    const result = await listItems({
      page,
      pageSize,
      minPrice,
      maxPrice,
      search,
      trackViews: trackViews === 'true', // default off to avoid mass view-triggered repricing
    });
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

    await deleteItem(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const viewItemAndReprice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await getItemById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    await handleItemView(id);
    const updated = await getItemById(id);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};
