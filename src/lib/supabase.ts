import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** true cuando el .env está completo (y no con los placeholders del ejemplo). */
export const supabaseConfigurado =
  Boolean(url && anonKey) && !url.includes('xxxxxxxx') && !anonKey.includes('xxxxxxxx')

// Si falta la config, createClient() tira "supabaseUrl is required" al importar,
// antes de que React renderice: pantalla en blanco y sólo un error en consola.
// Con valores de relleno el módulo carga igual y App muestra el cartel que explica qué falta.
export const supabase = supabaseConfigurado
  ? createClient(url, anonKey)
  : createClient('https://sin-configurar.supabase.co', 'sin-configurar')

export const BUCKET_FOTOS = 'fotos-helados'
