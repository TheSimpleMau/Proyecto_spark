import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// null si falta configurar .env.local (la simulación y las métricas simuladas siguen funcionando).
export const supabase = url && key ? createClient(url, key) : null
