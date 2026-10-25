import { useState } from 'react'
import { TAGS, findInterest } from '../data/interests.js'

const MAX = 8

// "Mis afinidades de nicho": chips con quitar + campo para añadir (sugiere del catálogo).
export default function AffinityEditor({ interests, onChange }) {
  const [value, setValue] = useState('')

  function add(e) {
    e.preventDefault()
    const raw = value.trim()
    if (!raw || interests.length >= MAX) return
    const tag = findInterest(raw)?.tag ?? raw // usa el nombre del catálogo si coincide
    if (!interests.includes(tag)) onChange([...interests, tag])
    setValue('')
  }

  return (
    <section className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Mis afinidades de nicho</h2>
          <p className="text-xs text-slate-600">Intereses específicos para romper el hielo</p>
        </div>
        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">{interests.length} / {MAX}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {interests.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-800 text-xs font-medium">
            {tag}
            <button onClick={() => onChange(interests.filter((t) => t !== tag))} aria-label={`Quitar ${tag}`} className="text-slate-400 hover:text-rose-500">
              <i className="fa-solid fa-xmark text-xs" />
            </button>
          </span>
        ))}
      </div>
      <form onSubmit={add} className="flex gap-2">
        <input value={value} onChange={(e) => setValue(e.target.value)} list="catalogo" placeholder="Ej: Teclados Mecánicos, Ramen…"
          className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:bg-white" />
        <datalist id="catalogo">{TAGS.filter((t) => !interests.includes(t)).map((t) => <option key={t} value={t} />)}</datalist>
        <button disabled={interests.length >= MAX} className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1">
          <i className="fa-solid fa-plus" /> Añadir
        </button>
      </form>
    </section>
  )
}
