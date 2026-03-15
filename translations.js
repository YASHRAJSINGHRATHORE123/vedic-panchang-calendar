const translations = {
  en: {
    title: "Vedic Panchang Calendar",
    today: "Today's Panchang",
    sunrise: "Sunrise",
    sunset: "Sunset"
  },
  hi: {
    title: "वैदिक पंचांग कैलेंडर",
    today: "आज का पंचांग",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त"
  }
};
function setLanguage(lang) {
  document.getElementById("title").innerText = translations[lang].title;
  document.getElementById("today").innerText = translations[lang].today;
  document.getElementById("sunrise").innerText = translations[lang].sunrise;
  document.getElementById("sunset").innerText = translations[lang].sunset;

  localStorage.setItem("language", lang);
}
window.onload = function() {
  const lang = localStorage.getItem("language") || "en";
  setLanguage(lang);
};