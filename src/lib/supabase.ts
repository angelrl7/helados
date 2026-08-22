import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** true cuando el .env todavía tiene los placeholders del ejemplo. */
export const supabaseConfigurado =
  Boolean(url && anonKey) && !url.includes('xxxxxxxx') && !anonKey.includes('xxxxxxxx')

export const supabase = createClient(url ?? '', anonKey ?? '')

export const BUCKET_FOTOS = 'fotos-helados'
