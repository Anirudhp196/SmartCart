/**
 * Stubbed pricing insight service.
 * The original OpenAI-backed implementation was removed; this keeps the
 * controller working and returns a basic heuristic suggestion.
 */
export const getPricingInsight = async ({ title, demandScore, recentPrices }) => {
  const latestPrice = recentPrices?.[0];
  const avgRecent = recentPrices?.length
    ? recentPrices.reduce((sum, p) => sum + p, 0) / recentPrices.length
    : null;

  let suggestion = 'Maintain current price while monitoring demand.';
  if (typeof demandScore === 'number' && typeof latestPrice === 'number' && typeof avgRecent === 'number') {
    if (demandScore > 50 && latestPrice <= avgRecent) {
      suggestion = 'Demand trending up; consider a small price increase.';
    } else if (demandScore < 10 && latestPrice >= avgRecent) {
      suggestion = 'Demand softening; consider a modest price decrease.';
    }
  }

  return {
    title,
    demandScore,
    recentPrices,
    aiEnabled: false,
    summary: 'AI insights disabled; using basic heuristic.',
    suggestion,
  };
};
