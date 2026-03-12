import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const horoscopeCache = new Map();

export async function getDailyHoroscope(rashiName, date) {
  const cacheKey = `${rashiName}_${date.toDateString()}`;
  if (horoscopeCache.has(cacheKey)) {
    return horoscopeCache.get(cacheKey);
  }

  const systemInstruction = `You are a Vedic astrologer. Provide a short (2-3 sentences) daily horoscope for the zodiac sign ${rashiName} for the date ${date.toDateString()}. Focus on general well-being, career, or relationships. Be positive and concise.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-preview",
      contents: `What is the horoscope for ${rashiName} today?`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });
    const result = response.text;
    horoscopeCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Horoscope AI Error:", error);
    return "Horoscope currently unavailable. Please try again later.";
  }
}
