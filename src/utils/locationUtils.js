import { CONFIG } from '../data/config.js';

export async function getUserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(CONFIG.defaultLocation);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        try {
          // Reverse geocoding using a free API (OpenStreetMap Nominatim)
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.state || "Unknown Location";
          
          resolve({
            latitude: lat,
            longitude: lon,
            city: city
          });
        } catch (e) {
          resolve({
            latitude: lat,
            longitude: lon,
            city: `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`
          });
        }
      },
      () => {
        resolve(CONFIG.defaultLocation);
      },
      { timeout: 5000 }
    );
  });
}
