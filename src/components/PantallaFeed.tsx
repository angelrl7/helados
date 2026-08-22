import { useMemo, useState } from 'react'
import type { Helado, Personas } from '../types'
import TarjetaHelado from './TarjetaHelado'

type Props = {
  helados: Helado[]
  personas: Personas
  cargando: boolean
  onBorrar: (id: string) => void
}

type Filtro = 'todos' | string

export default function PantallaFeed({ helados, personas, cargando, onBorrar }: Props) {
  const [filtro, setFiltro] = useState<Filtro>('todos')

  // Ya vienen ordenados del más reciente al más viejo desde la base.
  const visibles = useMemo(
    () => (filtro === 'todos' ? helados : helados.filter((h) => h.persona === filtro)),
    [helados, filtro],
  )

  const opciones: { valor: Filtro; texto: string }[] = [
    { valor: 'todos', texto: 'Todos' },
    { valor: personas.p1, texto: personas.p1 },
    { valor: personas.p2, texto: personas.p2 },
  ]

  return (
    <div className="px-4 pb-6">
      {/* Filtro por persona, pegajoso arriba mientras scrolleás. */}
      <div className="sticky top-[68px] z-10 -mx-4 mb-4 bg-crema/85 px-4 py-3 backdrop-blur-md">
        <div className="sin-scrollbar flex gap-2 overflow-x-auto">
          {opciones.map((o) => {
            const activo = filtro === o.valor
            return (
              <button
                key={o.valor}
                type="button"
                onClick={() => setFiltro(o.valor)}
                className={`shrink-0 rounded-full px-5 py-2.5 font-display text-[15px] font-600 transition
                  ${activo
                    ? 'bg-chocolate text-crema shadow-soft'
                    : 'border-2 border-vainilla bg-white/80 text-cacao'}`}
              >
                {o.texto}
              </button>
            )
          })}
        </div>
      </div>

      {cargando ? (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="tarjeta animate-pulse">
              <div className="aspect-[4/3] w-full bg-vainilla" />
              <div className="space-y-3 p-4">
                <div className="h-6 w-2/3 rounded-full bg-vainilla" />
                <div className="h-4 w-1/2 rounded-full bg-vainilla" />
              </div>
            </div>
          ))}
        </div>
      ) : visibles.length === 0 ? (
        <div className="mt-10 text-center">
          <div className="text-6xl">🍨</div>
          <p className="mt-4 font-display text-xl font-700 text-chocolate">
            {filtro === 'todos' ? 'Todavía no hay helados' : `${filtro} no cargó nada todavía`}
          </p>
          <p className="mt-1 text-[15px] text-cacao">
            Andá a “Cargar” y sumá el primero.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {visibles.map((h) => (
            <TarjetaHelado
              key={h.id}
              helado={h}
              esPrimeraPersona={h.persona === personas.p1}
              onBorrar={onBorrar}
            />
          ))}
        </div>
      )}
    </div>
  )
}
