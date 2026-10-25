// Pantalla en reposo para platicar cara a cara (de app uwu.html).
export default function PocketMode({ onExit }) {
  return (
    <div className="fixed inset-0 bg-slate-950 z-[60] flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="space-y-5 max-w-xs">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-orange-500">
          <i className="fa-solid fa-handshake text-2xl" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-slate-100">Modo Cara a Cara</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            Interacción en curso. Tu pantalla permanecerá en reposo para evitar distracciones.
          </p>
        </div>
        <button onClick={onExit} className="pt-6 text-xs text-slate-500 underline underline-offset-4 hover:text-slate-300 font-mono">
          Tocar para reactivar pantalla
        </button>
      </div>
    </div>
  )
}
