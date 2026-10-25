import { useEffect, useRef, useState } from 'react'
import { pickReply } from '../data/interests.js'
import { BOT_BY_ID } from '../lib/simulation.js'
import { matchView } from './useMatches.js'

const wait = (min, max) => min + Math.random() * (max - min)

// Hace que los usuarios simulados acepten, saluden y contesten en mis matches con ellos.
export function useBotBrain(meId, { matches, messages, respond, sendMessage }) {
  const done = useRef(new Set())
  const [leader, setLeader] = useState(!navigator.locks)

  // Con varias pestañas abiertas del mismo usuario, solo la que tiene el candado mueve a los bots
  // (si no, cada pestaña mandaría su propio saludo y respuesta).
  useEffect(() => {
    if (!navigator.locks) return
    const ctrl = new AbortController()
    navigator.locks.request('spark-bot-brain', { signal: ctrl.signal }, () => {
      setLeader(true)
      return new Promise(() => {}) // se libera al cerrar la pestaña
    }).catch(() => {})
    return () => ctrl.abort()
  }, [])

  useEffect(() => {
    if (!leader) return
    const once = (key, ms, fn) => {
      if (done.current.has(key)) return
      done.current.add(key)
      setTimeout(fn, ms)
    }
    for (const m of matches) {
      const v = matchView(m, meId)
      const bot = BOT_BY_ID[v.otherId]
      if (!bot) continue
      const list = messages[m.id] ?? []
      if (v.theirs == null) once(`acc-${m.id}`, wait(2000, 5000), () => respond(m, true, bot.id))
      if (v.status !== 'connected') continue
      if (!list.length) {
        once(`hi-${m.id}`, wait(2000, 3500), () => sendMessage(m.id, `¡Hola! Vi que también te gusta ${m.shared[0]} ${bot.emoji}`, bot.id))
      }
      const last = list[list.length - 1]
      if (last && last.sender_id === meId) {
        once(`re-${last.id}`, wait(2000, 4000), () => sendMessage(m.id, pickReply(m.shared), bot.id))
      }
    }
  }, [leader, matches, messages, meId, respond, sendMessage])
}
