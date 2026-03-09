const OpenAI = require("openai");
const config = require("../config");

const PROMPTS = {
  flashcardGenerator: `You are a flashcard generator. Given some text, create clear and concise flashcards for studying.
Return ONLY a valid JSON array with no extra text, no markdown, no code fences.
Each object must have exactly two keys: "question" and "answer".
Generate between 5 and 15 flashcards depending on the content length.
Keep questions specific and answers brief but complete.`,

  cardExplainer: `You are a helpful tutor. The student is studying with flashcards and wants a deeper explanation of a concept.
Explain it clearly and concisely. Use simple language. If the topic involves programming, include a short code example.
Use markdown formatting: use **bold** for key terms, use \`code\` for inline code, and use fenced code blocks with language tags for code examples.
Keep the explanation under 300 words.`,
};

class AIService {
  constructor() {
    this._client = new OpenAI({ apiKey: config.openai.apiKey });
  }

  /**
   * @param {string} text
   * @returns {Promise<Array<{question: string, answer: string}>>}
   */
  async generateFlashcards(text) {
    const response = await this._chat(PROMPTS.flashcardGenerator, text);
    const cards = JSON.parse(response);

    if (!Array.isArray(cards)) {
      throw new Error("AI did not return a valid card array.");
    }

    return cards.map(({ question, answer }) => ({ question, answer }));
  }

  /**
   * @param {string} question
   * @param {string} answer
   * @returns {Promise<string>} Markdown explanation
   */
  async explainCard(question, answer) {
    const userMessage = `Question: ${question}\nAnswer: ${answer}\n\nPlease explain this in more detail.`;
    return this._chat(PROMPTS.cardExplainer, userMessage);
  }

  /**
   * @param {string} systemPrompt
   * @param {string} userMessage
   * @returns {Promise<string>}
   * @private
   */
  async _chat(systemPrompt, userMessage) {
    const response = await this._client.chat.completions.create({
      model: config.openai.model,
      temperature: config.openai.temperature,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    return response.choices[0].message.content.trim();
  }
}

module.exports = new AIService();
