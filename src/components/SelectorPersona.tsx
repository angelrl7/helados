import { useState } from 'react'
import type { Personas } from '../types'

type Props = {
  personas: Personas
  onElegir: (nombre: string) => void
  onRenombrar: (cual: keyof Personas, nombre: string) => void
}

const ESTILOS = {
  p1: {
    fondo: 'from-frutilla to-[#FFB3C6]',
    borde: 'border-frutilla',
    emoji: '🍓',
  },
  p2: {
    fondo: 'from-pistachoOscuro to-pistacho',
    borde: 'border-pistachoOscuro',
    emoji: '🍨',
  },
} as const

/** Pantalla de entrada: ¿quién está cargando? Sin login, sólo dos tarjetones. */
export default function SelectorPersona({ personas, onElegir, onRenombrar }: Props) {
  const [editando, setEditando] = useState<keyof Personas | null>(null)
  const [borrador, setBorrador] = useState('')

  function empezarEdicion(cual: keyof Personas) {
    setEditando(cual)
    setBorrador(personas[cual])
  }

  function confirmarEdicion() {
    if (editando) onRenombrar(editando, borrador)
    setEditando(null)
  }

  return (
    <div className="flex min-h-[100dvh] flex-col justify-center px-6 py-10">
      <div className="mx-auto w-full max-w-md">
        <header className="mb-10 text-center animar-subir">
          <div className="text-6xl">🍦</div>
          <h1 className="mt-3 font-display text-4xl font-800 text-chocolate">Heladómetro</h1>
          <p className="mt-2 font-display text-base font-500 text-cacao">
            Las heladerías de San Juan, puntuadas de a dos
          </p>
        </header>

        <p className="mb-4 text-center font-display text-lg font-600 text-chocolate">
          ¿Quién está cargando?
        </p>

        <div className="space-y-4">
          {(['p1', 'p2'] as const).map((cual) => {
            const estilo = ESTILOS[cual]
            const enEdicion = editando === cual

            return (
              <div key={cual} className="animar-subir">
                {enEdicion ? (
                  <div className={`rounded-2.5xl border-2 ${estilo.borde} bg-white p-4 shadow-soft`}>
                    <label className="etiqueta">Nombre del perfil</label>
                    <input
                      autoFocus
                      value={borrador}
                      onChange={(e) => setBorrador(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && confirmarEdicion()}
                      maxLength={24}
                      className="campo"
                    />
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditando(null)}
                        className="toque flex-1 rounded-2xl border-2 border-vainilla bg-white font-display font-600 text-cacao"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={confirmarEdicion}
                        className="toque flex-1 rounded-2xl bg-chocolate font-display font-600 text-crema"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onElegir(personas[cual])}
                      className={`flex flex-1 items-center gap-4 rounded-2.5xl bg-gradient-to-br ${estilo.fondo}
                                  px-5 py-6 text-left shadow-card transition-transform active:scale-[0.97]`}
                    >
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/40 text-3xl">
                        {estilo.emoji}
                      </span>
                      <span className="font-display text-2xl font-700 text-white drop-shadow-sm">
                        {personas[cual]}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => empezarEdicion(cual)}
                      aria-label={`Cambiar el nombre de ${personas[cual]}`}
                      className="toque grid w-12 shrink-0 place-items-center rounded-2xl border-2 border-vainilla bg-white/80 text-xl shadow-soft"
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className="mt-8 text-center text-sm text-cacao/70">
          Después lo podés cambiar desde el ícono de arriba a la derecha.
        </p>
      </div>
    </div>
  )
}
