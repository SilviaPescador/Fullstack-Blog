import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODERATION_PROMPT = `You are a content moderator and classifier for a community blog called "Our Garden".

Analyze the following blog post and return a JSON response with these fields:

1. "summary": A 2-sentence summary of the post content (in the same language as the post).
2. "tags": An array of 2-5 relevant tags (short, lowercase, in English).
3. "spam_score": A number 0-1 indicating how likely this is spam (0 = not spam, 1 = definitely spam).
4. "toxicity_score": A number 0-1 indicating toxicity level (0 = friendly, 1 = very toxic).
5. "visual_dna": An object describing what kind of plant this post should generate:
   - "type": one of "geometric" (technical/code), "organic" (reflective/personal), "flowering" (creative/artistic), "crystalline" (educational/resource)
   - "height": 1-5 (based on content depth)
   - "complexity": 1-5 (based on content richness)
   - "branching": 1-5 (based on how many topics/ideas)
   - "primaryColor": a hex color that matches the post mood
   - "secondaryColor": a complementary hex color
   - "seed": a random integer 1-99999

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation.

Post title: {title}
Post content: {content}`;

export async function moderatePost(title, content) {
	const prompt = MODERATION_PROMPT
		.replace('{title}', title)
		.replace('{content}', content.substring(0, 3000));

	const message = await client.messages.create({
		model: 'claude-haiku-4-20250414',
		max_tokens: 500,
		messages: [{ role: 'user', content: prompt }],
	});

	const text = message.content[0]?.text || '{}';

	// Parse JSON, handle potential markdown wrapping
	const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
	const result = JSON.parse(cleaned);

	return {
		summary: result.summary || '',
		tags: Array.isArray(result.tags) ? result.tags : [],
		spam_score: Number(result.spam_score) || 0,
		toxicity_score: Number(result.toxicity_score) || 0,
		visual_dna: {
			type: result.visual_dna?.type || 'organic',
			height: Math.min(5, Math.max(1, Number(result.visual_dna?.height) || 3)),
			complexity: Math.min(5, Math.max(1, Number(result.visual_dna?.complexity) || 3)),
			branching: Math.min(5, Math.max(1, Number(result.visual_dna?.branching) || 3)),
			primaryColor: result.visual_dna?.primaryColor || '#3ECF8E',
			secondaryColor: result.visual_dna?.secondaryColor || '#2DD4BF',
			seed: Number(result.visual_dna?.seed) || Math.floor(Math.random() * 99999),
		},
	};
}
