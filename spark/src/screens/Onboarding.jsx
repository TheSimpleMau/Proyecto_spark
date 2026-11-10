import { useState } from 'react'
import { Link } from 'react-router'
import { CATEGORIES, INTERESTS, findInterest } from '../data/interests.js'
import { useSpark } from '../lib/spark.jsx'
import { supabase } from '../lib/supabase.js'

const EMOJIS = ['⚡', '🦊', '🐼', '🐙', '🦉', '🐢', '🦋', '🐧', '🦁', '🐸', '🌵', '🌻', '🍄', '🎧', '🎨', '🛹']
const MIN = 3
const MAX = 8

export default function Onboarding() {
  const { createProfile, geo } = useSpark()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('⚡')
  const [picked, setPicked] = useState([])
  const [custom, setCustom] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  if (!supabase) return <SetupMissing />

  const toggle = (tag) => setPicked((p) => (p.includes(tag) ? p.filter((t) => t !== tag) : p.length < MAX ? [...p, tag] : p))
  const customs = picked.filter((t) => !findInterest(t))

  // Interés escrito a mano: si coincide con uno del catálogo (sin importar acentos/mayúsculas) usa ese nombre.
  function addCustom(e) {
    e.preventDefault()
    const raw = custom.trim()
    if (!raw || picked.length >= MAX) return
    const tag = findInterest(raw)?.tag ?? raw
    if (!picked.includes(tag)) setPicked([...picked, tag])
    setCustom('')
  }

  async function finish(mode) {
    setBusy(true)
    setError(null)
    geo.setMode(mode)
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission()
    try {
      await createProfile({ name: name.trim(), emoji, interests: picked })
    } catch (e) {
      setError(e.message)
      setBusy(false)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col px-5 py-8 gap-6">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/30">
          <i className="fa-solid fa-bolt" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Spark</h1>
          <p className="text-xs text-slate-500">Conexión orgánica a menos de 50 metros</p>
        </div>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-orange-500' : 'bg-slate-200'}`} />)}
      </div>

      {step === 0 && (
        <div className="space-y-5 flex-1">
          <div>
            <h2 className="text-lg font-bold">¿Cómo te llamas?</h2>
            <p className="text-xs text-slate-500">Es lo que verá la otra persona al hacer match.</p>
          </div>
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} maxLength={20} placeholder="Tu nombre"
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40" />
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Elige tu avatar</p>
            <div className="grid grid-cols-8 gap-2">
              {EMOJIS.map((e) => (
                <button key={e} onClick={() => setEmoji(e)} className={`aspect-square rounded-xl text-xl ${emoji === e ? 'bg-orange-100 ring-2 ring-orange-500' : 'bg-white border border-slate-200'}`}>{e}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-lg font-bold">Tus afinidades de nicho</h2>
              <p className="text-xs text-slate-500">Elige de {MIN} a {MAX}. Haremos match con quien comparta alguna.</p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">{picked.length} / {MAX}</span>
          </div>
          {CATEGORIES.map((cat) => (
            <div key={cat}>
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">{cat}</p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.filter((i) => i.cat === cat).map(({ tag }) => (
                  <button key={tag} onClick={() => toggle(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${picked.includes(tag) ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-slate-200 text-slate-700'}`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">Tus intereses</p>
            {customs.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {customs.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-orange-500 text-white">
                    {tag}
                    <button onClick={() => toggle(tag)} aria-label={`Quitar ${tag}`} className="text-white/80 hover:text-white">
                      <i className="fa-solid fa-xmark text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <form onSubmit={addCustom} className="flex gap-2">
              <input value={custom} onChange={(e) => setCustom(e.target.value)} maxLength={30} placeholder="¿No está el tuyo? Escríbelo"
                className="flex-1 min-w-0 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40" />
              <button disabled={!custom.trim() || picked.length >= MAX} className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1">
                <i className="fa-solid fa-plus" /> Añadir
              </button>
            </form>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-lg font-bold">Activa tu radar</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Usamos tu ubicación para encontrar personas a menos de 50 m con tus mismos gustos. Cuando haya una coincidencia, tu teléfono vibrará.
            </p>
          </div>
          <button disabled={busy} onClick={() => finish('gps')} className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-2xl text-sm flex items-center justify-center gap-2">
            <i className="fa-solid fa-location-crosshairs" /> Usar mi ubicación real
          </button>
          <button disabled={busy} onClick={() => finish('demo')} className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-2xl text-sm">
            Usar ubicación demo
          </button>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Ubicación demo: todos los que la elijan aparecen en el mismo punto. Útil si estás en interiores o sin GPS.
          </p>
          {error && <p className="text-xs text-rose-600">{error}</p>}
        </div>
      )}

      <div className="flex gap-2">
        {step > 0 && <button onClick={() => setStep(step - 1)} className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-600 text-sm">Atrás</button>}
        {step < 2 && (
          <button onClick={() => setStep(step + 1)} disabled={step === 0 ? !name.trim() : picked.length < MIN}
            className="flex-1 py-3 rounded-2xl bg-slate-900 text-white text-sm font-medium disabled:opacity-30">
            Continuar
          </button>
        )}
      </div>
      <Link to="/simulacion" className="text-center text-xs text-slate-400 underline underline-offset-4">Ver la simulación de 50 personas</Link>
    </div>
  )
}

function SetupMissing() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 text-center gap-3">
      <i className="fa-solid fa-plug-circle-xmark text-3xl text-orange-500" />
      <h1 className="font-bold">Falta conectar Supabase</h1>
      <p className="text-xs text-slate-500 max-w-xs">Copia <code>.env.example</code> como <code>.env.local</code> con la URL y la anon key de tu proyecto (ver README).</p>
      <Link to="/simulacion" className="text-xs text-orange-600 underline">La simulación sí funciona sin conexión →</Link>
    </div>
  )
}
