export async function getRecommendations(query, products) {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!key || key === 'YOUR_OPENROUTER_API_KEY') {
    throw new Error('Missing OpenRouter API key. Set VITE_OPENROUTER_API_KEY in .env');
  }
  const prompt = `You are a friendly shopping assistant for this store.
Products (JSON): ${JSON.stringify(products)}
User request: "${query}"

Pick the products from the list that best match the request.
Reply with ONLY JSON in this exact shape:
{"message":"<one or two friendly sentences answering the user>","recommendations":[<matching product ids>]}

Rules:
- "message" must be natural language addressed to the user, summarizing your picks (mention price range or why they fit).
- If NO product in the list matches, set "recommendations" to [] and write a helpful "message" explaining nothing matched and suggesting the closest alternative or a different budget/category.
- Only use ids that exist in the product list.`;
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + key,
    },
    body: JSON.stringify({
      model: 'openrouter/free',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenRouter request failed: ${res.status} ${body}`);
  }
  const data = await res.json();
  const txt = data.choices?.[0]?.message?.content || '{"recommendations":[]}';
  const cleaned = txt.trim().replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
  const parsed = JSON.parse(cleaned);
  return {
    message: typeof parsed.message === 'string' ? parsed.message : '',
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
  };
}
