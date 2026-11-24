// Número de WhatsApp del negocio (en la demo es ficticio)
const WHATSAPP = "34600000000";

const vehicles = document.querySelectorAll('input[name="vehicle"]');
const options = document.querySelectorAll(".options input");
const list = document.getElementById("summary-list");
const totalEl = document.getElementById("total");
const sendBtn = document.getElementById("send-quote");

// Formatea un número como precio español: 82.8 -> "83 €"
const euros = n => Math.round(n).toLocaleString("es-ES") + " €";

/* ===== CALCULAR EL PRESUPUESTO ===== */
// Esta función se ejecuta cada vez que cambia cualquier opción
function update() {
  const vehicle = document.querySelector('input[name="vehicle"]:checked');
  const mult = Number(vehicle.dataset.mult);
  // Nos quedamos solo con las casillas marcadas
  const chosen = [...options].filter(o => o.checked);

  // Actualizamos el precio que se ve en cada casilla según el vehículo elegido
  options.forEach(o => {
    o.parentElement.querySelector("b").textContent = euros(Number(o.dataset.price) * mult);
  });

  list.innerHTML = "";
  let total = 0;

  if (chosen.length === 0) {
    list.innerHTML = '<li class="muted">Aún no has elegido nada.</li>';
  }

  chosen.forEach(function (o) {
    const price = Number(o.dataset.price) * mult;
    total += price;
    const li = document.createElement("li");
    li.innerHTML = `<span>${o.value}</span><span>${euros(price)}</span>`;
    list.appendChild(li);
  });

  totalEl.textContent = euros(total);
  sendBtn.disabled = chosen.length === 0; // sin servicios no se puede enviar
  return { vehicle: vehicle.value, chosen, total };
}

// Escuchamos cambios en todos los radios y casillas
[...vehicles, ...options].forEach(input => input.addEventListener("change", update));

/* ===== ENVIAR POR WHATSAPP ===== */
sendBtn.addEventListener("click", function () {
  const { vehicle, chosen, total } = update();
  const plate = document.getElementById("plate").value.trim().toUpperCase();
  const services = chosen.map(o => "- " + o.value).join("\n");

  let text = `Hola, quiero pedir cita (${vehicle})`;
  if (plate) text += ` (matrícula ${plate})`;
  text += `:\n${services}\nPresupuesto orientativo: ${euros(total)}`;

  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
});

update(); // pintamos el estado inicial
