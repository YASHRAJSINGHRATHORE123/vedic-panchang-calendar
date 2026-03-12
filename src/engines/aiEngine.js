import { GoogleGenAI } from '@google/genai';
import { CONFIG } from '../data/config.js';
import { getLanguage, t } from '../utils/i18n.js';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: CONFIG.apiKeys.gemini });

export async function askAIAssistant(question, panchangData, date, location) {
  const lang = getLanguage() === 'hi' ? 'Hindi' : 'English';
  const systemInstruction = `You are a Vedic astrology and Panchang expert assistant.
You are helping a user with their questions based on today's Panchang data.
Current Date: ${date.toDateString()}
Location: ${location.city}
Panchang Data: ${JSON.stringify(panchangData)}

Answer the user's question concisely and accurately based on the provided Panchang data.
If they ask about festivals, refer to the data. If they ask about Muhurat (auspicious times), refer to the data.
IMPORTANT: You MUST respond in ${lang}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return t('ai_error');
  }
}
