import { calculatePanchang } from '../engines/panchangEngine.js';
import { detectFestival } from '../engines/festivalEngine.js';
import { formatDate } from '../utils/dateUtils.js';

export async function generateYearlyPanchangPDF(year, location) {
  // We'll use jspdf which should be available globally via CDN
  if (!window.jspdf) {
    console.error("jsPDF is not loaded");
    return;
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text(`Panchang ${year}`, 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Location: ${location.city}`, 105, 30, { align: 'center' });
  
  const importantDates = [];
  
  // Scan the year for important dates (Festivals, Ekadashi, Amavasya, Purnima)
  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month, day);
      if (date.getMonth() !== month) break; // Skip invalid dates like Feb 30
      
      const panchang = calculatePanchang(date, location.latitude, location.longitude);
      const festival = detectFestival(panchang, date);
      
      let event = null;
      if (festival) {
        event = festival;
      } else if (panchang.tithi.index === 10 || panchang.tithi.index === 25) {
        event = "Ekadashi";
      } else if (panchang.tithi.index === 14) {
        event = "Purnima";
      } else if (panchang.tithi.index === 29) {
        event = "Amavasya";
      }
      
      if (event) {
        importantDates.push([formatDate(date), event, panchang.tithi.name]);
      }
    }
  }
  
  // Use autoTable if available
  if (doc.autoTable) {
    doc.autoTable({
      startY: 40,
      head: [['Date', 'Event', 'Tithi']],
      body: importantDates,
      theme: 'striped',
      headStyles: { fillColor: [245, 158, 11] } // Amber 500
    });
  } else {
    // Fallback simple text rendering
    let y = 50;
    importantDates.forEach(row => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${row[0]} - ${row[1]} (${row[2]})`, 20, y);
      y += 10;
    });
  }
  
  doc.save(`Panchang_${year}.pdf`);
}
