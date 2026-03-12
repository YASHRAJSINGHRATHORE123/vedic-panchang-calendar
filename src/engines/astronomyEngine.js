/**
 * Astronomy Engine for simplified calculations of Sun and Moon positions.
 * Improved for better accuracy.
 */

const D2R = Math.PI / 180.0;
const R2D = 180.0 / Math.PI;

/**
 * Calculate Julian Day from Date
 * @param {Date} date 
 * @returns {number} Julian Day
 */
export function getJulianDay(date) {
  // Convert to UTC to avoid local timezone issues during JD calculation
  const time = date.getTime();
  return (time / 86400000.0) + 2440587.5;
}

/**
 * Calculate Lahiri Ayanamsa approximation
 * @param {number} jd Julian Day
 * @returns {number} Ayanamsa in degrees
 */
export function getAyanamsa(jd) {
  return 23.85 + (jd - 2451545.0) * (50.290966 / 3600.0);
}

/**
 * Calculate Sun's geocentric ecliptic longitude
 * @param {number} jd Julian Day
 * @returns {number} Longitude in degrees (0-360)
 */
export function getSunLongitude(jd) {
  const d = jd - 2451545.0;
  const g = (357.529 + 0.98560028 * d) % 360.0;
  const q = (280.459 + 0.98564736 * d) % 360.0;
  const l = q + 1.915 * Math.sin(g * D2R) + 0.020 * Math.sin(2 * g * D2R);
  return (l + 360.0) % 360.0;
}

/**
 * Calculate Moon's geocentric ecliptic longitude
 * @param {number} jd Julian Day
 * @returns {number} Longitude in degrees (0-360)
 */
export function getMoonLongitude(jd) {
  const d = jd - 2451545.0;
  const l = (218.316 + 13.176396 * d) % 360.0;
  const m = (134.963 + 13.064993 * d) % 360.0;
  const f = (93.272 + 13.229350 * d) % 360.0;
  
  const longitude = l + 6.289 * Math.sin(m * D2R) 
                    - 1.274 * Math.sin((l - 2 * d) * D2R) 
                    + 0.658 * Math.sin(2 * d * D2R) 
                    + 0.214 * Math.sin(2 * m * D2R) 
                    - 0.186 * Math.sin(f * D2R)
                    - 0.114 * Math.sin(2 * f * D2R);
                    
  return (longitude + 360.0) % 360.0;
}

/**
 * Calculate Sunrise and Sunset times
 * @param {Date} date 
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 * @returns {Object} { sunrise: Date, sunset: Date }
 */
export function getSunriseSunset(date, lat, lon) {
  // Calculate at 12:00 UTC for the given date to find transit
  const calcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0));
  const jd = getJulianDay(calcDate);
  const d = jd - 2451545.0 + 0.0008;
  
  // Mean solar noon
  const n = Math.floor(d + lon / 360.0 + 0.5);
  const jStar = 2451545.0 - 0.0008 - lon / 360.0 + n;
  
  const m = (357.5291 + 0.98560028 * (jStar - 2451545.0)) % 360.0;
  const c = 1.9148 * Math.sin(m * D2R) + 0.0200 * Math.sin(2 * m * D2R) + 0.0003 * Math.sin(3 * m * D2R);
  const lambda = (m + c + 180.0 + 102.9372) % 360.0;
  
  const jTransit = jStar + 0.0053 * Math.sin(m * D2R) - 0.0069 * Math.sin(2 * lambda * D2R);
  const delta = Math.asin(Math.sin(lambda * D2R) * Math.sin(23.439 * D2R)) * R2D;
  
  const cosOmega = (Math.sin(-0.833 * D2R) - Math.sin(lat * D2R) * Math.sin(delta * D2R)) / (Math.cos(lat * D2R) * Math.cos(delta * D2R));
  
  if (cosOmega > 1 || cosOmega < -1) {
    // Sun never rises or never sets
    return { sunrise: null, sunset: null };
  }
  
  const omega = Math.acos(cosOmega) * R2D;
  const jSet = jTransit + omega / 360.0;
  const jRise = jTransit - omega / 360.0;
  
  const sunrise = new Date((jRise - 2440587.5) * 86400000.0);
  const sunset = new Date((jSet - 2440587.5) * 86400000.0);
  
  return { sunrise, sunset };
}

/**
 * Iteratively finds the exact end time of the current Tithi
 * @param {Date} baseDate - The date/time to start searching from
 * @param {number} currentTithiIndex - The Tithi index we are currently in
 * @returns {Date} The exact date and time the Tithi ends
 */
export function getTithiEndTime(baseDate, currentTithiIndex) {
  let searchTime = baseDate.getTime();
  let step = 60 * 60 * 1000; // Start with 1-hour steps
  
  // Search forward up to 30 hours
  for (let i = 0; i < 30; i++) {
    searchTime += step;
    let jd = getJulianDay(new Date(searchTime));
    let ayanamsa = getAyanamsa(jd);
    let sunLong = (getSunLongitude(jd) - ayanamsa + 360) % 360;
    let moonLong = (getMoonLongitude(jd) - ayanamsa + 360) % 360;
    
    let diff = (moonLong - sunLong + 360) % 360;
    let tithiIndex = Math.floor(diff / 12.0);
    
    if (tithiIndex !== currentTithiIndex) {
      // We overshot. Step back 1 hour, and move forward in 1-minute steps
      searchTime -= step;
      step = 60 * 1000; // 1-minute steps
      for (let j = 0; j < 60; j++) {
        searchTime += step;
        let jdMin = getJulianDay(new Date(searchTime));
        let sunMin = (getSunLongitude(jdMin) - getAyanamsa(jdMin) + 360) % 360;
        let moonMin = (getMoonLongitude(jdMin) - getAyanamsa(jdMin) + 360) % 360;
        let diffMin = (moonMin - sunMin + 360) % 360;
        
        if (Math.floor(diffMin / 12.0) !== currentTithiIndex) {
          return new Date(searchTime); // Exact minute found!
        }
      }
    }
  }
  return null; // Fallback
}
