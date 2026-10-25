import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Bars, Stat } from '../components/Charts.jsx'
import { botOffset, nowSeconds } from '../lib/geo.js'
import { BOT_BY_ID, BOT_MATCH_DISTANCE, BOT_PAIRS, BOTS, closePairs } from '../lib/simulation.js'

const SPEEDS = [1, 5, 20]
const TICK_MS = 100

// Vista global: las 50 personas simuladas moviéndose en la plaza y haciendo match entre ellas.
export default function Simulacion() {
  const [t, setT] = useState(nowSeconds)
  const [speed, setSpeed] = useState(5)
  const [running, setRunning] = useState(true)
  const [selected, setSelected] = useState(null)
  const [stats, setStats] = useState({ total: 0, byInterest: {}, events: [] })
  const seen = useRef(new Set())

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setT((x) => x + (TICK_MS / 1000) * speed), TICK_MS)
    return () => clearInterval(id)
  }, [running, speed])

  const pairs = closePairs(t)

  // Registra como match la primera vez que cada par entra a la distancia de match.
  useEffect(() => {
    const fresh = pairs.filter((p) => !seen.current.has(p.key))
    if (!fresh.length) return
    for (const p of fresh) seen.current.add(p.key)
    setStats((s) => {
      const byInterest = { ...s.byInterest }
      for (const p of fresh) for (const tag of p.shared) byInterest[tag] = (byInterest[tag] ?? 0) + 1
      const events = [...fresh.map((p) => ({ ...p, at: Date.now() })), ...s.events].slice(0, 25)
      return { total: s.total + fresh.length, byInterest, events }
    })
  }, [t]) // eslint-disable-line react-hooks/exhaustive-deps

  const pos = Object.fromEntries(BOTS.map((b) => [b.id, botOffset(b, t)]))
  const sel = selected && BOT_BY_ID[selected]
  const topInterests = Object.entries(stats.byInterest).sort((a, b) => b[1] - a[1]).slice(0, 8)

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <Link to="/" className="text-slate-400 p-1" aria-label="Volver"><i className="fa-solid fa-chevron-left" /></Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold leading-tight">Simulación · 50 personas</h1>
          <p className="text-[11px] text-slate-500 truncate">Plaza de 200 × 200 m · match si están a ≤ {BOT_MATCH_DISTANCE} m y comparten un interés</p>
        </div>
        <Link to="/metricas" className="text-xs font-medium text-orange-600 whitespace-nowrap">Métricas →</Link>
      </header>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="bg-white rounded-3xl border border-slate-200 p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <button onClick={() => setRunning(!running)} className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-medium">
              <i className={`fa-solid ${running ? 'fa-pause' : 'fa-play'} mr-1.5`} />{running ? 'Pausar' : 'Reanudar'}
            </button>
            <div className="flex rounded-xl border border-slate-200 overflow-hidden text-xs">
              {SPEEDS.map((s) => (
                <button key={s} onClick={() => setSpeed(s)} className={`px-3 py-1.5 ${speed === s ? 'bg-orange-500 text-white' : 'bg-white text-slate-600'}`}>×{s}</button>
              ))}
            </div>
            <span className="text-[11px] text-slate-400 w-full sm:w-auto sm:ml-auto flex items-center gap-3">
              <span><span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-1" />en match</span>
              <span><span className="inline-block w-2 h-2 rounded-full bg-slate-300 mr-1" />caminando</span>
            </span>
          </div>
          <svg viewBox="-104 -104 208 208" className="w-full aspect-square bg-orange-50/40 rounded-2xl">
            {[-75, -50, -25, 0, 25, 50, 75].map((v) => (
              <g key={v} stroke="#f1f5f9" strokeWidth="0.5">
                <line x1={v} y1="-100" x2={v} y2="100" /><line x1="-100" y1={v} x2="100" y2={v} />
              </g>
            ))}
            <rect x="-100" y="-100" width="200" height="200" fill="none" stroke="#e2e8f0" rx="4" />
            <circle r="50" fill="none" stroke="#fdba74" strokeDasharray="2 2" strokeWidth="0.6" />
            <text x="-97" y="96" fontSize="4" className="fill-orange-400 font-mono">- - - radio de 50 m de quien mira</text>
            {pairs.map((p) => {
              const a = pos[p.a.id]; const b = pos[p.b.id]
              return <line key={p.key} x1={a.dx} y1={-a.dy} x2={b.dx} y2={-b.dy} stroke="#f97316" strokeWidth="0.8" strokeOpacity="0.7" />
            })}
            {BOTS.map((b) => {
              const o = pos[b.id]
              const matched = pairs.some((p) => p.a.id === b.id || p.b.id === b.id)
              return (
                <g key={b.id} transform={`translate(${o.dx} ${-o.dy})`} onClick={() => setSelected(b.id)} className="cursor-pointer">
                  <title>{`${b.name}: ${b.interests.join(', ')}`}</title>
                  <circle r="5" fill="transparent" />
                  <circle r={selected === b.id ? 3.6 : 2.6} fill={matched ? '#f97316' : '#cbd5e1'} stroke={selected === b.id ? '#0f172a' : '#fff'} strokeWidth="0.8" />
                  <text y="-4" textAnchor="middle" fontSize="4">{b.emoji}</text>
                </g>
              )
            })}
            <g><circle r="3" fill="#0f172a" stroke="#fff" strokeWidth="1" /><text y="8" textAnchor="middle" fontSize="4" className="fill-slate-700 font-semibold">Tú</text></g>
          </svg>
          {sel && (
            <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex gap-3 items-start">
              <span className="text-2xl">{sel.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold">{sel.name}, {sel.age} · a {Math.round(Math.hypot(pos[sel.id].dx, pos[sel.id].dy))} m del centro</p>
                <p className="text-slate-500 mt-0.5">{sel.interests.join(' • ')}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400" aria-label="Cerrar"><i className="fa-solid fa-xmark" /></button>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Personas" value={BOTS.length} hint="simuladas" />
            <Stat label="Matches" value={stats.total} hint="desde que abriste" />
            <Stat label="En match ahora" value={pairs.length} hint="parejas" />
            <Stat label="Compatibles" value={`${Math.round((BOT_PAIRS.length / 1225) * 100)}%`} hint={`${BOT_PAIRS.length} de 1225 parejas`} />
          </div>
          <section className="bg-white rounded-2xl border border-slate-200 p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">Intereses que más conectan</h2>
            <Bars data={topInterests} empty="Esperando el primer match…" />
          </section>
          <section className="bg-white rounded-2xl border border-slate-200 p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">Últimos matches</h2>
            <ul className="space-y-2 max-h-72 overflow-y-auto">
              {stats.events.length === 0 && <li className="text-xs text-slate-400 italic">Aún nada… sube la velocidad a ×20.</li>}
              {stats.events.map((e) => (
                <li key={`${e.key}-${e.at}`} className="text-xs flex items-center gap-2">
                  <span>{e.a.emoji}</span><span className="font-medium">{e.a.name}</span>
                  <i className="fa-solid fa-bolt text-orange-500 text-[10px]" />
                  <span>{e.b.emoji}</span><span className="font-medium">{e.b.name}</span>
                  <span className="text-slate-400 truncate min-w-0 ml-auto">{e.shared[0]} · {Math.round(e.distance)} m</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
