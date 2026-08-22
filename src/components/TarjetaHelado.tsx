import { useState } from 'react'
import type { Helado } from '../types'
import { formatearFecha } from '../lib/fecha'
import RatingEstatico from './RatingEstatico'

type Props = {
  helado: Helado
  esPrimeraPersona: boolean
  onBorrar: (id: string) => void
}

export default function TarjetaHelado({ helado, esPrimeraPersona, onBorrar }: Props) {
  const [confirmando, setConfirmando] = useState(false)

  const colorPersona = esPrimeraPersona
    ? 'bg-frutilla/20 text-frutillaOscuro'
    : 'bg-pistacho/40 text-pistachoOscuro'

  return (
    <article className="tarjeta animar-subir">
      {helado.foto_url && (
        // Full-bleed: la foto ocupa todo el ancho de la tarjeta, sin margen.
        <img
          src={helado.foto_url}
          alt={`${helado.sabores} de ${helado.heladeria}`}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
      )}

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-2xl font-700 leading-tight text-chocolate">
              {helado.heladeria}
            </h3>
            <p className="mt-0.5 text-[15px] font-500 text-cacao">{helado.sabores}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1.5 font-display text-xs font-700 ${colorPersona}`}
          >
            {helado.persona}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <RatingEstatico valor={helado.puntuacion} />
          <span className="text-sm font-500 text-cacao/70">{formatearFecha(helado.created_at)}</span>
        </div>

        {helado.resena && (
          <p className="rounded-2xl bg-vainilla/60 px-4 py-3 text-[15px] leading-relaxed text-chocolate/90">
            “{helado.resena}”
          </p>
        )}

        {confirmando ? (
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setConfirmando(false)}
              className="toque flex-1 rounded-2xl border-2 border-vainilla bg-white font-display text-sm font-600 text-cacao"
            >
              Mejor no
            </button>
            <button
              type="button"
              onClick={() => onBorrar(helado.id)}
              className="toque flex-1 rounded-2xl bg-frutillaOscuro font-display text-sm font-600 text-white"
            >
              Sí, borrar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            className="text-sm font-600 text-cacao/50 underline underline-offset-2"
          >
            Borrar
          </button>
        )}
      </div>
    </article>
  )
}
