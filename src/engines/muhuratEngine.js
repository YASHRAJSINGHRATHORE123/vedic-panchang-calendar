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
