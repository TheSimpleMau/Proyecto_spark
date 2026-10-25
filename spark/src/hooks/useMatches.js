import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { pairKey } from '../lib/matching.js'
import { BOT_BY_ID } from '../lib/simulation.js'

// Matches y mensajes del usuario, sincronizados en tiempo real con Supabase.
export function useMatches(meId) {
  const [matches, setMatches] = useState([])
  const [messages, setMessages] = useState({}) // match_id -> [mensajes]
  const [people, setPeople] = useState({}) // perfiles de usuarios reales con los que hay match
  const [loaded, setLoaded] = useState(false)
  const pending = useRef(new Set()) // ids con match en creación (evita duplicados)

  const mergeMatch = useCallback((row) => {
    setMatches((prev) => {
      const i = prev.findIndex((m) => m.id === row.id)
      if (i === -1) return [row, ...prev]
      const next = [...prev]
      next[i] = { ...prev[i], ...row }
      return next
    })
  }, [])

  const mergeMessage = useCallback((row) => {
    setMessages((prev) => {
      const list = prev[row.match_id] ?? []
      if (list.some((m) => m.id === row.id)) return prev
      return { ...prev, [row.match_id]: [...list, row] }
    })
  }, [])

  useEffect(() => {
    if (!supabase || !meId) return
    let alive = true
    async function loadMatches() {
      const { data } = await supabase.from('matches').select('*').order('created_at', { ascending: false })
      if (alive && data) data.forEach(mergeMatch)
    }
    async function loadAll() {
      const [{ data: ms }, { data: msgs }] = await Promise.all([
        supabase.from('matches').select('*').order('created_at', { ascending: false }),
        supabase.from('messages').select('*').order('created_at').limit(2000),
      ])
      if (!alive) return
      setMatches(ms ?? [])
      const grouped = {}
      for (const m of msgs ?? []) (grouped[m.match_id] ??= []).push(m)
      setMessages(grouped)
      setLoaded(true)
    }
    loadAll()

    const channel = supabase.channel(`spark-${meId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, (p) => p.new?.id && mergeMatch(p.new))
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (p) => mergeMessage(p.new))
      .subscribe()

    // Red de seguridad: el tiempo real se corta al bloquear el celular o tarda en conectarse.
    const poll = setInterval(loadMatches, 8000)
    const onVisible = () => document.visibilityState === 'visible' && loadAll()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      alive = false
      clearInterval(poll)
      document.removeEventListener('visibilitychange', onVisible)
      supabase.removeChannel(channel)
    }
  }, [meId, mergeMatch, mergeMessage])

  // Trae los perfiles de usuarios reales que aparecen en mis matches.
  useEffect(() => {
    if (!supabase) return
    const missing = [...new Set(matches.map((m) => otherId(m, meId)))].filter((id) => !BOT_BY_ID[id] && !people[id])
    if (!missing.length) return
    supabase.from('profiles').select('id,name,emoji,interests').in('id', missing).then(({ data }) => {
      if (data) setPeople((prev) => ({ ...prev, ...Object.fromEntries(data.map((p) => [p.id, p])) }))
    })
  }, [matches, meId, people])

  const createMatch = useCallback(async (other, shared, distance) => {
    if (pending.current.has(other.id)) return
    pending.current.add(other.id)
    if (!other.isBot) setPeople((prev) => ({ ...prev, [other.id]: other }))
    const [user_a, user_b] = pairKey(meId, other.id)
    const { data, error } = await supabase.from('matches')
      .upsert({ user_a, user_b, shared, distance_m: Math.round(distance) }, { onConflict: 'user_a,user_b', ignoreDuplicates: true })
      .select()
    if (error) { pending.current.delete(other.id); console.error(error); return }
    data?.forEach(mergeMatch)
  }, [meId, mergeMatch])

  // Responde un match como `asId` (yo, o el bot cuando el cliente lo simula).
  const respond = useCallback(async (match, accepted, asId = meId) => {
    const field = match.user_a === asId ? 'a_accepted' : 'b_accepted'
    mergeMatch({ id: match.id, [field]: accepted })
    const { error } = await supabase.from('matches').update({ [field]: accepted }).eq('id', match.id)
    if (error) console.error(error)
  }, [meId, mergeMatch])

  const sendMessage = useCallback(async (matchId, body, senderId = meId) => {
    const { data, error } = await supabase.from('messages').insert({ match_id: matchId, sender_id: senderId, body }).select().single()
    if (error) { console.error(error); return }
    mergeMessage(data)
  }, [meId, mergeMessage])

  return { matches, messages, people, loaded, createMatch, respond, sendMessage }
}

export function otherId(match, meId) {
  return match.user_a === meId ? match.user_b : match.user_a
}

// Estado del match desde mi punto de vista.
export function matchView(match, meId) {
  const mineFirst = match.user_a === meId
  const mine = mineFirst ? match.a_accepted : match.b_accepted
  const theirs = mineFirst ? match.b_accepted : match.a_accepted
  let status = 'connected'
  if (mine === false || theirs === false) status = 'declined'
  else if (mine == null) status = 'pending'
  else if (theirs == null) status = 'waiting'
  return { otherId: otherId(match, meId), mine, theirs, status }
}
