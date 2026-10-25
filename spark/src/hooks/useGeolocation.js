import { useEffect, useState } from 'react'

// Punto usado cuando no hay GPS ("ubicación demo"). Todos los que la usen quedan a pocos metros entre sí.
const DEMO_POINT = { lat: 19.4326, lng: -99.1332 }

// Solo pide permiso cuando `enabled` (ya hay perfil), para no preguntar en /metricas o /simulacion.
export function useGeolocation(enabled) {
  const [mode, setMode] = useState(() => localStorage.getItem('spark-loc') ?? 'gps')
  const [pos, setPos] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    localStorage.setItem('spark-loc', mode)
    if (!enabled) return
    if (mode === 'demo') {
      // Se desplaza hasta ~4 m del punto demo para que no queden exactamente encima.
      setPos({ lat: DEMO_POINT.lat + (Math.random() - 0.5) * 0.00007, lng: DEMO_POINT.lng + (Math.random() - 0.5) * 0.00007, accuracy: 0, demo: true })
      setError(null)
      return
    }
    if (!('geolocation' in navigator)) {
      setError('Este navegador no tiene GPS.')
      return
    }
    const id = navigator.geolocation.watchPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: Math.round(p.coords.accuracy) })
        setError(null)
      },
      (e) => setError(e.code === 1 ? 'Permiso de ubicación denegado.' : 'No se pudo obtener tu ubicación.'),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    )
    return () => navigator.geolocation.clearWatch(id)
  }, [mode, enabled])

  return { pos, error, mode, setMode }
}
