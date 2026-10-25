import { NavLink } from 'react-router'
import { matchView } from '../hooks/useMatches.js'
import { useSpark } from '../lib/spark.jsx'

const ITEMS = [
  { to: '/', icon: 'fa-location-crosshairs', label: 'Radar' },
  { to: '/chats', icon: 'fa-comments', label: 'Chats' },
  { to: '/simulacion', icon: 'fa-people-group', label: 'Simulación' },
  { to: '/perfil', icon: 'fa-user', label: 'Perfil' },
]

export default function BottomNav() {
  const { matches, me } = useSpark()
  const pending = matches.filter((m) => matchView(m, me.id).status === 'pending').length
  return (
    <nav className="sticky bottom-0 z-20 bg-white/95 backdrop-blur border-t border-slate-200 grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
      {ITEMS.map((it) => (
        <NavLink key={it.to} to={it.to} end={it.to === '/'}
          className={({ isActive }) => `relative py-2.5 flex flex-col items-center gap-1 text-[10px] font-medium ${isActive ? 'text-orange-600' : 'text-slate-400'}`}>
          <i className={`fa-solid ${it.icon} text-base`} />
          {it.label}
          {it.to === '/chats' && pending > 0 && (
            <span className="absolute top-1.5 right-[calc(50%-18px)] min-w-4 h-4 px-1 rounded-full bg-orange-500 text-white text-[10px] leading-4 text-center">{pending}</span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
