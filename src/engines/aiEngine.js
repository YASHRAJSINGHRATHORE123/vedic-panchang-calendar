import { GoogleGenAI } from '@google/genai';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askAIAssistant(question, panchangData, date, location) {
  const systemInstruction = `You are a Vedic astrology and Panchang expert assistant.
You are helping a user with their questions based on today's Panchang data.
Current Date: ${date.toDateString()}
Location: ${location.city}
Panchang Data: ${JSON.stringify(panchangData)}

Answer the user's question concisely and accurately based on the provided Panchang data.
If they ask about festivals, refer to the data. If they ask about Muhurat (auspicious times), refer to the data.`;

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
    return "Sorry, I couldn't process your request right now. Please try again later.";
  }
}
