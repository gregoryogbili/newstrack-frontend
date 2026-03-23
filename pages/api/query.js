export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'No question provided' });

  const prompt = `You are a query parser for a news intelligence database.
Convert the user's natural language question into a JSON filter object.

Available sort fields: ranking_score, initial_score, published_at
Available categories: geopolitical, economic, technology, political, climate, general
Available time ranges in hours: 6, 12, 24, 48

Rules:
- "dangerous", "critical", "high risk", "most urgent" → sort_by: "ranking_score"
- "latest", "newest", "recent" → sort_by: "published_at"  
- "economic", "market", "financial" → category: "economic"
- "war", "conflict", "military" → category: "geopolitical"
- "last hour" → hours: 6, "today" → hours: 24, "this week" → hours: 48
- Default: sort_by "ranking_score", order "desc", hours 24, limit 10
- Output ONLY valid JSON, no explanation, no markdown.

Example output:
{"sort_by":"ranking_score","order":"desc","hours":24,"category":null,"limit":10}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: question }
        ],
        temperature: 0,
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || '{}';
    const filter = JSON.parse(raw.replace(/```json|```/g, '').trim());
    res.json({ filter });
  } catch (err) {
    console.error('Query parse error:', err);
    res.status(500).json({ error: 'Failed to parse query' });
  }
}