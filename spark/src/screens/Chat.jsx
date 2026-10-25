import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { pickIcebreaker } from '../data/interests.js'
import { sponsorFor } from '../data/sponsors.js'
import { useSpark } from '../lib/spark.jsx'

export default function Chat() {
  const { id } = useParams()
  const { matches, messages, me, personFor, sendMessage } = useSpark()
  const [text, setText] = useState('')
  const bottom = useRef(null)
  const match = matches.find((m) => m.id === id)
  const list = messages[id] ?? []
  const icebreaker = useMemo(() => (match ? pickIcebreaker(match.shared) : ''), [match?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }) }, [list.length])

  if (!match) return <p className="p-6 text-xs text-slate-400">Cargando chat…</p>
  const person = personFor(match)
  const sponsor = sponsorFor(match.shared)

  function send(e) {
    e.preventDefault()
    const body = text.trim()
    if (!body) return
    sendMessage(id, body)
    setText('')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-100 bg-white flex items-center gap-3">
        <Link to="/chats" aria-label="Volver" className="text-slate-400 p-1"><i className="fa-solid fa-chevron-left" /></Link>
        <span className="text-2xl">{person.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold flex items-center gap-1.5">
            {person.name}
            {person.move && <span className="text-[9px] font-mono uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Simulado</span>}
          </p>
          <p className="text-[11px] text-orange-600 truncate">{match.shared.join(' • ')}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {sponsor && (
          <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-2xl text-xs text-blue-900 mb-3">
            <div className="flex items-center gap-1.5 text-blue-700 font-bold mb-1"><i className="fa-solid fa-ticket text-red-500" /> Beneficio {sponsor.brand}</div>
            {sponsor.benefit}
          </div>
        )}
        <p className="text-center text-[11px] text-slate-400 py-2">Se conocieron a {match.distance_m} m · comparten {match.shared.join(', ')}</p>
        {list.map((m) => {
          const mine = m.sender_id === me.id
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <p className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-sm leading-snug ${mine ? 'bg-orange-500 text-white rounded-br-md' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md'}`}>{m.body}</p>
            </div>
          )
        })}
        <div ref={bottom} />
      </div>

      <div className="border-t border-slate-100 bg-white p-3 space-y-2">
        {list.filter((m) => m.sender_id === me.id).length === 0 && (
          <button onClick={() => setText(icebreaker)} className="w-full text-left text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-600">
            <i className="fa-regular fa-comment-dots text-orange-500 mr-1.5" /> {icebreaker}
          </button>
        )}
        <form onSubmit={send} className="flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} maxLength={500} placeholder="Escribe un mensaje…"
            className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40" />
          <button aria-label="Enviar" className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0"><i className="fa-solid fa-paper-plane" /></button>
        </form>
      </div>
    </div>
  )
}
