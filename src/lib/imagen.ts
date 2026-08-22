/**
 * Achica y comprime la foto antes de subirla.
 * Las fotos del celu pesan 4-8 MB; así suben rápido con datos móviles
 * y el bucket no se llena al pedo.
 */
export async function comprimirImagen(file: File, ladoMax = 1400, calidad = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file)

  const escala = Math.min(1, ladoMax / Math.max(bitmap.width, bitmap.height))
  const ancho = Math.round(bitmap.width * escala)
  const alto = Math.round(bitmap.height * escala)

  const canvas = document.createElement('canvas')
  canvas.width = ancho
  canvas.height = alto

  const ctx = canvas.getContext('2d')
  if (!ctx) return file
  ctx.drawImage(bitmap, 0, 0, ancho, alto)
  bitmap.close?.()

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', calidad),
  )

  // Si algo falla o el original ya era más liviano, nos quedamos con el original.
  return blob && blob.size < file.size ? blob : file
}
