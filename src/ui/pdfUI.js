import { generateYearlyPanchangPDF } from '../engines/pdfEngine.js';
import { t } from '../utils/i18n.js';
import gsap from 'gsap';

export class PdfUI {
  constructor(buttonId, location) {
    this.button = document.getElementById(buttonId);
    this.location = location;
    
    if (this.button) {
      this.button.addEventListener('click', () => this.handleGenerate());
    }
  }
  
  updateLocation(location) {
    this.location = location;
  }
  
  async handleGenerate() {
    const year = new Date().getFullYear();
    const originalText = this.button.innerHTML;
    
    this.button.disabled = true;
    this.button.innerHTML = `<span class="animate-pulse">${t('generating_pdf')}</span>`;
    
    // Animate button
    gsap.to(this.button, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    
    // Allow UI to update before heavy processing
    setTimeout(async () => {
      try {
        await generateYearlyPanchangPDF(year, this.location);
        
        // Success animation
        this.button.innerHTML = `<span>${t('downloaded')}</span>`;
        gsap.fromTo(this.button, { backgroundColor: "#10b981", color: "white" }, { backgroundColor: "", color: "", duration: 2, delay: 1 });
        
        setTimeout(() => {
          this.button.innerHTML = originalText;
          this.button.disabled = false;
        }, 3000);
      } catch (error) {
        console.error("PDF Generation Error:", error);
        alert(t('pdf_error'));
        this.button.disabled = false;
        this.button.innerHTML = originalText;
      }
    }, 100);
  }
}
