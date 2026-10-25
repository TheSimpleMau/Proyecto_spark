import bots from '../data/bots.json'
import { sponsorFor } from '../data/sponsors.js'
import { botOffset, offsetDistance } from './geo.js'
import { sharedInterests } from './matching.js'

export const BOTS = bots
export const BOT_BY_ID = Object.fromEntries(bots.map((b) => [b.id, b]))

// Distancia a la que dos usuarios simulados "hacen match" entre ellos.
export const BOT_MATCH_DISTANCE = 15

// Pares de bots que comparten al menos un interés (los únicos que pueden hacer match).
export const BOT_PAIRS = []
for (let i = 0; i < bots.length; i++) {
  for (let j = i + 1; j < bots.length; j++) {
    const shared = sharedInterests(bots[i].interests, bots[j].interests)
    if (shared.length) BOT_PAIRS.push({ a: bots[i], b: bots[j], shared, key: `${i}-${j}` })
  }
}

// Pares que están dentro de la distancia de match en el segundo t.
export function closePairs(t) {
  const pos = new Map(bots.map((b) => [b.id, botOffset(b, t)]))
  const out = []
  for (const p of BOT_PAIRS) {
    const d = offsetDistance(pos.get(p.a.id), pos.get(p.b.id))
    if (d <= BOT_MATCH_DISTANCE) out.push({ ...p, distance: d })
  }
  return out
}

// Recalcula la simulación entre tStart y tEnd (segundos) en pasos de `step`.
// Un match cuenta la primera vez que un par entra a la distancia de match (cada pareja hace match una sola vez).
export function simulateWindow(tStart, tEnd, step = 5, bucketSeconds = 600) {
  const seen = new Set()
  const byInterest = {}
  const bySponsor = {}
  const buckets = []
  let matches = 0
  let distSum = 0
  for (let t = tStart; t <= tEnd; t += step) {
    for (const p of closePairs(t)) {
      if (seen.has(p.key)) continue
      seen.add(p.key)
      matches++
      distSum += p.distance
      for (const tag of p.shared) byInterest[tag] = (byInterest[tag] ?? 0) + 1
      const s = sponsorFor(p.shared)
      if (s) bySponsor[s.brand] = (bySponsor[s.brand] ?? 0) + 1
      const bi = Math.floor((t - tStart) / bucketSeconds)
      buckets[bi] = (buckets[bi] ?? 0) + 1
    }
  }
  const nBuckets = Math.ceil((tEnd - tStart) / bucketSeconds)
  return {
    matches,
    avgDistance: matches ? distSum / matches : 0,
    byInterest: Object.entries(byInterest).sort((a, b) => b[1] - a[1]),
    bySponsor: Object.entries(bySponsor).sort((a, b) => b[1] - a[1]),
    buckets: Array.from({ length: nBuckets }, (_, i) => buckets[i] ?? 0),
    pairsPossible: BOT_PAIRS.length,
  }
}
