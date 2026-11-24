// Número de WhatsApp del negocio (en la demo es ficticio)
const WHATSAPP = "34600000000";

const serviceSelect = document.getElementById("service");
const form = document.getElementById("booking");

/* ===== 1. RELLENAR EL DESPLEGABLE CON LOS SERVICIOS ===== */
// Así solo escribimos los servicios una vez (en el HTML) y no hay que repetirlos
document.querySelectorAll("[data-service]").forEach(function (btn) {
  const option = document.createElement("option");
  option.textContent = btn.dataset.service;
  serviceSelect.appendChild(option);

  /* ===== 2. BOTÓN "RESERVAR" DE CADA SERVICIO ===== */
  btn.addEventListener("click", function () {
    serviceSelect.value = btn.dataset.service;       // lo seleccionamos
    document.getElementById("cita").scrollIntoView(); // bajamos al formulario
    form.classList.remove("flash");
    void form.offsetWidth;                            // truco para reiniciar la animación
    form.classList.add("flash");
  });
});

/* ===== 3. HORAS LIBRES SEGÚN EL DÍA ===== */
// Turnos por día de la semana (0 = domingo). Cada turno: [inicio, fin] en "HH:MM"
const HORARIO = {
  0: [],                                   // domingo cerrado
  1: [],                                   // lunes cerrado
  2: [["10:00", "14:00"], ["16:30", "20:30"]],
  3: [["10:00", "14:00"], ["16:30", "20:30"]],
  4: [["10:00", "14:00"], ["16:30", "20:30"]],
  5: [["10:00", "14:00"], ["16:30", "20:30"]],
  6: [["09:00", "14:00"]],                 // sábado solo mañana
};

// Simulamos horas ya ocupadas (en una web real vendrían de una base de datos)
const OCUPADAS = ["11:00", "12:30", "17:00", "19:30"];

const dateInput = document.getElementById("date");
const slotsBox = document.getElementById("slots");
const hint = document.getElementById("date-hint");
let selectedTime = null;

// Fecha mínima = hoy (en hora local, formato AAAA-MM-DD)
const today = new Date();
const pad = n => String(n).padStart(2, "0");
dateInput.min = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const toTime = min => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;

dateInput.addEventListener("change", function () {
  slotsBox.innerHTML = "";
  selectedTime = null;
  if (!dateInput.value) return;

  // "T00:00" hace que la fecha se lea en hora local y no en UTC
  const day = new Date(dateInput.value + "T00:00");
  const turnos = HORARIO[day.getDay()];

  if (turnos.length === 0) {
    hint.textContent = "Ese día estamos cerrados 😴 Prueba de martes a sábado.";
    return;
  }
  hint.textContent = "Elige una hora:";

  const isToday = day.toDateString() === today.toDateString();
  const nowMin = today.getHours() * 60 + today.getMinutes();

  // Creamos un botón cada 30 minutos dentro de cada turno
  turnos.forEach(function ([start, end]) {
    for (let m = toMin(start); m < toMin(end); m += 30) {
      const time = toTime(m);
      const btn = document.createElement("button");
      btn.type = "button";            // para que no envíe el formulario
      btn.className = "slot";
      btn.textContent = time;
      // Deshabilitamos horas ocupadas o que ya han pasado hoy
      btn.disabled = OCUPADAS.includes(time) || (isToday && m <= nowMin);
      btn.addEventListener("click", function () {
        slotsBox.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
        btn.classList.add("selected");
        selectedTime = time;
      });
      slotsBox.appendChild(btn);
    }
  });
});

/* ===== 4. ENVIAR POR WHATSAPP ===== */
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!selectedTime) {
    hint.textContent = "⚠️ Elige una hora antes de confirmar.";
    return;
  }
  const date = dateInput.value.split("-").reverse().join("/");
  const stylist = document.getElementById("stylist").value;
  const name = document.getElementById("name").value.trim();
  const text = `Hola, soy ${name}. Quiero cita para "${serviceSelect.value}" el ${date} a las ${selectedTime}. Estilista: ${stylist}.`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
});
