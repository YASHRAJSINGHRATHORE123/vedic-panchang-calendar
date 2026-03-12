import { getLanguage } from './i18n.js';

/**
 * Formats a Date object to a readable time string.
 * @param {Date} date 
 * @returns {string}
 */
export function formatTime(date) {
  if (!date || isNaN(date.getTime())) return "--:--";
  const lang = getLanguage() === 'hi' ? 'hi-IN' : 'en-US';
  return date.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
}

/**
 * Formats a Date object to a readable date string.
 * @param {Date} date 
 * @returns {string}
 */
export function formatDate(date) {
  if (!date || isNaN(date.getTime())) return "--";
  const lang = getLanguage() === 'hi' ? 'hi-IN' : 'en-US';
  return date.toLocaleDateString(lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Get days in a month
 * @param {number} year 
 * @param {number} month (0-11)
 * @returns {number}
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get first day of the month
 * @param {number} year 
 * @param {number} month (0-11)
 * @returns {number} (0-6, 0 is Sunday)
 */
export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
