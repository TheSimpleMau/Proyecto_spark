import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Bars, Columns, Stat } from '../components/Charts.jsx'
import { nowSeconds } from '../lib/geo.js'
import { BOTS, simulateWindow } from '../lib/simulation.js'
import { supabase } from '../lib/supabase.js'

const REFRESH_MS = 10000
const WINDOW_S = 3600
const BUCKET_S = 300

const hhmm = (d) => d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })

// Panel para revisar desde computadora (se apila en una columna en celular).
export default function Metricas() {
  const [real, setReal] = useState(null)
  const [realError, setRealError] = useState(null)
  const [sim, setSim] = useState(null)
  const [updated, setUpdated] = useState(null)

  useEffect(() => {
    async function load() {
      const end = nowSeconds()
      setSim({ ...simulateWindow(end - WINDOW_S, end, 5, BUCKET_S), end })
      if (supabase) {
        const { data, error } = await supabase.rpc('get_metrics')
        setReal(data)
        setRealError(error?.message ?? null)
      }
      setUpdated(new Date())
    }
    load()
    const id = setInterval(load, REFRESH_MS)
    return () => clearInterval(id)
  }, [])

  const rate = real?.matches_total ? Math.round((real.accepted / real.matches_total) * 100) : 0

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0"><i className="fa-solid fa-chart-column" /></div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold leading-tight">Métricas de SPARK</h1>
            <p className="text-[11px] text-slate-500">Se actualiza cada 10 s{updated && ` · ${hhmm(updated)}`}</p>
          </div>
          <Link to="/simulacion" className="text-xs font-medium text-orange-600 whitespace-nowrap">Simulación</Link>
          <Link to="/" className="text-xs font-medium text-slate-500 whitespace-nowrap">App</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-8">
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-700">Uso real <span className="font-normal text-slate-400">· personas que entraron a la app (incluye sus matches con bots)</span></h2>
          {!supabase && <p className="text-xs text-slate-500">Supabase no está configurado.</p>}
          {realError && <p className="text-xs text-rose-600">No se pudieron leer las métricas: {realError}</p>}
          {real && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <Stat label="Usuarios" value={real.real_users} hint="registrados" />
                <Stat label="Activos" value={real.active_now} hint="últimos 2 min" />
                <Stat label="Matches" value={real.matches_total} hint={`${real.matches_real} entre personas reales`} />
                <Stat label="Aceptación" value={`${rate}%`} hint={`${real.accepted} conexiones`} />
                <Stat label="Mensajes" value={real.messages_total} />
                <Stat label="Distancia" value={`${real.avg_distance ?? 0} m`} hint="promedio al hacer match" />
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                <Card title="Intereses con más matches"><Bars data={real.by_interest.map((r) => [r.tag, r.n])} /></Card>
                <Card title="Matches por hora (últimas 24 h)">
                  <Columns data={last24Hours(real.by_hour)} unit=" matches" axis={['hace 23 h', 'esta hora']} />
                </Card>
              </div>
            </>
          )}
        </section>

        {sim && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-700">Simulación de {BOTS.length} personas <span className="font-normal text-slate-400">· última hora, recalculada cada 5 s de tiempo simulado</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat label="Matches" value={sim.matches} hint="en la última hora" />
              <Stat label="Por persona" value={((sim.matches * 2) / BOTS.length).toFixed(1)} hint="matches promedio" />
              <Stat label="Distancia" value={`${sim.avgDistance.toFixed(1)} m`} hint="promedio al hacer match" />
              <Stat label="Patrocinios" value={sim.bySponsor.reduce((s, [, n]) => s + n, 0)} hint="matches con beneficio" />
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
              <Card title="Intereses que más conectan"><Bars data={sim.byInterest.slice(0, 10)} /></Card>
              <Card title="Parejas en match (promedio cada 5 min)">
                <Columns data={sim.pairsOverTime.map((v, i) => ({ label: hhmm(new Date((sim.end - WINDOW_S + i * BUCKET_S) * 1000)), value: v }))} unit=" parejas" />
              </Card>
              <Card title="Activaciones por anunciante"><Bars data={sim.bySponsor} empty="Ningún match con anunciante" /></Card>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

// Las 24 horas completas (con ceros), para que la gráfica se lea como línea de tiempo.
function last24Hours(rows) {
  const counts = new Map(rows.map((r) => [new Date(r.hour).getTime(), r.n]))
  const start = new Date()
  start.setMinutes(0, 0, 0)
  return Array.from({ length: 24 }, (_, i) => {
    const h = new Date(start.getTime() - (23 - i) * 3600000)
    return { label: hhmm(h), value: counts.get(h.getTime()) ?? 0 }
  })
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 min-w-0">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">{title}</h3>
      {children}
    </div>
  )
}
