import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import BottomNav from './components/BottomNav.jsx'
import MatchModal from './components/MatchModal.jsx'
import PocketMode from './components/PocketMode.jsx'
import PushBanner from './components/PushBanner.jsx'
import './index.css'
import { SparkProvider, useSpark } from './lib/spark.jsx'
import Chat from './screens/Chat.jsx'
import Chats from './screens/Chats.jsx'
import Metricas from './screens/Metricas.jsx'
import Onboarding from './screens/Onboarding.jsx'
import Perfil from './screens/Perfil.jsx'
import Radar from './screens/Radar.jsx'
import Simulacion from './screens/Simulacion.jsx'

// Marco tipo celular para las pantallas de la app (en computadora se ve centrado).
function PhoneApp() {
  const { ready, me, geo } = useSpark()
  const [pocket, setPocket] = useState(false)
  if (!ready) return <div className="min-h-dvh flex items-center justify-center text-orange-500"><i className="fa-solid fa-bolt fa-beat text-2xl" /></div>
  return (
    <div className="h-dvh flex flex-col max-w-md mx-auto bg-white shadow-xl border-x border-slate-200 overflow-hidden">
      {!me ? <div className="flex-1 overflow-y-auto"><Onboarding /></div> : (
        <>
          <header className="px-4 py-3 bg-white/90 backdrop-blur border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20"><i className="fa-solid fa-bolt text-xs" /></div>
              <div>
                <p className="text-base font-bold tracking-tight leading-none">Spark</p>
                <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Radar activo ({me.radius} m)
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200/60">
              <i className={`fa-solid ${geo.mode === 'demo' ? 'fa-flask' : 'fa-location-dot'} text-emerald-500 text-[10px] mr-1`} />{me.emoji} {me.name}
            </span>
          </header>
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route index element={<Radar />} />
              <Route path="chats" element={<Chats />} />
              <Route path="chats/:id" element={<Chat />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="*" element={<Radar />} />
            </Routes>
          </main>
          <BottomNav />
          <MatchModal onPocket={() => setPocket(true)} />
          <PushBanner />
          {pocket && <PocketMode onExit={() => setPocket(false)} />}
        </>
      )}
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SparkProvider>
        <Routes>
          <Route path="/simulacion" element={<Simulacion />} />
          <Route path="/metricas" element={<Metricas />} />
          <Route path="/*" element={<PhoneApp />} />
        </Routes>
      </SparkProvider>
    </BrowserRouter>
  </StrictMode>,
)
