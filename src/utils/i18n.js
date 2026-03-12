let currentLang = localStorage.getItem('app-lang') || 'en';
let translations = {};

export async function initI18n(callback) {
  await loadTranslations(currentLang);
  updateUI();
  if (callback) callback();
}

export async function loadTranslations(lang) {
  try {
    const response = await fetch(`/src/lang/${lang}.json`);
    translations = await response.json();
    currentLang = lang;
    localStorage.setItem('app-lang', lang);
    document.documentElement.lang = lang;
  } catch (error) {
    console.error('Failed to load translations', error);
  }
}

export async function setLanguage(lang, callback) {
  if (lang !== currentLang) {
    await loadTranslations(lang);
    updateUI();
    if (callback) callback();
  }
}

export function getLanguage() {
  return currentLang;
}

export function t(key) {
  return translations[key] || key;
}

export function updateUI() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) {
      if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
        el.placeholder = translations[key];
      } else {
        el.innerHTML = translations[key];
      }
    }
  });
}
