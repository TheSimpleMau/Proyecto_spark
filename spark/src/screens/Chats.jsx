import { Link } from 'react-router'
import { matchView } from '../hooks/useMatches.js'
import { useSpark } from '../lib/spark.jsx'
import { timeAgo } from '../lib/time.js'

export default function Chats() {
  const { matches, messages, me, personFor, openMatch } = useSpark()
  const byStatus = (s) => matches.filter((m) => matchView(m, me.id).status === s)
  const connected = byStatus('connected').sort((a, b) => lastTime(b) - lastTime(a))

  function lastTime(m) {
    const list = messages[m.id]
    return new Date(list?.at(-1)?.created_at ?? m.created_at).getTime()
  }

  const Row = ({ m, children, onClick, to }) => {
    const p = personFor(m)
    const Tag = to ? Link : 'button'
    return (
      <Tag to={to} onClick={onClick} className="w-full text-left p-3 rounded-2xl bg-white border border-slate-200/70 shadow-sm flex items-center gap-3">
        <span className="w-11 h-11 rounded-full bg-orange-50 flex items-center justify-center text-2xl shrink-0">{p.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
          {children}
        </div>
      </Tag>
    )
  }

  return (
    <div className="px-4 py-5 space-y-6">
      <h1 className="text-lg font-bold">Conexiones</h1>
      {matches.length === 0 && <p className="text-xs text-slate-400 italic">Todavía no tienes coincidencias. Abre el radar para encontrar gente cerca.</p>}

      <Group title="Solicitudes nuevas" items={byStatus('pending')}>
        {(m) => <Row key={m.id} m={m} onClick={() => openMatch(m.id)}><p className="text-xs text-orange-600 truncate">Comparten {m.shared.join(', ')} · toca para responder</p></Row>}
      </Group>
      <Group title="Esperando respuesta" items={byStatus('waiting')}>
        {(m) => <Row key={m.id} m={m} onClick={() => openMatch(m.id)}><p className="text-xs text-slate-400 truncate">Aceptaste · {timeAgo(m.created_at)}</p></Row>}
      </Group>
      <Group title="Chats" items={connected}>
        {(m) => {
          const last = messages[m.id]?.at(-1)
          return (
            <Row key={m.id} m={m} to={`/chats/${m.id}`}>
              <p className="text-xs text-slate-500 truncate">{last ? `${last.sender_id === me.id ? 'Tú: ' : ''}${last.body}` : `Comparten ${m.shared.join(', ')}`}</p>
            </Row>
          )
        }}
      </Group>
    </div>
  )
}

function Group({ title, items, children }) {
  if (!items.length) return null
  return (
    <section className="space-y-2">
      <h2 className="px-1 text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">{title} · {items.length}</h2>
      {items.map(children)}
    </section>
  )
}
