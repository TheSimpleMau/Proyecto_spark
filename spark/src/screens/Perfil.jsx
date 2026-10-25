import { Link } from 'react-router'
import AffinityEditor from '../components/AffinityEditor.jsx'
import { useSpark } from '../lib/spark.jsx'

export default function Perfil() {
  const { me, geo, updateProfile, signOut } = useSpark()
  return (
    <div className="px-4 py-5 space-y-5">
      <div className="flex items-center gap-3">
        <span className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-3xl">{me.emoji}</span>
        <div>
          <h1 className="text-lg font-bold">{me.name}</h1>
          <p className="text-xs text-slate-500">Radio de búsqueda: {me.radius} m</p>
        </div>
      </div>

      <AffinityEditor interests={me.interests} onChange={(interests) => updateProfile({ interests })} />

      <section className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Ubicación</h2>
        <div className="grid grid-cols-2 gap-2">
          {[['gps', 'GPS real'], ['demo', 'Ubicación demo']].map(([mode, label]) => (
            <button key={mode} onClick={() => geo.setMode(mode)}
              className={`py-2.5 rounded-xl text-xs font-medium border ${geo.mode === mode ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-slate-200 text-slate-600'}`}>
              {label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-slate-400 font-mono">
          {geo.error ?? (geo.pos ? `${geo.pos.lat.toFixed(5)}, ${geo.pos.lng.toFixed(5)}${geo.pos.accuracy ? ` · ±${geo.pos.accuracy} m` : ''}` : 'Sin ubicación todavía')}
        </p>
      </section>

      <section className="grid grid-cols-2 gap-2">
        <Link to="/simulacion" className="p-4 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-700 flex flex-col gap-2">
          <i className="fa-solid fa-people-group text-orange-500 text-lg" /> Simulación de 50 personas
        </Link>
        <Link to="/metricas" className="p-4 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-700 flex flex-col gap-2">
          <i className="fa-solid fa-chart-column text-orange-500 text-lg" /> Métricas
        </Link>
      </section>

      <button onClick={signOut} className="w-full py-3 rounded-2xl bg-slate-100 text-slate-600 text-xs font-medium">
        Cerrar sesión (crear otro usuario)
      </button>
    </div>
  )
}
