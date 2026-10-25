// Tarjeta del patrocinador (de app uwu.html).
export default function SponsorCard({ onTry }) {
  return (
    <section className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold tracking-wider uppercase bg-blue-600 text-white px-2 py-0.5 rounded-md">
          Patrocinado • Beneficio Cercano
        </span>
        <span className="text-[11px] font-semibold text-blue-700 flex items-center gap-1">
          <i className="fa-solid fa-store text-blue-500" /> Dairy Queen
        </span>
      </div>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-red-500 text-white flex items-center justify-center shrink-0 shadow-md">
          <i className="fa-solid fa-ice-cream" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-slate-900">10% OFF en Dairy Queen 🍦</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Si conectas con alguien y comparten el gusto por <strong className="text-slate-900">Helados</strong>, <strong className="text-slate-900">Malteadas</strong> o <strong className="text-slate-900">Postres</strong>, ¡obtienen ambos un 10% de descuento para romper el hielo!
          </p>
        </div>
      </div>
      <button onClick={onTry} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-2">
        <i className="fa-solid fa-wand-magic-sparkles text-amber-300" /> Probar Coincidencia con Helados
      </button>
    </section>
  )
}
