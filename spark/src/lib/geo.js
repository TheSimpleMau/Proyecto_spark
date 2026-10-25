// Utilidades de distancia y movimiento de los usuarios simulados.
const R = 6371000 // radio de la Tierra en metros

export function haversine(a, b) {
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// Convierte una lat/lng ajena a metros (dx este, dy norte) respecto a `origin`.
export function latLngToOffset(origin, p) {
  const dy = ((p.lat - origin.lat) * Math.PI * R) / 180
  const dx = ((p.lng - origin.lng) * Math.PI * R * Math.cos((origin.lat * Math.PI) / 180)) / 180
  return { dx, dy }
}

// Posición del bot (metros respecto a quien mira) en el segundo `t`.
// Es una figura de Lissajous: misma fórmula en todos los dispositivos, así todos ven lo mismo.
export function botOffset(bot, t) {
  const m = bot.move
  return {
    dx: m.cx + m.rx * Math.sin(m.wx * t + m.px),
    dy: m.cy + m.ry * Math.sin(m.wy * t + m.py),
  }
}

export function offsetDistance(a, b) {
  return Math.hypot(a.dx - b.dx, a.dy - b.dy)
}

export const nowSeconds = () => Date.now() / 1000
