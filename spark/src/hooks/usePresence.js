import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const EVERY_MS = 5000

// Publica mi ubicación cada 5 s y trae a los usuarios reales activos en los últimos 2 min.
export function usePresence(meId, pos) {
  const [realUsers, setRealUsers] = useState([])
  const posRef = useRef(pos)
  posRef.current = pos

  useEffect(() => {
    if (!supabase || !meId) return
    let alive = true
    async function tick() {
      const p = posRef.current
      if (p) {
        await supabase.from('profiles')
          .update({ lat: p.lat, lng: p.lng, last_seen: new Date().toISOString() })
          .eq('id', meId)
      }
      const since = new Date(Date.now() - 120000).toISOString()
      const { data } = await supabase.from('profiles')
        .select('id,name,emoji,interests,lat,lng,last_seen')
        .eq('is_bot', false).neq('id', meId).gt('last_seen', since)
      if (alive && data) setRealUsers(data)
    }
    tick()
    const id = setInterval(tick, EVERY_MS)
    return () => { alive = false; clearInterval(id) }
  }, [meId, !!pos])

  return realUsers
}
