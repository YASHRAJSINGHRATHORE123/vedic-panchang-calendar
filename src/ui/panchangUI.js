import { calculatePanchang } from '../engines/panchangEngine.js';
import { detectFestival } from '../engines/festivalEngine.js';
import { getAuspiciousActivities } from '../engines/muhuratEngine.js';
import { formatTime, formatDate } from '../utils/dateUtils.js';
import { t } from '../utils/i18n.js';

export class PanchangUI {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }
  
  update(date, location) {
    if (!this.container) return;
    const panchang = calculatePanchang(date, location.latitude, location.longitude);
    const festivals = detectFestival(panchang, date);
    const muhurats = getAuspiciousActivities(panchang);
    
    let festivalHtml = '';
    if (festivals && festivals.length > 0) {
      festivalHtml = `
        <div class="mb-6 p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white shadow-lg transform transition hover:scale-[1.02]">
          <h3 class="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">${t('festival')}</h3>
          <p class="text-xl font-bold">${festivals.map(f => t(f)).join(', ')}</p>
        </div>
      `;
    }
    
    let muhuratHtml = '';
    if (muhurats.warnings.length > 0) {
      muhuratHtml += `<div class="mb-3 p-3 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-lg text-sm">${muhurats.warnings.map(w => t(w)).join('<br>')}</div>`;
    }
    
    const goodFor = [];
    if (muhurats.marriage) goodFor.push(t("marriage"));
    if (muhurats.business) goodFor.push(t("business"));
    if (muhurats.travel) goodFor.push(t("travel"));
    if (muhurats.education) goodFor.push(t("education"));
    
    if (goodFor.length > 0) {
      muhuratHtml += `<div class="flex flex-wrap gap-2">
        ${goodFor.map(m => `<span class="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full text-sm font-medium">${m}</span>`).join('')}
      </div>`;
    } else if (muhurats.warnings.length === 0) {
      muhuratHtml += `<span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-full text-sm">${t('none')}</span>`;
    }
    
    this.container.innerHTML = `
      <div class="panchang-details animate-fade-in">
        <h2 class="text-2xl font-bold mb-2 dark:text-white">${formatDate(date)}</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          ${location.city}
        </p>
        
        ${festivalHtml}
        
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">${t('tithi')}</p>
            <p class="font-semibold text-lg dark:text-gray-200">${t(panchang.tithi.name)}</p>
            <p class="text-sm text-amber-600 dark:text-amber-400">${t(panchang.tithi.paksha)}</p>
            ${panchang.tithi.endTime ? `<p class="text-xs text-gray-400 mt-1">${t('ends')} ${formatTime(panchang.tithi.endTime)}</p>` : ''}
          </div>
          
          <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">${t('nakshatra')}</p>
            <p class="font-semibold text-lg dark:text-gray-200">${t(panchang.nakshatra.name)}</p>
          </div>
          
          <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">${t('yoga')}</p>
            <p class="font-semibold text-lg dark:text-gray-200">${t(panchang.yoga.name)}</p>
          </div>
          
          <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">${t('karana')}</p>
            <p class="font-semibold text-lg dark:text-gray-200">${t(panchang.karana.name)}</p>
          </div>
        </div>
        
        <h3 class="text-lg font-bold mb-3 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">${t('timings')}</h3>
        <div class="space-y-3 mb-6">
          <div class="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span class="text-blue-800 dark:text-blue-300 font-medium">${t('sunrise')}</span>
            <span class="dark:text-gray-300">${formatTime(panchang.sunrise)}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <span class="text-indigo-800 dark:text-indigo-300 font-medium">${t('sunset')}</span>
            <span class="dark:text-gray-300">${formatTime(panchang.sunset)}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
            <span class="text-red-800 dark:text-red-300 font-medium">${t('rahu_kaal')}</span>
            <span class="text-sm dark:text-gray-300">${panchang.rahuKaal.start ? formatTime(panchang.rahuKaal.start) + ' - ' + formatTime(panchang.rahuKaal.end) : 'N/A'}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500">
            <span class="text-emerald-800 dark:text-emerald-300 font-medium">${t('abhijit_muhurat')}</span>
            <span class="text-sm dark:text-gray-300">${panchang.abhijitMuhurat.start ? formatTime(panchang.abhijitMuhurat.start) + ' - ' + formatTime(panchang.abhijitMuhurat.end) : 'N/A'}</span>
          </div>
        </div>
        
        <h3 class="text-lg font-bold mb-3 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">${t('auspicious_for')}</h3>
        ${muhuratHtml}
      </div>
    `;
  }
}
