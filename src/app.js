import { getUserLocation } from './utils/locationUtils.js';
import { CalendarUI } from './ui/calendarUI.js';
import { PanchangUI } from './ui/panchangUI.js';
import { AIUI } from './ui/aiUI.js';
import { HoroscopeUI } from './ui/horoscopeUI.js';
import { PdfUI } from './ui/pdfUI.js';

const initApp = async () => {
  // Initialize UI components
  const panchangUI = new PanchangUI('panchang-container');
  const aiUI = new AIUI('chat-history', 'chat-input', 'chat-submit');
  const horoscopeUI = new HoroscopeUI('horoscope-container');
  
  // Get user location
  const location = await getUserLocation();
  
  // Initialize PDF UI
  const pdfUI = new PdfUI('generate-pdf-btn', location);
  
  // Initialize Calendar
  const calendarUI = new CalendarUI('calendar-container', (date) => {
    panchangUI.update(date, location);
    aiUI.updateContext(date, location);
    horoscopeUI.update(date);
  }, location);
  
  // Initial update for today
  const today = new Date();
  panchangUI.update(today, location);
  aiUI.updateContext(today, location);
  horoscopeUI.update(today);
  
  // Dark mode toggle
  const themeToggle = document.getElementById('theme-toggle');
  
  // Check preferences
  if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      }
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Register Service Worker for PWA (outside async to avoid missing 'load' event)
if ('serviceWorker' in navigator) {
  const registerSW = () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  };
  
  if (document.readyState === 'complete') {
    registerSW();
  } else {
    window.addEventListener('load', registerSW);
  }
}
