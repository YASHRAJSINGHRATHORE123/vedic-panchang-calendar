import { getDailyHoroscope } from '../engines/horoscopeEngine.js';
import { CONFIG } from '../data/config.js';

export class HoroscopeUI {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentDate = new Date();
    if (this.container) {
      this.render();
    }
  }
  
  update(date) {
    this.currentDate = date;
    if (this.container) {
      this.render();
    }
  }
  
  render() {
    this.container.innerHTML = `
      <h3 class="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
        <span class="text-amber-500">✨</span> Daily Horoscope
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="rashi-grid">
        ${CONFIG.rashiNames.map((rashi, index) => `
          <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-amber-50 dark:hover:bg-gray-700 transition" data-rashi="${rashi}">
            <p class="font-semibold text-center dark:text-gray-200">${rashi}</p>
          </div>
        `).join('')}
      </div>
      <div id="horoscope-result" class="mt-4 hidden p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
        <h4 id="horoscope-title" class="font-bold text-amber-800 dark:text-amber-400 mb-2"></h4>
        <p id="horoscope-text" class="text-gray-700 dark:text-gray-300"></p>
      </div>
    `;
    
    const rashiCards = this.container.querySelectorAll('[data-rashi]');
    rashiCards.forEach(card => {
      card.addEventListener('click', async () => {
        const rashi = card.getAttribute('data-rashi');
        const resultDiv = document.getElementById('horoscope-result');
        const titleEl = document.getElementById('horoscope-title');
        const textEl = document.getElementById('horoscope-text');
        
        resultDiv.classList.remove('hidden');
        titleEl.textContent = `${rashi} - ${this.currentDate.toDateString()}`;
        textEl.innerHTML = '<span class="animate-pulse">Consulting the stars...</span>';
        
        const horoscope = await getDailyHoroscope(rashi, this.currentDate);
        textEl.textContent = horoscope;
      });
    });
  }
}
