import { normalize } from '../data/interests.js'
import { botOffset, haversine, latLngToOffset } from './geo.js'

export function sharedInterests(a, b) {
  const keys = new Set(b.map(normalize))
  return a.filter((t) => keys.has(normalize(t)))
}

// Ids ordenados como los guarda la tabla matches (user_a < user_b).
export function pairKey(idA, idB) {
  return idA < idB ? [idA, idB] : [idB, idA]
}

// Todas las personas visibles en el radar: bots alrededor de mí + usuarios reales por GPS.
// Devuelve [{ id, name, emoji, interests, isBot, dx, dy, distance, shared }]
export function peopleAround(me, myPos, realUsers, bots, t) {
  const out = bots.map((b) => {
    const o = botOffset(b, t)
    return { ...b, isBot: true, ...o, distance: Math.hypot(o.dx, o.dy) }
  })
  if (myPos) {
    for (const u of realUsers) {
      if (u.id === me.id || u.lat == null) continue
      out.push({ ...u, isBot: false, ...latLngToOffset(myPos, u), distance: haversine(myPos, u) })
    }
  }
  for (const p of out) p.shared = sharedInterests(me.interests, p.interests)
  return out.sort((a, b) => a.distance - b.distance)
}
