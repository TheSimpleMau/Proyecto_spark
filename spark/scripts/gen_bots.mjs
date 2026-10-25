// Genera los 50 usuarios simulados de SPARK.
//   Salidas: src/data/bots.json (lo usa la app) y supabase/seed.sql (se pega en Supabase).
//   Regenerar: npm run bots   (o: node scripts/gen_bots.mjs)
//   Para cambiar nombres, cantidad o rango de movimiento edita las constantes de abajo.
//   La semilla fija hace que siempre salgan los mismos bots; cámbiala para otra combinación.
//   Si regeneras, vuelve a correr supabase/seed.sql en Supabase.
import { writeFileSync } from 'node:fs'
import { TAGS } from '../src/data/interests.js'

const SEED = 2026
const PLAZA = 100 // la plaza va de -100 a 100 m alrededor de quien mira

const NAMES = [
  'Ana', 'Diego', 'Valeria', 'Santiago', 'Camila', 'Mateo', 'Ximena', 'Emiliano', 'Renata', 'Leonardo',
  'Regina', 'Sebastián', 'Mariana', 'Iker', 'Sofía', 'Andrés', 'Daniela', 'Rodrigo', 'Fernanda', 'Pablo',
  'Natalia', 'Emilio', 'Andrea', 'Joaquín', 'Paula', 'Gael', 'Lucía', 'Bruno', 'Victoria', 'Tomás',
  'Itzel', 'Héctor', 'Alejandra', 'Luis', 'Montserrat', 'Iván', 'Carolina', 'Óscar', 'Frida', 'Rafael',
  'Abril', 'Marco', 'Jimena', 'Arturo', 'Paola', 'Gerardo', 'Elena', 'Julián', 'Daniel', 'Majo',
]
const EMOJIS = ['🦊', '🐼', '🐙', '🦉', '🐢', '🦋', '🐧', '🦁', '🐨', '🐸', '🦄', '🐝', '🐳', '🦜', '🐯', '🌵', '🌻', '🍄', '⚡', '🎧']

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(SEED)
const between = (a, b) => a + rand() * (b - a)
const round = (n) => Math.round(n * 1000) / 1000

function pickInterests() {
  const n = 3 + Math.floor(rand() * 4) // 3 a 6
  const pool = [...TAGS]
  const out = []
  while (out.length < n) out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0])
  return out
}

const bots = NAMES.map((name, i) => {
  const ring = Math.sqrt(rand()) * (PLAZA - 30)
  const ang = rand() * Math.PI * 2
  const period = () => between(120, 420) // segundos por vuelta
  return {
    id: `00000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`,
    name,
    age: 18 + Math.floor(rand() * 12),
    emoji: EMOJIS[Math.floor(rand() * EMOJIS.length)],
    interests: pickInterests(),
    move: {
      cx: round(Math.cos(ang) * ring), cy: round(Math.sin(ang) * ring),
      rx: round(between(6, 28)), ry: round(between(6, 28)),
      wx: round((2 * Math.PI) / period()), wy: round((2 * Math.PI) / period()),
      px: round(rand() * Math.PI * 2), py: round(rand() * Math.PI * 2),
    },
  }
})

writeFileSync(new URL('../src/data/bots.json', import.meta.url), JSON.stringify(bots, null, 1) + '\n')

const sqlStr = (s) => `'${s.replace(/'/g, "''")}'`
const rows = bots.map((b) =>
  `  (${sqlStr(b.id)}, ${sqlStr(b.name)}, ${sqlStr(b.emoji)}, array[${b.interests.map(sqlStr).join(', ')}], true)`,
)
const sql = `-- Generado por scripts/gen_bots.mjs — no editar a mano.
-- Pegar en Supabase → SQL Editor después de schema.sql.
insert into public.profiles (id, name, emoji, interests, is_bot) values
${rows.join(',\n')}
on conflict (id) do update set name = excluded.name, emoji = excluded.emoji, interests = excluded.interests;
`
writeFileSync(new URL('../supabase/seed.sql', import.meta.url), sql)
console.log(`${bots.length} bots → src/data/bots.json y supabase/seed.sql`)
