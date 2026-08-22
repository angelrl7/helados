import { useMemo, useState } from 'react'
import type { Helado, Personas } from '../types'
import { esDelMes, nombreMes } from '../lib/fecha'
import RatingEstatico from './RatingEstatico'

type Props = {
  helados: Helado[]
  personas: Personas
}

const MEDALLAS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']

export default function PantallaResumen({ helados, personas }: Props) {
  const hoy = new Date()
  const [anio, setAnio] = useState(hoy.getFullYear())
  const [mes, setMes] = useState(hoy.getMonth())

  function cambiarMes(delta: number) {
    const d = new Date(anio, mes + delta, 1)
    setAnio(d.getFullYear())
    setMes(d.getMonth())
  }

  const esMesActual = anio === hoy.getFullYear() && mes === hoy.getMonth()

  const delMes = useMemo(
    () => helados.filter((h) => esDelMes(h.created_at, anio, mes)),
    [helados, anio, mes],
  )

  const porPersona = useMemo(
    () => ({
      p1: delMes.filter((h) => h.persona === personas.p1).length,
      p2: delMes.filter((h) => h.persona === personas.p2).length,
    }),
    [delMes, personas],
  )

  /** Top 5 de heladerías del mes según el promedio de heladitos. */
  const top5 = useMemo(() => {
    const acumulado = new Map<string, { suma: number; veces: number }>()

    for (const h of delMes) {
      // Agrupamos ignorando mayúsculas/espacios para que "Verona" y "verona " sean la misma.
      const clave = h.heladeria.trim().toLowerCase()
      const actual = acumulado.get(clave) ?? { suma: 0, veces: 0 }
      acumulado.set(clave, { suma: actual.suma + h.puntuacion, veces: actual.veces + 1 })
    }

    // Nos quedamos con la primera forma de escribir el nombre que apareció.
    const nombreLindo = new Map<string, string>()
    for (const h of delMes) nombreLindo.set(h.heladeria.trim().toLowerCase(), h.heladeria.trim())

    return [...acumulado.entries()]
      .map(([clave, { suma, veces }]) => ({
        heladeria: nombreLindo.get(clave)!,
        promedio: suma / veces,
        veces,
      }))
      // Empate de promedio: gana la que se probó más veces.
      .sort((a, b) => b.promedio - a.promedio || b.veces - a.veces)
      .slice(0, 5)
  }, [delMes])

  return (
    <div className="space-y-5 px-4 pb-6">
      {/* Selector de mes */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => cambiarMes(-1)}
          aria-label="Mes anterior"
          className="toque grid w-14 shrink-0 place-items-center rounded-2xl border-2 border-white bg-white/85 text-2xl text-chocolate shadow-soft"
        >
          ‹
        </button>
        <div className="flex-1 rounded-2xl border-2 border-white bg-white/85 py-3 text-center shadow-soft">
          <p className="font-display text-lg font-700 text-chocolate">{nombreMes(anio, mes)}</p>
        </div>
        <button
          type="button"
          onClick={() => cambiarMes(1)}
          disabled={esMesActual}
          aria-label="Mes siguiente"
          className="toque grid w-14 shrink-0 place-items-center rounded-2xl border-2 border-white bg-white/85 text-2xl text-chocolate shadow-soft disabled:opacity-30"
        >
          ›
        </button>
      </div>

      {/* Total del mes */}
      <div className="rounded-2.5xl bg-gradient-to-br from-frutilla to-frutillaOscuro p-6 text-center shadow-card">
        <p className="font-display text-sm font-600 uppercase tracking-wide text-white/85">
          Helados del mes
        </p>
        <p className="font-display text-6xl font-800 leading-none text-white drop-shadow-sm">
          {delMes.length}
        </p>
        <p className="mt-1 font-display text-base font-600 text-white/90">
          {delMes.length === 1 ? 'helado entre los dos' : 'helados entre los dos'}
        </p>
      </div>

      {/* Cuántos probó cada uno */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2.5xl border-2 border-white bg-white/85 p-4 text-center shadow-soft">
          <p className="text-3xl">🍓</p>
          <p className="mt-1 truncate font-display text-sm font-600 text-cacao">{personas.p1}</p>
          <p className="font-display text-4xl font-800 text-frutillaOscuro">{porPersona.p1}</p>
        </div>
        <div className="rounded-2.5xl border-2 border-white bg-white/85 p-4 text-center shadow-soft">
          <p className="text-3xl">🍨</p>
          <p className="mt-1 truncate font-display text-sm font-600 text-cacao">{personas.p2}</p>
          <p className="font-display text-4xl font-800 text-pistachoOscuro">{porPersona.p2}</p>
        </div>
      </div>

      {/* Top 5 */}
      <section>
        <h2 className="mb-3 font-display text-2xl font-800 text-chocolate">
          🏆 Top 5 heladerías
        </h2>

        {top5.length === 0 ? (
          <div className="rounded-2.5xl border-2 border-dashed border-vainilla bg-white/60 px-4 py-10 text-center">
            <p className="text-5xl">🍦</p>
            <p className="mt-3 font-display text-lg font-700 text-chocolate">
              Nada cargado en {nombreMes(anio, mes)}
            </p>
            <p className="mt-1 text-[15px] text-cacao">A salir a probar helados.</p>
          </div>
        ) : (
          <ol className="space-y-3">
            {top5.map((item, i) => (
              <li
                key={item.heladeria}
                className="flex items-center gap-3 rounded-2.5xl border-2 border-white bg-white/85 p-4 shadow-soft"
              >
                <span className="shrink-0 text-2xl">{MEDALLAS[i]}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg font-700 leading-tight text-chocolate">
                    {item.heladeria}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <RatingEstatico valor={Math.round(item.promedio)} tamano="sm" />
                    <span className="font-display text-sm font-700 text-frutillaOscuro">
                      {item.promedio.toFixed(1)}
                    </span>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-vainilla px-3 py-1.5 font-display text-xs font-700 text-cacao">
                  {item.veces} {item.veces === 1 ? 'vez' : 'veces'}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
