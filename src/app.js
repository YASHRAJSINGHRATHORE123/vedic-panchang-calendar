import { getUserLocation } from './utils/locationUtils.js';
import { CalendarUI } from './ui/calendarUI.js';
import { PanchangUI } from './ui/panchangUI.js';
import { AIUI } from './ui/aiUI.js';
import { HoroscopeUI } from './ui/horoscopeUI.js';
import { PdfUI } from './ui/pdfUI.js';
import { initI18n, setLanguage, getLanguage } from './utils/i18n.js';
import gsap from 'gsap';

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
    
    // Animate Panchang details on date change
    gsap.fromTo("#panchang-container > div", 
      { opacity: 0, y: 10 }, 
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, location);
  
  // Initialize i18n
  await initI18n(() => {
    updateLangToggleUI();
    // Re-render UI components with new language
    const today = new Date();
    calendarUI.render();
    panchangUI.update(today, location);
    horoscopeUI.render();
  });
  
  // Language toggle
  const langEnBtn = document.getElementById('lang-en');
  const langHiBtn = document.getElementById('lang-hi');
  
  function updateLangToggleUI() {
    const lang = getLanguage();
    if (lang === 'en') {
      langEnBtn.classList.add('font-bold', 'text-amber-600', 'dark:text-amber-400');
      langHiBtn.classList.remove('font-bold', 'text-amber-600', 'dark:text-amber-400');
    } else {
      langHiBtn.classList.add('font-bold', 'text-amber-600', 'dark:text-amber-400');
      langEnBtn.classList.remove('font-bold', 'text-amber-600', 'dark:text-amber-400');
    }
  }
  
  document.getElementById('lang-toggle').addEventListener('click', () => {
    const newLang = getLanguage() === 'en' ? 'hi' : 'en';
    setLanguage(newLang, () => {
      updateLangToggleUI();
      // Re-render components
      calendarUI.render();
      panchangUI.update(calendarUI.selectedDate, location);
      horoscopeUI.render();
    });
  });
  
  // Initial update for today
  const today = new Date();
  panchangUI.update(today, location);
  aiUI.updateContext(today, location);
  horoscopeUI.update(today);
  
  // Initial Page Load Animations
  gsap.from("nav", { y: -50, opacity: 0, duration: 0.6, ease: "power3.out" });
  gsap.from(".lg\\:col-span-2", { x: -30, opacity: 0, duration: 0.6, delay: 0.2, ease: "power3.out" });
  gsap.from(".lg\\:col-span-1", { x: 30, opacity: 0, duration: 0.6, delay: 0.3, ease: "power3.out" });
  gsap.from(".lg\\:col-span-3", { y: 30, opacity: 0, duration: 0.6, delay: 0.4, ease: "power3.out", stagger: 0.1 });
  
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
