import { useRef, useState } from 'react'
import { supabase, BUCKET_FOTOS } from '../lib/supabase'
import { comprimirImagen } from '../lib/imagen'
import type { NuevoHelado } from '../types'
import RatingHeladitos from './RatingHeladitos'

type Props = {
  persona: string
  onGuardado: (nuevo: NuevoHelado) => Promise<void>
  onListo: () => void
}

const HOY = () =>
  new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })

export default function PantallaCargar({ persona, onGuardado, onListo }: Props) {
  const [heladeria, setHeladeria] = useState('')
  const [sabores, setSabores] = useState('')
  const [puntuacion, setPuntuacion] = useState(0)
  const [resena, setResena] = useState('')
  const [foto, setFoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputFoto = useRef<HTMLInputElement>(null)

  function elegirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFoto(file)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(file))
  }

  function quitarFoto() {
    if (preview) URL.revokeObjectURL(preview)
    setFoto(null)
    setPreview(null)
    if (inputFoto.current) inputFoto.current.value = ''
  }

  /** Sube la foto al bucket y devuelve la URL pública. */
  async function subirFoto(file: File): Promise<string> {
    const comprimida = await comprimirImagen(file)
    const nombre = `${crypto.randomUUID()}.jpg`

    const { error } = await supabase.storage
      .from(BUCKET_FOTOS)
      .upload(nombre, comprimida, { contentType: 'image/jpeg', cacheControl: '31536000' })
    if (error) throw error

    const { data } = supabase.storage.from(BUCKET_FOTOS).getPublicUrl(nombre)
    return data.publicUrl
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (guardando) return

    if (!heladeria.trim()) return setError('¿De qué heladería era? Ponele el nombre.')
    if (!sabores.trim()) return setError('Contá qué sabor probaste.')
    if (puntuacion < 1) return setError('Faltan los heladitos: tocá del 1 al 5.')

    setGuardando(true)
    setError(null)
    try {
      const foto_url = foto ? await subirFoto(foto) : null

      await onGuardado({
        persona,
        heladeria: heladeria.trim(),
        sabores: sabores.trim(),
        puntuacion,
        foto_url,
        resena: resena.trim() || null,
      })

      // Limpiamos y saltamos al feed para ver el helado recién cargado.
      setHeladeria('')
      setSabores('')
      setPuntuacion(0)
      setResena('')
      quitarFoto()
      onListo()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar. Probá de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={guardar} className="space-y-5 px-4 pb-6">
      <div className="rounded-2.5xl border-2 border-white bg-white/70 px-4 py-3 text-center shadow-soft">
        <p className="font-display text-sm font-600 text-cacao">
          🗓️ Se guarda con la fecha de hoy — <span className="capitalize">{HOY()}</span>
        </p>
      </div>

      <div>
        <label className="etiqueta" htmlFor="heladeria">Heladería</label>
        <input
          id="heladeria"
          value={heladeria}
          onChange={(e) => setHeladeria(e.target.value)}
          placeholder="Ej: Verona, Pistacchio, Kalos…"
          className="campo"
          autoComplete="off"
          maxLength={80}
        />
      </div>

      <div>
        <label className="etiqueta" htmlFor="sabores">Sabor / sabores</label>
        <input
          id="sabores"
          value={sabores}
          onChange={(e) => setSabores(e.target.value)}
          placeholder="Ej: dulce de leche granizado y frutilla"
          className="campo"
          autoComplete="off"
          maxLength={140}
        />
      </div>

      <div className="rounded-2.5xl border-2 border-white bg-white/85 p-4 shadow-soft">
        <label className="etiqueta">Puntuación</label>
        <RatingHeladitos valor={puntuacion} onChange={setPuntuacion} />
      </div>

      <div>
        <label className="etiqueta">Foto <span className="font-400 text-cacao/60">(opcional)</span></label>

        {preview ? (
          <div className="relative overflow-hidden rounded-2.5xl border-2 border-white shadow-soft">
            <img src={preview} alt="Vista previa del helado" className="aspect-[4/3] w-full object-cover" />
            <button
              type="button"
              onClick={quitarFoto}
              className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-chocolate/75 text-lg text-white backdrop-blur-sm active:scale-90"
              aria-label="Quitar la foto"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputFoto.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-1 rounded-2.5xl border-2 border-dashed border-frutilla/50 bg-white/60 py-8 active:scale-[0.98] transition-transform"
          >
            <span className="text-4xl">📸</span>
            <span className="font-display text-base font-600 text-frutillaOscuro">
              Sacale una foto al helado
            </span>
            <span className="text-sm text-cacao/60">Cámara o galería</span>
          </button>
        )}

        <input
          ref={inputFoto}
          type="file"
          accept="image/*"
          onChange={elegirFoto}
          className="hidden"
        />
      </div>

      <div>
        <label className="etiqueta" htmlFor="resena">
          Reseña <span className="font-400 text-cacao/60">(opcional)</span>
        </label>
        <textarea
          id="resena"
          value={resena}
          onChange={(e) => setResena(e.target.value)}
          placeholder="¿Cremoso? ¿Muy dulce? ¿Volverías?"
          rows={4}
          maxLength={500}
          className="campo resize-none"
        />
      </div>

      {error && (
        <p className="rounded-2xl border-2 border-frutilla/40 bg-frutilla/10 px-4 py-3 text-center font-display font-600 text-frutillaOscuro">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={guardando}
        className="toque w-full rounded-2.5xl bg-gradient-to-br from-frutilla to-frutillaOscuro py-4
                   font-display text-xl font-700 text-white shadow-card disabled:opacity-60"
      >
        {guardando ? 'Guardando…' : '🍦 Guardar helado'}
      </button>
    </form>
  )
}
