import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  // Basic CORS (helps Expo/snack/web)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  try {
    const { input } = req.body || {};
    if (!input || !String(input).trim()) {
      return res.status(400).json({ error: "Missing input" });
    }

    const prompt = `Write a short video script based on this idea: "${String(input).trim()}". Include: Hook/Intro, Main Content, Call to Action.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    const script = completion.choices?.[0]?.message?.content ?? "";
    return res.status(200).json({ script });
  } catch (e) {
    return res.status(500).json({ error: "Failed to generate script" });
  }
}
