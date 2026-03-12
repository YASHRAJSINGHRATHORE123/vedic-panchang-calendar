/**
 * Find auspicious Muhurat based on Panchang
 * @param {Object} panchangData 
 * @returns {Array} List of auspicious activities
 */
export function getAuspiciousActivities(panchangData) {
  const { tithi, nakshatra, yoga } = panchangData;
  const isRikta = [3, 8, 13, 18, 23, 28].includes(tithi.index);
  const isBadYoga = ["Vyatipata", "Vaidhriti", "Parigha", "Shula", "Ganda", "Atiganda"].includes(yoga.name);
  
  const recommendations = {
    marriage: false,
    business: false,
    travel: false,
    education: false,
    warnings: []
  };

  if (isRikta) recommendations.warnings.push("Rikta Tithi: Avoid major new beginnings.");
  if (isBadYoga) recommendations.warnings.push("Inauspicious Yoga active.");

  if (!isRikta && !isBadYoga) {
    if ([3, 4, 9, 11, 12, 14, 16, 18, 20, 25, 26].includes(nakshatra.index)) recommendations.marriage = true;
    if ([0, 7, 13, 14, 16, 26].includes(nakshatra.index)) recommendations.business = true;
    if ([0, 6, 7, 12, 16, 21, 22, 26].includes(nakshatra.index)) recommendations.travel = true;
    if ([0, 6, 7, 12, 13, 14, 21, 26].includes(nakshatra.index)) recommendations.education = true;
  }

  return recommendations;
}
