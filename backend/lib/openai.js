const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateFlashcards(text) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: `You are a flashcard generator. Given some text, create clear and concise flashcards for studying.
Return ONLY a valid JSON array with no extra text, no markdown, no code fences.
Each object must have exactly two keys: "question" and "answer".
Generate between 5 and 15 flashcards depending on the content length.
Keep questions specific and answers brief but complete.`,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  const raw = response.choices[0].message.content.trim();
  const cards = JSON.parse(raw);

  if (!Array.isArray(cards)) {
    throw new Error("OpenAI did not return an array.");
  }

  return cards.map(({ question, answer }) => ({ question, answer }));
}

async function explainCard(question, answer) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: `You are a helpful tutor. The student is studying with flashcards and wants a deeper explanation of a concept.
Explain it clearly and concisely. Use simple language. If the topic involves programming, include a short code example.
Use markdown formatting: use **bold** for key terms, use \`code\` for inline code, and use fenced code blocks with language tags for code examples.
Keep the explanation under 300 words.`,
      },
      {
        role: "user",
        content: `Question: ${question}\nAnswer: ${answer}\n\nPlease explain this in more detail.`,
      },
    ],
  });

  return response.choices[0].message.content.trim();
}

module.exports = { generateFlashcards, explainCard };
