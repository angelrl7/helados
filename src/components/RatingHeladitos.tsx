import { useState } from 'react'
import Heladito from './Heladito'

const LEYENDAS = ['', 'Meh…', 'Está bien', 'Rico', 'Muy rico', '¡De otro planeta!']

type Props = {
  valor: number
  onChange: (v: number) => void
}

/** Escala de 1 a 5 heladitos, tappables. */
export default function RatingHeladitos({ valor, onChange }: Props) {
  const [ultimoTocado, setUltimoTocado] = useState<number | null>(null)

  function tocar(n: number) {
    // Volver a tocar el heladito activo lo desmarca (vuelve a 0).
    const nuevo = n === valor ? 0 : n
    onChange(nuevo)
    setUltimoTocado(nuevo === 0 ? null : n)
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => tocar(n)}
            aria-label={`${n} heladito${n > 1 ? 's' : ''}`}
            aria-pressed={valor >= n}
            className="flex-1 rounded-2xl py-2 active:scale-90 transition-transform"
          >
            <Heladito
              lleno={valor >= n}
              className={`mx-auto h-11 w-auto ${ultimoTocado === n ? 'animar-pop' : ''}`}
            />
          </button>
        ))}
      </div>
      <p
        className={`mt-1 text-center font-display text-sm font-600 transition-colors ${
          valor > 0 ? 'text-frutillaOscuro' : 'text-cacao/50'
        }`}
      >
        {valor > 0 ? LEYENDAS[valor] : 'Tocá los heladitos para puntuar'}
      </p>
    </div>
  )
}
