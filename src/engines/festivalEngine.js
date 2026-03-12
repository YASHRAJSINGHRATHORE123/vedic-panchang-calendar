/**
 * Detects major Hindu festivals based on Panchang data.
 * Note: Real festival detection requires complex rules involving sunrise tithi, 
 * moonrise, etc. This is a simplified logic for demonstration.
 * 
 * @param {Object} panchangData 
 * @param {Date} date 
 * @returns {string|null} Festival name or null
 */
export function detectFestival(panchangData, date) {
  const tithi = panchangData.tithi.index; // 0-29
  const month = date.getMonth(); // 0-11 (Gregorian month as rough proxy for lunar month in simplified logic)
  
  // Simplified mapping (In reality, lunar months drift against Gregorian)
  // We use a rough approximation for demonstration purposes.
  // 14 = Purnima (Full Moon), 29 = Amavasya (New Moon)
  
  // Diwali: Amavasya of Kartika (roughly Oct/Nov)
  if (tithi === 29 && (month === 9 || month === 10)) {
    return "Diwali";
  }
  
  // Holi: Purnima of Phalguna (roughly Feb/Mar)
  if (tithi === 14 && (month === 1 || month === 2)) {
    return "Holi";
  }
  
  // Raksha Bandhan: Purnima of Shravana (roughly Aug)
  if (tithi === 14 && (month === 7)) {
    return "Raksha Bandhan";
  }
  
  // Maha Shivratri: Chaturdashi (Krishna Paksha) of Phalguna (roughly Feb/Mar)
  if (tithi === 28 && (month === 1 || month === 2)) {
    return "Maha Shivratri";
  }
  
  // Janmashtami: Ashtami (Krishna Paksha) of Bhadrapada (roughly Aug/Sep)
  if (tithi === 22 && (month === 7 || month === 8)) {
    return "Janmashtami";
  }
  
  // Ram Navami: Navami (Shukla Paksha) of Chaitra (roughly Mar/Apr)
  if (tithi === 8 && (month === 2 || month === 3)) {
    return "Ram Navami";
  }
  
  // Navratri (Start): Pratipada (Shukla Paksha) of Ashvina (roughly Sep/Oct)
  if (tithi === 0 && (month === 8 || month === 9)) {
    return "Navratri Begins";
  }

  return null;
}

/**
 * Find auspicious Muhurat based on Panchang
 * @param {Object} panchangData 
 * @returns {Array} List of auspicious activities
 */
export function getAuspiciousActivities(panchangData) {
  const activities = [];
  const { tithi, nakshatra, yoga } = panchangData;
  
  // Avoid Rikta Tithis (4, 9, 14 in both pakshas)
  const isRikta = [3, 8, 13, 18, 23, 28].includes(tithi.index);
  
  // Avoid bad yogas
  const badYogas = ["Vyatipata", "Vaidhriti", "Parigha", "Shula", "Ganda", "Atiganda"];
  const isBadYoga = badYogas.includes(yoga.name);
  
  if (isRikta || isBadYoga) {
    return ["Not highly auspicious for major new beginnings."];
  }
  
  // Marriage: Rohini, Mrigashirsha, Magha, Uttara Phalguni, Hasta, Swati, Anuradha, Mula, Uttara Ashadha, Uttara Bhadrapada, Revati
  const marriageNakshatras = [3, 4, 9, 11, 12, 14, 16, 18, 20, 25, 26];
  if (marriageNakshatras.includes(nakshatra.index)) {
    activities.push("Marriage (Vivaha)");
  }
  
  // Travel: Ashwini, Punarvasu, Pushya, Hasta, Anuradha, Shravana, Dhanishta, Revati
  const travelNakshatras = [0, 6, 7, 12, 16, 21, 22, 26];
  if (travelNakshatras.includes(nakshatra.index)) {
    activities.push("Travel (Yatra)");
  }
  
  // Business: Ashwini, Pushya, Chitra, Swati, Anuradha, Revati
  const businessNakshatras = [0, 7, 13, 14, 16, 26];
  if (businessNakshatras.includes(nakshatra.index)) {
    activities.push("Business Opening");
  }
  
  // Education: Ashwini, Punarvasu, Pushya, Hasta, Chitra, Swati, Shravana, Revati
  const educationNakshatras = [0, 6, 7, 12, 13, 14, 21, 26];
  if (educationNakshatras.includes(nakshatra.index)) {
    activities.push("Education (Vidyarambha)");
  }
  
  if (activities.length === 0) {
    activities.push("Routine activities");
  }
  
  return activities;
}
