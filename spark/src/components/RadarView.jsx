// Radar en SVG: yo al centro, el borde es mi radio de búsqueda.
// Naranja = comparte intereses, verde = usuario real, gris = sin intereses en común.
const SIZE = 240
const R = 100

export default function RadarView({ people, radius }) {
  const scale = R / radius
  const visible = people.filter((p) => p.distance <= radius * 1.2)
  return (
    <svg viewBox={`${-SIZE / 2} ${-SIZE / 2} ${SIZE} ${SIZE}`} className="w-full max-w-[260px] mx-auto">
      <defs>
        <radialGradient id="rg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="100%" stopColor="#ffedd5" />
        </radialGradient>
        <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.35" />
        </linearGradient>
        <clipPath id="clip"><circle r={R + 8} /></clipPath>
      </defs>
      <circle r={R} fill="url(#rg)" stroke="#fdba74" strokeWidth="1" />
      <circle r={R * 0.66} fill="none" stroke="#fed7aa" strokeDasharray="3 4" />
      <circle r={R * 0.33} fill="none" stroke="#fed7aa" strokeDasharray="3 4" />
      <g className="radar-sweep"><path d={`M0 0 L${R} 0 A${R} ${R} 0 0 0 ${R * Math.cos(-0.6)} ${R * Math.sin(-0.6)} Z`} fill="url(#sweep)" /></g>
      <text x="0" y={-R - 4} textAnchor="middle" className="fill-orange-400 font-mono" fontSize="8">{radius} m</text>
      <g clipPath="url(#clip)">
        {visible.map((p) => {
          const x = p.dx * scale
          const y = -p.dy * scale
          const fill = !p.isBot ? '#10b981' : p.shared.length ? '#f97316' : '#cbd5e1'
          return (
            <g key={p.id} style={{ transition: 'transform 2s linear', transform: `translate(${x}px, ${y}px)` }} opacity={p.distance > radius ? 0.35 : 1}>
              {!p.isBot && <circle r="9" fill="none" stroke="#10b981" strokeOpacity="0.4" />}
              <circle r={p.shared.length || !p.isBot ? 5 : 3.5} fill={fill} stroke="#fff" strokeWidth="1.5" />
            </g>
          )
        })}
      </g>
      <circle r="7" fill="#0f172a" stroke="#fff" strokeWidth="2" />
    </svg>
  )
}
