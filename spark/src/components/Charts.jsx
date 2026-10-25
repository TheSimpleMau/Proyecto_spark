// Gráficas sencillas de una sola serie (un solo tono naranja, sin librerías).

// Barras horizontales ordenadas: [[etiqueta, valor], ...]
export function Bars({ data, empty = 'Sin datos todavía' }) {
  if (!data.length) return <p className="text-xs text-slate-400 italic">{empty}</p>
  const max = Math.max(...data.map(([, v]) => v))
  return (
    <ul className="space-y-2">
      {data.map(([label, v]) => (
        <li key={label} className="text-xs" title={`${label}: ${v}`}>
          <div className="flex justify-between gap-2 text-slate-600 mb-1">
            <span className="truncate">{label}</span>
            <span className="font-mono text-slate-800">{v}</span>
          </div>
          <div className="h-2 rounded bg-slate-100">
            <div className="h-2 rounded-r bg-orange-500" style={{ width: `${(v / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

// Columnas en el tiempo con tooltip al pasar el cursor: [{ label, value }]; `axis` = textos de los extremos
export function Columns({ data, unit = '', axis = [data[0]?.label, data.at(-1)?.label] }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <div>
      <div className="h-40 flex items-end gap-[2px] border-b border-slate-200">
        {data.map((d, i) => (
          <div key={i} className="group relative flex-1 h-full flex items-end">
            <div className="w-full rounded-t bg-orange-500 group-hover:bg-orange-600 min-h-px" style={{ height: `${(d.value / max) * 100}%` }} />
            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap rounded-md bg-slate-900 text-white text-[11px] px-2 py-1 z-10">
              {d.label}: <strong>{d.value}</strong>{unit}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
        <span>{axis[0]}</span><span>{axis[1]}</span>
      </div>
    </div>
  )
}

export function Stat({ label, value, hint }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      {hint && <p className="text-[11px] text-slate-500 mt-0.5">{hint}</p>}
    </div>
  )
}
