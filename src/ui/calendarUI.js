import { getDaysInMonth, getFirstDayOfMonth } from '../utils/dateUtils.js';
import { calculatePanchang } from '../engines/panchangEngine.js';
import { detectFestival } from '../engines/festivalEngine.js';
import { t } from '../utils/i18n.js';
import gsap from 'gsap';

export class CalendarUI {
  constructor(containerId, onDateSelect, location) {
    this.container = document.getElementById(containerId);
    this.onDateSelect = onDateSelect;
    this.location = location;
    
    this.currentDate = new Date();
    this.selectedDate = new Date();
    
    if (this.container) {
      this.render();
    }
  }
  
  setLocation(location) {
    this.location = location;
    if (this.container) {
      this.renderGrid();
    }
  }
  
  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.render();
    gsap.from("#calendar-days > div", { opacity: 0, x: -20, duration: 0.3, stagger: 0.01, ease: "power2.out" });
  }
  
  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.render();
    gsap.from("#calendar-days > div", { opacity: 0, x: 20, duration: 0.3, stagger: 0.01, ease: "power2.out" });
  }
  
  selectDate(day) {
    this.selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    this.renderGrid();
    if (this.onDateSelect) {
      this.onDateSelect(this.selectedDate);
    }
  }
  
  render() {
    const months = t('months');
    const daysShort = t('days_short');
    
    this.container.innerHTML = `
      <div class="calendar-header flex justify-between items-center mb-4">
        <button id="prev-month" class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          &larr; ${t('prev')}
        </button>
        <h2 class="text-xl font-bold dark:text-white">
          ${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}
        </h2>
        <button id="next-month" class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          ${t('next')} &rarr;
        </button>
      </div>
      <div class="calendar-grid grid grid-cols-7 gap-1 text-center mb-2">
        ${daysShort.map(day => `<div class="font-semibold text-gray-500 text-sm py-2">${day}</div>`).join('')}
      </div>
      <div id="calendar-days" class="grid grid-cols-7 gap-1 text-center"></div>
    `;
    
    document.getElementById('prev-month').addEventListener('click', () => this.prevMonth());
    document.getElementById('next-month').addEventListener('click', () => this.nextMonth());
    
    this.renderGrid();
  }
  
  renderGrid() {
    const daysContainer = document.getElementById('calendar-days');
    if (!daysContainer) return;
    
    daysContainer.innerHTML = '';
    
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const today = new Date();
    
    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      const cell = document.createElement('div');
      cell.className = 'p-2 opacity-0';
      daysContainer.appendChild(cell);
    }
    
    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const cell = document.createElement('div');
      
      const isToday = date.getDate() === today.getDate() && 
                      date.getMonth() === today.getMonth() && 
                      date.getFullYear() === today.getFullYear();
                      
      const isSelected = date.getDate() === this.selectedDate.getDate() && 
                         date.getMonth() === this.selectedDate.getMonth() && 
                         date.getFullYear() === this.selectedDate.getFullYear();
      
      // Calculate basic panchang to check for festivals
      const panchang = calculatePanchang(date, this.location.latitude, this.location.longitude);
      const festivals = detectFestival(panchang, date);
      
      let classes = 'p-2 rounded-lg cursor-pointer transition relative min-h-[60px] flex flex-col items-center justify-center border border-transparent ';
      
      if (isSelected) {
        classes += 'bg-amber-500 text-white shadow-md font-bold ';
      } else if (isToday) {
        classes += 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-bold border-amber-300 dark:border-amber-700 ';
      } else {
        classes += 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200 ';
      }
      
      cell.className = classes;
      
      let innerHTML = `<span>${day}</span>`;
      
      if (festivals && festivals.length > 0) {
        innerHTML += `<span class="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-red-500"></span>`;
        if (isSelected) {
           innerHTML += `<span class="text-[10px] leading-tight mt-1 truncate w-full px-1">${t(festivals[0])}</span>`;
        }
      }
      
      cell.innerHTML = innerHTML;
      cell.addEventListener('click', () => this.selectDate(day));
      
      daysContainer.appendChild(cell);
    }
  }
}
