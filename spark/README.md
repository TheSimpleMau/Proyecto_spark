# SPARK — conexión orgánica a menos de 50 m

Webapp (React + Vite + Tailwind) que detecta personas cercanas con intereses de nicho en común,
notifica a ambas, y si las dos aceptan abre un chat. Incluye 50 usuarios simulados, una vista de
simulación global y un panel de métricas.

| Ruta | Qué es |
|---|---|
| `/` | La app (registro → radar → match → chat). Pensada para celular. |
| `/simulacion` | Las 50 personas simuladas moviéndose y haciendo match entre ellas. |
| `/metricas` | Panel para computadora (también se ve en celular): uso real + simulación de la última hora. |

## Cómo funciona

- **Usuarios reales**: entran sin contraseña (login anónimo de Supabase). Cada 5 s publican su GPS;
  si dos están dentro del radio y comparten un interés, se crea un *match* y **Supabase Realtime**
  lo envía a los dos teléfonos al instante.
- **50 usuarios simulados**: viven en `src/data/bots.json`. No tienen GPS: guardan un desplazamiento
  en metros y se mueven con una fórmula (`botOffset` en `src/lib/geo.js`), así aparecen alrededor de
  quien esté mirando, en cualquier lugar. Aceptan, saludan y contestan solos (`src/hooks/useBotBrain.js`).
  Para no saturar, la app propone como máximo un match con bot cada 45 s (o al tocar *Simular detección cercana*).
- **Anunciantes**: al conectar con alguien por un interés patrocinado aparece una notificación push
  simulada arriba de la pantalla (`src/data/sponsors.js`).

## Puesta en marcha (una sola vez)

1. **Supabase** (gratis): crea un proyecto en https://supabase.com.
   - *Authentication → Sign In / Providers → Anonymous sign-ins*: activar.
   - *SQL Editor*: pega y corre `supabase/schema.sql`, luego `supabase/seed.sql`.
   - *Project Settings → Data API*: copia la **Project URL**. *Project Settings → API Keys*: copia la
     **publishable key** (`sb_publishable_…`) o, en proyectos viejos, la **anon public**. Nunca la *secret* / *service_role*.
2. Copia `.env.example` como `.env.local` y pega esos dos valores.
3. Corre local:
   ```bash
   npm install
   npm run dev
   ```
   Abre http://localhost:5173. Para probar dos usuarios en la misma compu usa una ventana normal y una de incógnito.
4. **Vercel**: importa el repo de GitHub, *Root Directory* = `spark`, y en *Environment Variables*
   agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Cada push a la rama de producción se publica solo.

> Supabase gratis se pausa tras ~1 semana sin uso. Entra a su panel unos días antes de presentar.

## Editar contenido

| Quiero cambiar… | Archivo | Después |
|---|---|---|
| Intereses, rompehielos, respuestas de bots | `src/data/interests.js` | `npm run bots` si cambiaste nombres de intereses |
| Nombres, cantidad o movimiento de los bots | `scripts/gen_bots.mjs` | `npm run bots` y vuelve a correr `supabase/seed.sql` en Supabase |
| Anunciantes y textos de las push | `src/data/sponsors.js` | nada |
| Distancia de match entre bots en `/simulacion` | `BOT_MATCH_DISTANCE` en `src/lib/simulation.js` | nada |
| Frecuencia de matches con bots | `BOT_COOLDOWN_MS` en `src/lib/spark.jsx` | nada |

`npm run bots` regenera `src/data/bots.json` y `supabase/seed.sql` (requiere Node 20+).

## Guion de demo con dos teléfonos

1. Abran la URL de Vercel en los dos celulares, regístrense con nombres distintos y **al menos un interés en común**.
2. Elijan *Usar mi ubicación real* y acepten el permiso. Si están en interiores y no se detectan,
   suban el alcance a 100 m o cambien ambos a *Ubicación demo* en Perfil.
3. En pocos segundos ambos reciben **¡Coincidencia cercana!** (vibra en Android). Los dos tocan *Aceptar conexión*.
4. Se abre el chat en tiempo real. Si comparten Helados/Postres, aparece la push de Dairy Queen.
5. Para mostrar escala: abran `/simulacion` (velocidad ×20) y `/metricas` en la compu.

## Estructura

```
src/
  data/        interests.js, sponsors.js, bots.json (generado)
  lib/         supabase.js, geo.js, matching.js, simulation.js, spark.jsx (estado global)
  hooks/       useGeolocation, usePresence, useMatches, useBotBrain
  screens/     Onboarding, Radar, Chats, Chat, Perfil, Simulacion, Metricas
  components/  RadarView, MatchModal, PushBanner, SponsorCard, AffinityEditor, BottomNav, PocketMode, Charts
supabase/      schema.sql, seed.sql (generado)
scripts/       gen_bots.mjs
```
