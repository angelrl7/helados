export type Helado = {
  id: string
  persona: string
  heladeria: string
  sabores: string
  puntuacion: number
  foto_url: string | null
  resena: string | null
  created_at: string
}

/** Lo que se manda al insertar (el resto lo pone la base). */
export type NuevoHelado = Omit<Helado, 'id' | 'created_at'>

/** Los dos perfiles fijos de la app. */
export type Personas = { p1: string; p2: string }

export const PERSONAS_DEFAULT: Personas = { p1: 'Yo', p2: 'Mi pareja' }
