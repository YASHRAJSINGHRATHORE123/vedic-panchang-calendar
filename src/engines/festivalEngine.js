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
  
  // Diwali: Amavasya (29) of Kartika (Sun in Libra - 6)
  if (tithi === 29 && sunRashi === 6) {
    return "Diwali";
  }
  
  // Holi: Purnima (14) of Phalguna (Sun in Aquarius - 10)
  if (tithi === 14 && sunRashi === 10) {
    return "Holi";
  }
  
  // Raksha Bandhan: Purnima (14) of Shravana (Sun in Cancer - 3)
  if (tithi === 14 && sunRashi === 3) {
    return "Raksha Bandhan";
  }
  
  // Maha Shivratri: Chaturdashi (28) of Phalguna (Sun in Capricorn/Aquarius - 9/10)
  if (tithi === 28 && (sunRashi === 9 || sunRashi === 10)) {
    return "Maha Shivratri";
  }
  
  // Janmashtami: Ashtami (22) of Bhadrapada (Sun in Cancer/Leo - 3/4)
  if (tithi === 22 && (sunRashi === 3 || sunRashi === 4)) {
    return "Janmashtami";
  }
  
  // Ram Navami: Navami (8) of Chaitra (Sun in Pisces/Aries - 11/0)
  if (tithi === 8 && (sunRashi === 11 || sunRashi === 0)) {
    return "Ram Navami";
  }
  
  // Navratri (Chaitra): Pratipada (0) of Chaitra (Sun in Pisces/Aries - 11/0)
  if (tithi === 0 && (sunRashi === 11 || sunRashi === 0)) {
    return "Chaitra Navratri Begins";
  }

  // Navratri (Sharad): Pratipada (0) of Ashvina (Sun in Virgo/Libra - 5/6)
  if (tithi === 0 && (sunRashi === 5 || sunRashi === 6)) {
    return "Sharad Navratri Begins";
  }

  return null;
}
