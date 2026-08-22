/**
 * crypto.randomUUID() sólo existe en contextos seguros (HTTPS o localhost).
 * Abriendo la app desde el celu por IP —http://192.168.x.x— no está disponible,
 * así que caemos a getRandomValues, que sí funciona en cualquier contexto.
 */
export function uuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  const b = new Uint8Array(16)
  crypto.getRandomValues(b)
  b[6] = (b[6] & 0x0f) | 0x40 // versión 4
  b[8] = (b[8] & 0x3f) | 0x80 // variante RFC 4122

  const hex = [...b].map((n) => n.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
