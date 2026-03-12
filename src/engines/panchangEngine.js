import { getJulianDay, getSunLongitude, getMoonLongitude, getSunriseSunset } from './astronomyEngine.js';
import { CONFIG } from '../data/config.js';

const panchangCache = new Map();

/**
 * Calculate Panchang elements for a given date and location
 * @param {Date} date 
 * @param {number} lat 
 * @param {number} lon 
 */
export function calculatePanchang(date, lat, lon) {
  // We calculate at noon local time for general daily panchang
  const calcDate = new Date(date);
  calcDate.setHours(12, 0, 0, 0);
  
  const cacheKey = `${calcDate.getTime()}_${lat}_${lon}`;
  if (panchangCache.has(cacheKey)) {
    return panchangCache.get(cacheKey);
  }
  
  const jd = getJulianDay(calcDate);
  const sunLong = getSunLongitude(jd);
  const moonLong = getMoonLongitude(jd);
  
  // 1. Tithi (Lunar Day)
  // Difference between Moon and Sun longitude. Each Tithi is 12 degrees.
  let diff = moonLong - sunLong;
  if (diff < 0) diff += 360.0;
  const tithiIndex = Math.floor(diff / 12.0);
  const tithiName = CONFIG.tithiNames[tithiIndex];
  const paksha = tithiIndex < 15 ? "Shukla Paksha" : "Krishna Paksha";
  
  // 2. Nakshatra (Lunar Mansion)
  // Moon longitude divided by 13 degrees 20 minutes (13.3333 degrees)
  const nakshatraIndex = Math.floor(moonLong / (360.0 / 27.0));
  const nakshatraName = CONFIG.nakshatraNames[nakshatraIndex];
  
  // 3. Yoga
  // Sum of Sun and Moon longitude divided by 13 degrees 20 minutes
  let sum = sunLong + moonLong;
  if (sum >= 360.0) sum -= 360.0;
  const yogaIndex = Math.floor(sum / (360.0 / 27.0));
  const yogaName = CONFIG.yogaNames[yogaIndex];
  
  // 4. Karana
  // Half of a Tithi (6 degrees)
  const karanaIndex = Math.floor(diff / 6.0);
  let kName = "";
  if (karanaIndex === 0) kName = "Kintughna";
  else if (karanaIndex >= 57) {
    const endKaranas = ["Shakuni", "Chatushpada", "Naga"];
    kName = endKaranas[karanaIndex - 57];
  } else {
    kName = CONFIG.karanaNames[(karanaIndex - 1) % 7];
  }
  
  // 5. Sunrise & Sunset
  const { sunrise, sunset } = getSunriseSunset(date, lat, lon);
  
  // 6. Rahu Kaal
  // Depends on weekday and sunrise/sunset
  let rahuKaalStart = null;
  let rahuKaalEnd = null;
  
  if (sunrise && sunset) {
    const dayDuration = sunset.getTime() - sunrise.getTime();
    const partDuration = dayDuration / 8;
    const weekday = date.getDay(); // 0 = Sunday
    
    // Rahu Kaal parts (1-indexed): Sun:8, Mon:2, Tue:7, Wed:5, Thu:6, Fri:4, Sat:3
    const rahuParts = [8, 2, 7, 5, 6, 4, 3];
    const part = rahuParts[weekday] - 1;
    
    rahuKaalStart = new Date(sunrise.getTime() + part * partDuration);
    rahuKaalEnd = new Date(rahuKaalStart.getTime() + partDuration);
  }
  
  // 7. Abhijit Muhurat
  // 8th muhurat of the day (middle of the day)
  let abhijitStart = null;
  let abhijitEnd = null;
  
  if (sunrise && sunset) {
    const dayDuration = sunset.getTime() - sunrise.getTime();
    const muhuratDuration = dayDuration / 15;
    abhijitStart = new Date(sunrise.getTime() + 7 * muhuratDuration);
    abhijitEnd = new Date(abhijitStart.getTime() + muhuratDuration);
  }

  const result = {
    tithi: { index: tithiIndex, name: tithiName, paksha: paksha },
    nakshatra: { index: nakshatraIndex, name: nakshatraName },
    yoga: { index: yogaIndex, name: yogaName },
    karana: { index: karanaIndex, name: kName },
    sunrise,
    sunset,
    rahuKaal: { start: rahuKaalStart, end: rahuKaalEnd },
    abhijitMuhurat: { start: abhijitStart, end: abhijitEnd }
  };
  
  panchangCache.set(cacheKey, result);
  return result;
}
