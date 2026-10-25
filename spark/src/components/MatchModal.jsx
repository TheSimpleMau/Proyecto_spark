import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { pickIcebreaker } from '../data/interests.js'
import { sponsorFor } from '../data/sponsors.js'
import { matchView } from '../hooks/useMatches.js'
import { useSpark } from '../lib/spark.jsx'

// Notificación de coincidencia: aceptar / ignorar, esperar a la otra persona y abrir el chat.
export default function MatchModal({ onPocket }) {
  const { activeId, matches, me, personFor, respond, closeMatch } = useSpark()
  const navigate = useNavigate()
  const match = matches.find((m) => m.id === activeId)
  const icebreaker = useMemo(() => (match ? pickIcebreaker(match.shared) : ''), [match?.id]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!match) return null

  const person = personFor(match)
  const { status } = matchView(match, me.id)
  const sponsor = sponsorFor(match.shared)

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex flex-col justify-end sm:justify-center p-4">
      <div className="slide-up bg-white rounded-3xl p-6 space-y-5 shadow-2xl max-w-sm mx-auto w-full">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-orange-600 font-bold">
              {status === 'connected' ? '¡Conectaron!' : '¡Coincidencia cercana!'}
            </span>
          </div>
          <button onClick={closeMatch} aria-label="Cerrar" className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="bg-orange-50/80 border border-orange-200/60 rounded-2xl p-4 text-center">
          <div className="text-4xl">{person.emoji}</div>
          <p className="text-sm font-semibold text-slate-800 mt-1">
            {person.name}{person.age ? `, ${person.age}` : ''}
          </p>
          <p className="text-xs font-mono text-orange-700 font-bold uppercase tracking-wider mt-1">A {match.distance_m ?? '?'} metros de ti</p>
          <p className="text-xs text-slate-600 mt-2">Comparten interés en:</p>
          <div className="flex flex-wrap justify-center gap-1.5 mt-2">
            {match.shared.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-xl bg-orange-100/80 text-orange-800 border border-orange-200 text-xs font-medium">{t}</span>
            ))}
          </div>
        </div>

        {sponsor && (
          <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-2xl text-xs text-blue-900">
            <div className="flex items-center gap-1.5 text-blue-700 font-bold mb-1">
              <i className="fa-solid fa-ticket text-red-500" /> Beneficio {sponsor.brand}
            </div>
            {sponsor.benefit}
          </div>
        )}

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
            <i className="fa-regular fa-comment-dots text-orange-500" /> Rompehielos recomendado
          </div>
          <p className="text-xs text-slate-800 leading-relaxed italic font-medium">«{icebreaker}»</p>
        </div>

        {status === 'pending' && (
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => { respond(match, false); closeMatch() }} className="py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-2xl text-xs">
              Ignorar
            </button>
            <button onClick={() => respond(match, true)} className="col-span-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl text-xs shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
              <i className="fa-solid fa-bolt" /> Aceptar conexión
            </button>
          </div>
        )}
        {status === 'waiting' && (
          <div className="py-3.5 rounded-2xl bg-slate-100 text-slate-600 text-xs font-medium flex items-center justify-center gap-2">
            <i className="fa-solid fa-spinner fa-spin text-orange-500" /> Esperando a que {person.name} acepte…
          </div>
        )}
        {status === 'connected' && (
          <div className="space-y-2">
            <button onClick={() => { closeMatch(); navigate(`/chats/${match.id}`) }} className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl text-xs shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
              <i className="fa-solid fa-comments" /> Abrir chat
            </button>
            <button onClick={() => { closeMatch(); onPocket() }} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-2xl text-xs flex items-center justify-center gap-2">
              <i className="fa-solid fa-mobile-screen-button" /> Guardar teléfono y saludar
            </button>
            <p className="text-[11px] text-center text-slate-400">Sugerencia: guarda el móvil y deja que la charla fluya cara a cara.</p>
          </div>
        )}
        {status === 'declined' && (
          <p className="text-xs text-center text-slate-500">Esta conexión no se concretó esta vez.</p>
        )}
      </div>
    </div>
  )
}
