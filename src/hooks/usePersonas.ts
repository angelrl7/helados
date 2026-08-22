import { useState } from 'react'
import { PERSONAS_DEFAULT, type Personas } from '../types'

const CLAVE_NOMBRES = 'heladometro:personas'
const CLAVE_ACTIVA = 'heladometro:persona-activa'

function leer<T>(clave: string, porDefecto: T): T {
  try {
    const raw = localStorage.getItem(clave)
    return raw ? (JSON.parse(raw) as T) : porDefecto
  } catch {
    return porDefecto
  }
}

function guardar(clave: string, valor: unknown) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    /* modo incógnito o storage bloqueado: seguimos igual, sólo no persiste */
  }
}

/**
 * Los dos perfiles fijos + quién está cargando ahora.
 * Todo vive en localStorage, así el celu se acuerda de quién sos.
 */
export function usePersonas() {
  const [personas, setPersonas] = useState<Personas>(() => leer(CLAVE_NOMBRES, PERSONAS_DEFAULT))
  const [activa, setActiva] = useState<string | null>(() => leer<string | null>(CLAVE_ACTIVA, null))

  function elegir(nombre: string) {
    setActiva(nombre)
    guardar(CLAVE_ACTIVA, nombre)
  }

  function salir() {
    setActiva(null)
    guardar(CLAVE_ACTIVA, null)
  }

  function renombrar(cual: keyof Personas, nombre: string) {
    const limpio = nombre.trim()
    if (!limpio) return null

    const anterior = personas[cual]
    const nuevas = { ...personas, [cual]: limpio }
    setPersonas(nuevas)
    guardar(CLAVE_NOMBRES, nuevas)

    if (activa === anterior) elegir(limpio)
    return { anterior, nueva: limpio }
  }

  return { personas, activa, elegir, salir, renombrar }
}
