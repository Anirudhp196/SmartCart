import { getPricingHistory } from '../services/pricingService.js';
import { getItemById } from '../services/itemService.js';
import { getPricingInsight } from '../services/openaiService.js';

export const fetchPricingHistory = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const history = await getPricingHistory(itemId);
    res.json(history);
  } catch (error) {
    next(error);
  }
};

export const fetchPricingInsight = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await getItemById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    const history = await getPricingHistory(itemId);
    const insight = await getPricingInsight({
      title: item.title,
      demandScore: item.views + item.cartAdds,
      recentPrices: history.slice(0, 5).map((h) => h.price),
    });
    res.json(insight);
  } catch (error) {
    next(error);
  }
};
