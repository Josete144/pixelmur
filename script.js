// Tu número de WhatsApp (34 + móvil, sin espacios ni +)
const WHATSAPP = "34622577149";

// Cuando alguien envía el formulario del hero...
document.getElementById("quote-form").addEventListener("submit", function (e) {
  e.preventDefault(); // evita que la página se recargue

  // Leemos lo que ha escrito la persona
  const name = document.getElementById("q-name").value.trim();
  const business = document.getElementById("q-business").value.trim();
  const msg = document.getElementById("q-msg").value.trim();

  // Montamos el mensaje que aparecerá ya escrito en WhatsApp
  let text = `Hola, soy ${name}. Tengo un negocio (${business}) y me interesa una web.`;
  if (msg) text += ` ${msg}`;

  // encodeURIComponent convierte espacios y tildes a formato de URL
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
});
