// ingresa fecha ISO "2025-04-20T17:18:30.97";
// retorna en formato "20/04/2025, 12:18:30"
const fechaFormateada = (fecha) => {
  return new Date(fecha).toLocaleString("es-PE", {
    timeZone: "America/Lima",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export { fechaFormateada };
