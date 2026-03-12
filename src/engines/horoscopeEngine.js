import { GoogleGenAI } from '@google/genai';
import { CONFIG } from '../data/config.js';
import { getLanguage, t } from '../utils/i18n.js';

const ai = new GoogleGenAI({ apiKey: CONFIG.apiKeys.gemini });

class BoundedCache {
  constructor(limit = 50) {
    this.cache = new Map();
    this.limit = limit;
  }
  get(key) { return this.cache.get(key); }
  has(key) { return this.cache.has(key); }
  set(key, value) {
    if (this.cache.size >= this.limit) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}

const horoscopeCache = new BoundedCache(50);

export async function getDailyHoroscope(rashiName, date) {
  const lang = getLanguage() === 'hi' ? 'Hindi' : 'English';
  const cacheKey = `${rashiName}_${date.toDateString()}_${lang}`;
  if (horoscopeCache.has(cacheKey)) {
    return horoscopeCache.get(cacheKey);
  }

  const systemInstruction = `You are a Vedic astrologer. Provide a short (2-3 sentences) daily horoscope for the zodiac sign ${rashiName} for the date ${date.toDateString()}. Focus on general well-being, career, or relationships. Be positive and concise.
IMPORTANT: You MUST respond in ${lang}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
    return t('ai_error');
  }
}
