import { useState } from 'react'
import { useHelados } from './hooks/useHelados'
import { usePersonas } from './hooks/usePersonas'
import { supabaseConfigurado } from './lib/supabase'
import type { Personas } from './types'
import SelectorPersona from './components/SelectorPersona'
import PantallaCargar from './components/PantallaCargar'
import PantallaFeed from './components/PantallaFeed'
import PantallaResumen from './components/PantallaResumen'
import BarraTabs, { type Tab } from './components/BarraTabs'

const TITULOS: Record<Tab, string> = {
  cargar: 'Nuevo helado',
  feed: 'Nuestros helados',
  resumen: 'Resumen del mes',
}

export default function App() {
  const { personas, activa, elegir, salir, renombrar } = usePersonas()
  const { helados, cargando, error, agregar, borrar, renombrarPersona } = useHelados()
  const [tab, setTab] = useState<Tab>('cargar')

  /** Al renombrar un perfil arrastramos también sus registros ya guardados. */
  async function handleRenombrar(cual: keyof Personas, nombre: string) {
    const cambio = renombrar(cual, nombre)
    if (cambio) await renombrarPersona(cambio.anterior, cambio.nueva).catch(() => {})
  }

  if (!supabaseConfigurado) {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-6 text-center">
        <div className="text-6xl">🔌</div>
        <h1 className="mt-4 font-display text-2xl font-800 text-chocolate">Falta conectar Supabase</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-cacao">
          Copiá <code className="rounded bg-vainilla px-1.5 py-0.5">.env.example</code> como{' '}
          <code className="rounded bg-vainilla px-1.5 py-0.5">.env</code> y completá{' '}
          <strong>VITE_SUPABASE_URL</strong> y <strong>VITE_SUPABASE_ANON_KEY</strong>. Después
          reiniciá <code className="rounded bg-vainilla px-1.5 py-0.5">npm run dev</code>.
        </p>
      </div>
    )
  }

  if (!activa) {
    return <SelectorPersona personas={personas} onElegir={elegir} onRenombrar={handleRenombrar} />
  }

  return (
    <div className="mx-auto min-h-[100dvh] max-w-md pb-24">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-crema/85 px-4 py-3 backdrop-blur-md">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-800 leading-tight text-chocolate">
            {TITULOS[tab]}
          </h1>
          <p className="truncate font-display text-xs font-600 text-cacao">
            Cargando como <span className="text-frutillaOscuro">{activa}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={salir}
          aria-label="Cambiar de persona"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-white bg-white/85 text-xl shadow-soft active:scale-90 transition-transform"
        >
          🔄
        </button>
      </header>

      {error && (
        <p className="mx-4 mb-4 rounded-2xl border-2 border-frutilla/40 bg-frutilla/10 px-4 py-3 text-center text-sm font-600 text-frutillaOscuro">
          {error}
        </p>
      )}

      <main>
        {tab === 'cargar' && (
          <PantallaCargar persona={activa} onGuardado={agregar} onListo={() => setTab('feed')} />
        )}
        {tab === 'feed' && (
          <PantallaFeed
            helados={helados}
            personas={personas}
            cargando={cargando}
            onBorrar={(id) => void borrar(id)}
          />
        )}
        {tab === 'resumen' && <PantallaResumen helados={helados} personas={personas} />}
      </main>

      <BarraTabs activa={tab} onCambiar={setTab} />
    </div>
  )
}
