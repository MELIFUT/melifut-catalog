export type TrackingCarrier = "17track" | "starken" | "correos" | "blue";

export const trackingCarriers: { id: TrackingCarrier; name: string }[] = [
  { id: "17track", name: "17TRACK / Internacional" },
  { id: "starken", name: "Starken" },
  { id: "correos", name: "CorreosChile" },
  { id: "blue", name: "Blue Express" },
];

export function normalizeTrackingNumber(number: string): string {
  return number.trim().toUpperCase();
}

export function detectTrackingCarrier(number: string): TrackingCarrier {
  const normalized = normalizeTrackingNumber(number);
  // CorreosChile documenta SP + nueve dígitos + CL para su servicio AliExpress.
  if (/^SP\d{9}CL$/.test(normalized)) return "correos";
  // Valores por defecto de MeliFut; el cliente siempre puede cambiar la empresa.
  if (/^\d{9}$/.test(normalized)) return "starken";
  if (/^\d{10}$/.test(normalized)) return "blue";
  return "17track";
}

export function trackingUrl(carrier: TrackingCarrier, number: string): string {
  const normalized = normalizeTrackingNumber(number);
  const encoded = encodeURIComponent(normalized);
  switch (carrier) {
    case "starken":
      return `https://starken.cl/seguimiento?codigo=${encoded}`;
    case "correos":
      return `https://www.correos.cl/seguimiento-en-linea?codigos=${encoded}`;
    case "blue":
      return `https://www.blue.cl/enviar/seguimiento?n_seguimiento=${encoded}`;
    case "17track":
      return `https://t.17track.net/es${normalized ? `#nums=${encoded}` : ""}`;
  }
}
