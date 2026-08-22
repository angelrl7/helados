import { useCallback, useEffect, useState } from 'react'
import { supabase, supabaseConfigurado, BUCKET_FOTOS } from '../lib/supabase'
import type { Helado, NuevoHelado } from '../types'

/**
 * Trae todos los helados una sola vez y los mantiene en memoria.
 * Son un par de cientos de filas como mucho: el feed y el resumen
 * filtran sobre este mismo array en vez de pegarle a la base cada vez.
 */
export function useHelados() {
  const [helados, setHelados] = useState<Helado[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const recargar = useCallback(async () => {
    if (!supabaseConfigurado) {
      setCargando(false)
      setError('Falta configurar el archivo .env con los datos de Supabase.')
      return
    }
    setCargando(true)
    const { data, error } = await supabase
      .from('helados')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else {
      setHelados(data as Helado[])
      setError(null)
    }
    setCargando(false)
  }, [])

  useEffect(() => {
    void recargar()
  }, [recargar])

  /** Inserta y mete el nuevo helado al principio del feed. */
  async function agregar(nuevo: NuevoHelado) {
    const { data, error } = await supabase.from('helados').insert(nuevo).select().single()
    if (error) throw error
    setHelados((prev) => [data as Helado, ...prev])
  }

  async function borrar(id: string) {
    const helado = helados.find((h) => h.id === id)

    const { error } = await supabase.from('helados').delete().eq('id', id)
    if (error) throw error

    // Si tenía foto, la sacamos del bucket para no dejarla huérfana.
    if (helado?.foto_url) {
      const archivo = helado.foto_url.split('/').pop()
      if (archivo) await supabase.storage.from(BUCKET_FOTOS).remove([archivo])
    }

    setHelados((prev) => prev.filter((h) => h.id !== id))
  }

  /** Al renombrar un perfil, arrastramos los registros viejos con él. */
  async function renombrarPersona(anterior: string, nueva: string) {
    if (anterior === nueva || !supabaseConfigurado) return
    const { error } = await supabase
      .from('helados')
      .update({ persona: nueva })
      .eq('persona', anterior)
    if (error) throw error
    setHelados((prev) =>
      prev.map((h) => (h.persona === anterior ? { ...h, persona: nueva } : h)),
    )
  }

  return { helados, cargando, error, recargar, agregar, borrar, renombrarPersona }
}
