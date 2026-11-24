// Número de WhatsApp del negocio (en la demo es ficticio)
const WHATSAPP = "34600000000";

/* ===== 1. PESTAÑAS DE LA CARTA ===== */
const tabs = document.querySelectorAll(".tab");
const menus = document.querySelectorAll(".menu");

tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    // Quitamos "active" de todas las pestañas y se lo ponemos a la pulsada
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    // Mostramos solo la carta cuya categoría coincide con la pestaña
    menus.forEach(m => { m.hidden = m.dataset.cat !== tab.dataset.tab; });
  });
});

/* ===== 2. ¿ABIERTO AHORA? ===== */
// Horario en minutos desde medianoche. Índice 0 = domingo, 1 = lunes...
// null = cerrado ese día. 7:30 = 7*60+30 = 450
const HORARIO = [
  null,        // domingo
  [450, 810],  // lunes 7:30–13:30
  [450, 810],  // martes
  [450, 810],  // miércoles
  [450, 810],  // jueves
  [450, 840],  // viernes 7:30–14:00
  [510, 840],  // sábado 8:30–14:00
];

const now = new Date();
const today = now.getDay();
const minutes = now.getHours() * 60 + now.getMinutes();
const status = document.getElementById("status");
const h = HORARIO[today];

if (h && minutes >= h[0] && minutes < h[1]) {
  status.textContent = "Abierto ahora";
  status.classList.add("open");
} else {
  status.textContent = "Cerrado ahora · Reserva para mañana";
  status.classList.add("closed");
}

// Resaltamos el día de hoy en la tabla de horario
const row = document.querySelector(`.hours tr[data-day="${today}"]`);
if (row) row.classList.add("today");

/* ===== 3. RESERVA POR WHATSAPP ===== */
const dateInput = document.getElementById("b-date");
// No dejamos reservar en fechas pasadas: el mínimo es hoy (formato AAAA-MM-DD)
dateInput.min = now.toISOString().split("T")[0];

document.getElementById("booking-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("b-name").value.trim();
  const people = document.getElementById("b-people").value;
  const zone = document.getElementById("b-zone").value;
  const time = document.getElementById("b-time").value;
  // Convertimos 2026-11-24 en 24/11/2026
  const date = dateInput.value.split("-").reverse().join("/");

  const text = `Hola, soy ${name}. Quiero reservar mesa para ${people} el ${date} a las ${time} (${zone}).`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
});
