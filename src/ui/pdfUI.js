import { generateYearlyPanchangPDF } from '../engines/pdfEngine.js';

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
    this.button.innerHTML = '<span class="animate-pulse">Generating PDF...</span>';
    
    // Allow UI to update before heavy processing
    setTimeout(async () => {
      try {
        await generateYearlyPanchangPDF(year, this.location);
      } catch (error) {
        console.error("PDF Generation Error:", error);
        alert("Failed to generate PDF. Please try again.");
      } finally {
        this.button.disabled = false;
        this.button.innerHTML = originalText;
      }
    }, 100);
  }
}
