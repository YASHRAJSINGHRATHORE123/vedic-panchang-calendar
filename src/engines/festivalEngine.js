import { getJulianDay, getSunLongitude, getMoonLongitude } from './astronomyEngine.js';

// Helper to get Tithi at a specific hour (local time)
function getTithiAtTime(date, hours, minutes) {
  const calcDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, 0);
  const jd = getJulianDay(calcDate);
  let sunLong = getSunLongitude(jd);
  let moonLong = getMoonLongitude(jd);
  let diff = moonLong - sunLong;
  if (diff < 0) diff += 360.0;
  return Math.floor(diff / 12.0);
}

/**
 * Detects major Hindu festivals based on Panchang data.
 * Improved logic using Sun Rashi and Tithi for better accuracy.
 * 
 * @param {Object} panchangData 
 * @param {Date} date 
 * @returns {string|null} Festival name or null
 */
export function detectFestival(panchangData, date) {
  const tithi = panchangData.tithi.index; // 0-29
  const sunRashi = panchangData.sunRashi.index; // 0-11
  const events = [];

  // Core Lunar Events
  if (tithi === 10 || tithi === 25) events.push("Ekadashi");
  if (tithi === 14) events.push("Purnima (Full Moon)");
  if (tithi === 29) events.push("Amavasya (New Moon)");
  
  // Diwali: Amavasya (29) active during Pradosh (evening, approx 18:00)
  const eveningTithi = getTithiAtTime(date, 18, 0);
  if (eveningTithi === 29 && sunRashi === 6) {
    events.push("Diwali");
  }
  
  // Holi: Purnima (14) active at evening (18:00)
  if (eveningTithi === 14 && sunRashi === 10) {
    events.push("Holi");
  }
  
  // Maha Shivratri: Chaturdashi (28) active at midnight (23:59)
  const midnightTithi = getTithiAtTime(date, 23, 59);
  if (midnightTithi === 28 && (sunRashi === 9 || sunRashi === 10)) {
    events.push("Maha Shivratri");
  }
  
  // Janmashtami: Ashtami (22) active at midnight (23:59)
  if (midnightTithi === 22 && (sunRashi === 3 || sunRashi === 4)) {
    events.push("Janmashtami");
  }
  
  // Raksha Bandhan: Purnima (14) of Shravana (Sun in Cancer - 3)
  if (tithi === 14 && sunRashi === 3) {
    events.push("Raksha Bandhan");
  }
  
  // Ram Navami: Navami (8) of Chaitra (Sun in Pisces/Aries - 11/0)
  if (tithi === 8 && (sunRashi === 11 || sunRashi === 0)) {
    events.push("Ram Navami");
  }
  
  // Navratri (Chaitra): Pratipada (0) of Chaitra (Sun in Pisces/Aries - 11/0)
  if (tithi === 0 && (sunRashi === 11 || sunRashi === 0)) {
    events.push("Chaitra Navratri Begins");
  }

  // Navratri (Sharad): Pratipada (0) of Ashvina (Sun in Virgo/Libra - 5/6)
  if (tithi === 0 && (sunRashi === 5 || sunRashi === 6)) {
    events.push("Sharad Navratri Begins");
  }

  return events.length > 0 ? events : null;
}
