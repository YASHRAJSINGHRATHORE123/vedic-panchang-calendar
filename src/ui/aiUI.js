import { askAIAssistant } from '../engines/aiEngine.js';
import { calculatePanchang } from '../engines/panchangEngine.js';
import { detectFestival } from '../engines/festivalEngine.js';
import { getAuspiciousActivities } from '../engines/muhuratEngine.js';

export class AIUI {
  constructor(containerId, inputId, submitId) {
    this.historyContainer = document.getElementById(containerId);
    this.input = document.getElementById(inputId);
    this.submitBtn = document.getElementById(submitId);
    this.currentDate = new Date();
    this.location = null;
    
    if (this.submitBtn && this.input) {
      this.submitBtn.addEventListener('click', () => this.handleAsk());
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleAsk();
      });
    }
  }
  
  updateContext(date, location) {
    this.currentDate = date;
    this.location = location;
  }
  
  async handleAsk() {
    const question = this.input.value.trim();
    if (!question) return;
    
    // Add user message to UI
    this.appendMessage('user', question);
    this.input.value = '';
    this.submitBtn.disabled = true;
    this.submitBtn.innerHTML = '<span class="animate-pulse">...</span>';
    
    // Get current panchang data for context
    const panchang = calculatePanchang(this.currentDate, this.location.latitude, this.location.longitude);
    const festival = detectFestival(panchang, this.currentDate);
    const muhurats = getAuspiciousActivities(panchang);
    
    const contextData = {
      ...panchang,
      festival,
      auspiciousActivities: muhurats
    };
    
    try {
      // Ask AI
      const answer = await askAIAssistant(question, contextData, this.currentDate, this.location);
      
      // Add AI message to UI
      this.appendMessage('ai', answer);
    } catch (error) {
      console.error("AI Error:", error);
      this.appendMessage('ai', "I'm sorry, I couldn't process your request at the moment. Please try again later.");
    } finally {
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = 'Ask';
    }
  }
  
  appendMessage(role, text) {
    const div = document.createElement('div');
    if (role === 'user') {
      div.className = 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 p-3 rounded-lg max-w-[80%] ml-auto';
      div.textContent = text;
    } else {
      div.className = 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-lg max-w-[80%]';
      // Simple markdown to HTML for bold text
      div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }
    this.historyContainer.appendChild(div);
    this.historyContainer.scrollTop = this.historyContainer.scrollHeight;
  }
}
