import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { sponsorText } from '../data/sponsors.js'
import { useSpark } from '../lib/spark.jsx'

// Notificación push simulada de un anunciante: baja desde arriba y se va sola a los 5 s.
export default function PushBanner() {
  const { push, clearPush } = useSpark()
  const navigate = useNavigate()

  useEffect(() => {
    if (!push) return
    navigator.vibrate?.(80)
    const id = setTimeout(clearPush, 5000)
    return () => clearTimeout(id)
  }, [push]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!push) return null
  const { sponsor } = push
  return (
    <button
      key={push.key}
      onClick={() => { clearPush(); navigate(`/chats/${push.matchId}`) }}
      className="slide-down fixed top-2 inset-x-2 z-[70] max-w-md mx-auto text-left bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/70 p-3 flex gap-3 items-start"
    >
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sponsor.color} text-white flex items-center justify-center shrink-0`}>
        <i className={`fa-solid ${sponsor.icon}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between text-[11px] text-slate-500">
          <span className="font-semibold uppercase tracking-wide">{sponsor.brand} · Patrocinado</span>
          <span>ahora</span>
        </div>
        <p className="text-[13px] text-slate-900 leading-snug mt-0.5">{sponsorText(sponsor, push.name)}</p>
      </div>
    </button>
  )
}
