# Panchang Smart Calendar

A modern, responsive, and location-aware Hindu calendar web application built with vanilla JavaScript, HTML, and CSS (Tailwind).

## Features

- **Smart Calendar Interface**: Monthly grid with smooth navigation and today highlight.
- **Panchang Data**: Calculates and displays Tithi, Paksha, Nakshatra, Yoga, Karana, Sunrise, Sunset, Rahu Kaal, and Abhijit Muhurat.
- **Location Based**: Uses the browser's Geolocation API to calculate accurate timings for your specific location.
- **Festival Detection**: Automatically highlights major Hindu festivals.
- **Muhurat Finder**: Suggests auspicious activities based on the day's astrological elements.
- **AI Panchang Assistant**: Ask questions about today's Panchang, festivals, and auspicious times using an integrated AI assistant powered by Gemini.
- **Modern UI**: Dark mode support, responsive design, and smooth transitions.
- **PWA Ready**: Includes a manifest and service worker for offline support and installability.
- **Performance Optimized**: Caches heavy astronomical calculations to ensure instant UI updates.

## Screenshots

*(Add screenshots of your application here)*
- **Desktop View**: `![Desktop View](link-to-image)`
- **Mobile View**: `![Mobile View](link-to-image)`
- **Dark Mode**: `![Dark Mode](link-to-image)`
- **AI Assistant**: `![AI Assistant](link-to-image)`

## Project Structure

```
panchang-smart-calendar/
├── index.html              # Main HTML entry point
├── style.css               # Custom CSS styles
├── manifest.json           # PWA manifest
├── service-worker.js       # PWA service worker for caching
├── src/
│   ├── app.js              # Main application logic and initialization
│   ├── data/
│   │   └── config.js       # Configuration constants (names of Tithis, Nakshatras, etc.)
│   ├── engines/
│   │   ├── astronomyEngine.js # Core astronomical calculations (Sun/Moon longitude)
│   │   ├── panchangEngine.js  # Derives Panchang elements from astronomical data
│   │   ├── festivalEngine.js  # Logic for detecting festivals and auspicious times
│   │   └── aiEngine.js        # AI Assistant logic using Gemini API
│   ├── ui/
│   │   ├── calendarUI.js      # Renders the interactive calendar grid
│   │   ├── panchangUI.js      # Renders the daily Panchang details panel
│   │   └── aiUI.js            # Renders the AI Assistant chat interface
│   └── utils/
│       ├── dateUtils.js       # Date formatting utilities
│       └── locationUtils.js   # Geolocation and reverse geocoding
```

## Algorithms Explained

The application uses simplified astronomical formulas to calculate planetary positions:

1.  **Julian Day**: Converts the standard Gregorian date into a continuous count of days used in astronomy.
2.  **Sun Longitude**: Calculates the geocentric ecliptic longitude of the Sun using its mean anomaly and equation of center.
3.  **Moon Longitude**: Calculates the Moon's longitude, accounting for major perturbations.
4.  **Tithi**: The lunar day is calculated by finding the difference between the Moon's and Sun's longitudes. Each Tithi spans exactly 12 degrees.
5.  **Nakshatra**: The lunar mansion is determined by dividing the Moon's longitude by 13°20' (13.333 degrees).
6.  **Yoga**: Calculated by adding the Sun's and Moon's longitudes and dividing by 13°20'.
7.  **Karana**: Half of a Tithi (6 degrees).
8.  **Sunrise/Sunset**: Uses the observer's latitude and longitude alongside the Sun's declination and equation of time to estimate local sunrise and sunset.

*Note: These formulas are simplified approximations suitable for a web application and may differ slightly from high-precision ephemeris data used by professional astrologers.*

## Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/panchang-smart-calendar.git
    cd panchang-smart-calendar
    ```
2.  **Install dependencies** (if using Vite for development):
    ```bash
    npm install
    ```
3.  **Set up Environment Variables**:
    Create a `.env` file in the root directory and add your Gemini API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```
5.  **Build for production**:
    ```bash
    npm run build
    ```

## Future Roadmap

-   [ ] **High-Precision Ephemeris**: Integrate Swiss Ephemeris or NASA JPL data for exact astrological accuracy.
-   [ ] **Choghadiya/Hora**: Add detailed daily timing charts.
-   [ ] **Kundli Generation**: Basic birth chart generation based on exact birth time and location.
-   [ ] **Multi-language Support**: Add Hindi, Sanskrit, and other regional languages.
-   [ ] **Custom Notifications**: Push notifications for specific festivals or Muhurats.
-   [ ] **Voice Assistant**: Allow users to interact with the AI assistant using voice commands.
