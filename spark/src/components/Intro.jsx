// Explicación breve que aparece cada vez que se abre la app. Para cambiar los textos edita STEPS.
const STEPS = [
  { icon: 'fa-tags', title: 'Elige tus afinidades', text: 'Selecciona de 3 a 8 intereses de nicho: lo que de verdad te apasiona.' },
  { icon: 'fa-location-crosshairs', title: 'El radar busca cerca', text: 'Detecta a personas a menos de 50 m que comparten al menos uno de tus gustos.' },
  { icon: 'fa-bell', title: 'Los dos reciben la chispa', text: 'Ambos reciben una notificación con lo que tienen en común y un rompehielos.' },
  { icon: 'fa-comments', title: 'Conecten y platiquen', text: 'Si los dos aceptan, se abre el chat. La idea: guardar el celular y hablar cara a cara.' },
]

export default function Intro({ onStart }) {
  return (
    <div className="slide-up flex-1 min-h-0 flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-4 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
            <i className="fa-solid fa-bolt text-2xl" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Bienvenido a Spark</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Encuentra a personas cercanas con tus mismos gustos y convierte una coincidencia en una conversación real.
          </p>
        </div>

        <ol className="space-y-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-3 items-start bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5">
              <span className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <i className={`fa-solid ${s.icon}`} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{i + 1}. {s.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="text-[11px] text-center text-slate-400 leading-relaxed">
          Prototipo: además de usuarios reales, incluye 50 personas simuladas a tu alrededor para que puedas probarlo en cualquier lugar.
        </p>
      </div>

      <div className="px-6 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-slate-100">
        <button onClick={onStart} className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl text-sm shadow-lg shadow-orange-500/20">
          Comenzar
        </button>
      </div>
    </div>
  )
}
