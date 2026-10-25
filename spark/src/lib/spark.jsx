import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { sponsorFor } from '../data/sponsors.js'
import { useBotBrain } from '../hooks/useBotBrain.js'
import { useGeolocation } from '../hooks/useGeolocation.js'
import { matchView, useMatches } from '../hooks/useMatches.js'
import { usePresence } from '../hooks/usePresence.js'
import { nowSeconds } from './geo.js'
import { peopleAround, sharedInterests } from './matching.js'
import { BOT_BY_ID, BOTS } from './simulation.js'
import { supabase } from './supabase.js'

const SparkContext = createContext(null)
export const useSpark = () => useContext(SparkContext)

const DETECT_EVERY_MS = 2000
const BOT_COOLDOWN_MS = 45000 // máximo un match nuevo con bot cada 45 s
const startedAt = Date.now()

export function SparkProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = cargando
  const [me, setMe] = useState(undefined) // undefined = cargando, null = sin perfil
  const meId = me?.id
  const geo = useGeolocation(!!meId)
  const realUsers = usePresence(meId, geo.pos)
  const m = useMatches(meId)
  useBotBrain(meId, m)

  // Sesión anónima y perfil ---------------------------------------------------------
  useEffect(() => {
    if (!supabase) { setSession(null); setMe(null); return }
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session === undefined) return
    if (!session) { setMe(null); return }
    supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
      .then(({ data }) => setMe(data ?? null))
  }, [session])

  const createProfile = useCallback(async ({ name, emoji, interests }) => {
    let user = session?.user
    if (!user) {
      const { data, error } = await supabase.auth.signInAnonymously()
      if (error) throw error
      user = data.user
    }
    const { data, error } = await supabase.from('profiles')
      .upsert({ id: user.id, name, emoji, interests }).select().single()
    if (error) throw error
    setMe(data)
  }, [session])

  const updateProfile = useCallback(async (patch) => {
    setMe((prev) => ({ ...prev, ...patch }))
    const { error } = await supabase.from('profiles').update(patch).eq('id', meId)
    if (error) console.error(error)
  }, [meId])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setMe(null)
  }, [])

  // Personas alrededor (se recalcula cada 2 s) ----------------------------------------
  const [around, setAround] = useState([])
  const meRef = useRef(me)
  meRef.current = me
  useEffect(() => {
    if (!meId) return
    const tick = () => setAround(peopleAround(meRef.current, geo.pos, realUsers, BOTS, nowSeconds()))
    tick()
    const id = setInterval(tick, DETECT_EVERY_MS)
    return () => clearInterval(id)
  }, [meId, geo.pos, realUsers])

  // Notificación de match (modal) ---------------------------------------------------
  const [activeId, setActiveId] = useState(null)
  const dismissed = useRef(new Set())
  useEffect(() => {
    if (activeId || !meId) return
    const next = m.matches.find((x) =>
      matchView(x, meId).status === 'pending' && !dismissed.current.has(x.id)
      && new Date(x.created_at).getTime() > startedAt - 600000)
    if (!next) return
    setActiveId(next.id)
    navigator.vibrate?.([120, 60, 120])
    if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('⚡ ¡Coincidencia cercana!', { body: `Alguien comparte: ${next.shared.join(', ')}` })
    }
  }, [m.matches, activeId, meId])

  const openMatch = useCallback((id) => setActiveId(id), [])
  const closeMatch = useCallback(() => {
    setActiveId((id) => { if (id) dismissed.current.add(id); return null })
  }, [])

  // Detección automática --------------------------------------------------------------
  const lastBot = useRef(Date.now() - BOT_COOLDOWN_MS + 15000) // primer bot ~15 s después de entrar
  useEffect(() => {
    if (!me || !m.loaded) return
    const taken = new Set(m.matches.map((x) => matchView(x, me.id).otherId))
    for (const p of around) {
      if (p.distance > me.radius || !p.shared.length || taken.has(p.id)) continue
      if (!p.isBot) {
        m.createMatch(p, p.shared, p.distance)
      } else if (!activeId && Date.now() - lastBot.current > BOT_COOLDOWN_MS) {
        lastBot.current = Date.now()
        m.createMatch(p, p.shared, p.distance)
      }
    }
  }, [around]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fuerza un match con el bot más cercano que comparta algo (botón "Simular detección").
  const simulateDetection = useCallback((requiredTag, interests = me.interests) => {
    const taken = new Set(m.matches.map((x) => matchView(x, me.id).otherId))
    const t = nowSeconds()
    const bot = peopleAround({ ...me, interests }, null, [], BOTS, t)
      .find((p) => !taken.has(p.id) && p.shared.length && (!requiredTag || p.shared.includes(requiredTag)))
    if (!bot) return false
    lastBot.current = Date.now()
    m.createMatch(bot, bot.shared, bot.distance)
    return true
  }, [me, m])

  // Push simulada del anunciante al conectar --------------------------------------------
  const [push, setPush] = useState(null)
  const celebrated = useRef(null)
  useEffect(() => {
    if (!m.loaded || !meId) return
    const connected = m.matches.filter((x) => matchView(x, meId).status === 'connected')
    if (!celebrated.current) { celebrated.current = new Set(connected.map((x) => x.id)); return }
    for (const x of connected) {
      if (celebrated.current.has(x.id)) continue
      celebrated.current.add(x.id)
      const sponsor = sponsorFor(x.shared)
      if (sponsor) setPush({ sponsor, name: personFor(x).name, matchId: x.id, key: x.id })
    }
  }, [m.matches, m.loaded, meId]) // eslint-disable-line react-hooks/exhaustive-deps

  const personFor = (match) => {
    const id = matchView(match, meId).otherId
    return BOT_BY_ID[id] ?? m.people[id] ?? { id, name: 'Alguien', emoji: '⚡', interests: [] }
  }

  const value = {
    ready: session !== undefined && me !== undefined,
    me, geo, around, realUsers,
    ...m,
    personFor,
    createProfile, updateProfile, signOut,
    activeId, openMatch, closeMatch,
    simulateDetection,
    push, clearPush: () => setPush(null),
    sharedWith: (p) => sharedInterests(me?.interests ?? [], p.interests ?? []),
  }
  return <SparkContext.Provider value={value}>{children}</SparkContext.Provider>
}
