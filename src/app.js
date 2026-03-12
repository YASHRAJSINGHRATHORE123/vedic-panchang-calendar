import { getUserLocation } from './utils/locationUtils.js';
import { CalendarUI } from './ui/calendarUI.js';
import { PanchangUI } from './ui/panchangUI.js';
import { AIUI } from './ui/aiUI.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize UI components
  const panchangUI = new PanchangUI('panchang-container');
  const aiUI = new AIUI('chat-history', 'chat-input', 'chat-submit');
  
  // Get user location
  const location = await getUserLocation();
  
  // Initialize Calendar
  const calendarUI = new CalendarUI('calendar-container', (date) => {
    panchangUI.update(date, location);
    aiUI.updateContext(date, location);
  }, location);
  
  // Initial update for today
  const today = new Date();
  panchangUI.update(today, location);
  aiUI.updateContext(today, location);
  
  // Dark mode toggle
  const themeToggle = document.getElementById('theme-toggle');
  
  // Check preferences
  if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  themeToggle.addEventListener('click', function() {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    }
  });

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }
});
