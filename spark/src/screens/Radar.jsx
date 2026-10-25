import { useState } from 'react'
import AffinityEditor from '../components/AffinityEditor.jsx'
import RadarView from '../components/RadarView.jsx'
import SponsorCard from '../components/SponsorCard.jsx'
import { matchView } from '../hooks/useMatches.js'
import { useSpark } from '../lib/spark.jsx'
import { timeAgo } from '../lib/time.js'

const STATUS = {
  pending: ['Nueva', 'bg-orange-100 text-orange-700'],
  waiting: ['Esperando', 'bg-slate-100 text-slate-500'],
  connected: ['Conectados', 'bg-emerald-50 text-emerald-700'],
  declined: ['Sin conexión', 'bg-slate-100 text-slate-400'],
}

export default function Radar() {
  const { me, around, geo, matches, personFor, openMatch, updateProfile, simulateDetection } = useSpark()
  const [notice, setNotice] = useState(null)
  const inRange = around.filter((p) => p.distance <= me.radius)
  const withShared = inRange.filter((p) => p.shared.length)
  const realNear = inRange.filter((p) => !p.isBot).length

  function simulate(tag) {
    let interests = me.interests
    if (tag && !interests.includes(tag)) {
      interests = [tag, ...interests].slice(0, 8)
      updateProfile({ interests })
    }
    setNotice(simulateDetection(tag, interests) ? null : 'Ya hiciste match con todas las personas compatibles cercanas.')
  }

  return (
    <div className="px-4 py-5 space-y-6">
      <section className="bg-gradient-to-b from-orange-50/60 to-slate-50 border border-orange-100/80 rounded-3xl p-5 text-center shadow-sm">
        <RadarView people={around} radius={me.radius} />
        <div className="space-y-1 mt-3">
          <h2 className="text-lg font-bold text-slate-800">Búsqueda en {me.radius} m</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            {inRange.length} personas en tu radio · <strong className="text-orange-600">{withShared.length} con gustos en común</strong>
            {realNear > 0 && <> · <strong className="text-emerald-600">{realNear} reales</strong></>}
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            {geo.error ? geo.error : geo.mode === 'demo' ? 'Ubicación demo' : geo.pos ? `GPS ±${geo.pos.accuracy} m` : 'Buscando GPS…'}
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-3 text-xs px-2">
          <span className="text-slate-500 font-mono text-[11px]">Alcance:</span>
          <input type="range" min="5" max="100" step="5" value={me.radius}
            onChange={(e) => updateProfile({ radius: Number(e.target.value) })}
            className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500" />
          <span className="font-mono font-semibold text-orange-600 w-12 text-right">{me.radius} m</span>
        </div>
        <button onClick={() => simulate()} className="mt-4 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-medium text-xs shadow-md flex items-center justify-center gap-2">
          <i className="fa-solid fa-satellite-dish text-orange-400" /> Simular detección cercana
        </button>
        {notice && <p className="text-[11px] text-slate-500 mt-2">{notice}</p>}
      </section>

      <AffinityEditor interests={me.interests} onChange={(interests) => updateProfile({ interests })} />

      <SponsorCard onTry={() => simulate('Helados y Malteadas')} />

      <section className="space-y-2">
        <h2 className="px-1 text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Coincidencias recientes</h2>
        {matches.length === 0 && (
          <div className="p-4 bg-white rounded-xl border border-slate-200/60 text-center text-xs text-slate-400 italic">
            Aún no hay cruces. Camina un poco o usa “Simular detección cercana”.
          </div>
        )}
        {matches.slice(0, 6).map((m) => {
          const p = personFor(m)
          const [label, cls] = STATUS[matchView(m, me.id).status]
          return (
            <button key={m.id} onClick={() => openMatch(m.id)} className="w-full text-left p-3 rounded-xl bg-white border border-slate-200/70 shadow-sm flex items-center gap-3">
              <span className="text-2xl">{p.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800 truncate">{p.name} · {m.shared.join(' • ')}</p>
                <p className="text-[11px] text-slate-400 font-mono">{m.distance_m} m • {timeAgo(m.created_at)}</p>
              </div>
              <span className={`text-[10px] font-medium px-2 py-1 rounded-lg shrink-0 ${cls}`}>{label}</span>
            </button>
          )
        })}
      </section>
    </div>
  )
}
