import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
let client = null;

if (apiKey) {
  client = new OpenAI({ apiKey });
}

export const getPricingInsight = async (productData) => {
  if (!client) {
    return {
      headline: 'Increase urgency messaging',
      recommendation: 'Limited-time bundles often uplift conversions ~8%.',
      rationale: 'Mock insight: demand is steady but inventory falling; consider nudging buyers.',
    };
  }

  // TODO: Replace with a real OpenAI call (e.g., responses.create) once the API key is provisioned.
  const summary = `Price ${productData?.title || 'item'} based on demand level ${productData?.demandScore ?? 'n/a'}.`;
  return {
    headline: 'AI Pricing Insight',
    recommendation: summary,
    rationale: 'This is a placeholder insight until OpenAI integration is finalized.',
  };
};
