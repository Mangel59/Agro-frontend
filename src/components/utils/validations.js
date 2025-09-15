const nombreRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .,'-]{2,80}$/;

const dangerousPatterns = [
  /<\s*script\b/i,                              // <script>
  /\bon\w+\s*=/i,                               // onload=, onclick=, etc.
  /javascript:/i,                               // href="javascript:..."
  /--|\/\*|\*\//,                               // comentarios SQL
  /;\s*drop\s+table/i,                          // ; DROP TABLE ...
  /\b(drop|insert|update|delete|truncate|alter)\b\s+\b(table|into|from)\b/i,
  /'?\s+or\s+'?1'?=?'?\s*1/i,                   // ' OR '1'='1
];

const hasDangerous = (v = "") => dangerousPatterns.some((rx) => rx.test(v));
const containsTags = (v = "") => /<[^>]+>/i.test(v); // cualquier etiqueta HTML
const normalize = (v = "") => v.replace(/\s+/g, " ").trim();

export function validateCamposBase(formData = {}) {
  const errors = {};

  const nombre = normalize(formData.nombre ?? "");
  const descripcion = normalize(formData.descripcion ?? "");

  // Reglas base
  if (!nombre) errors.nombre = "El nombre es obligatorio.";
  if (!descripcion) errors.descripcion = "La descripción es obligatoria.";
  if (!formData.estado) errors.estado = "Debe seleccionar un estado válido.";

  // Validación de formato de Nombre (whitelist)
  if (!errors.nombre && !nombreRegex.test(nombre)) {
    errors.nombre =
      "El nombre sólo permite letras (incluye tildes/ñ), números y puntuación básica (2–80).";
  }

  // Bloqueo de HTML/Script y SQL sospechoso
  if (!errors.nombre && (containsTags(nombre) || hasDangerous(nombre))) {
    errors.nombre =
      "El nombre contiene contenido potencialmente peligroso. Ingresa texto plano.";
  }
  if (!errors.descripcion && (containsTags(descripcion) || hasDangerous(descripcion))) {
    errors.descripcion =
      "La descripción contiene contenido potencialmente peligroso. Ingresa texto plano.";
  }

  // Longitudes
  if (!errors.nombre && nombre.length > 80) {
    errors.nombre = "El nombre no puede superar 80 caracteres.";
  }
  if (!errors.descripcion && descripcion.length > 1500) {
    errors.descripcion = "La descripción no puede superar 1500 caracteres.";
  }

  // Error general opcional
  if (
    hasDangerous(nombre) || hasDangerous(descripcion) ||
    containsTags(nombre) || containsTags(descripcion)
  ) {
    errors._security =
      "Se detectaron patrones de SQL Injection/XSS. Usa sólo texto plano sin etiquetas ni scripts.";
  }

  return errors;
}
