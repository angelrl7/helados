const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

/** "12 de agosto" / "12 de agosto de 2025" si es de otro año. */
export function formatearFecha(iso: string): string {
  const d = new Date(iso)
  const hoy = new Date()
  const base = `${d.getDate()} de ${MESES[d.getMonth()]}`
  return d.getFullYear() === hoy.getFullYear() ? base : `${base} de ${d.getFullYear()}`
}

/** "Agosto 2025" */
export function nombreMes(anio: number, mes: number): string {
  const n = MESES[mes]
  return `${n.charAt(0).toUpperCase()}${n.slice(1)} ${anio}`
}

/** ¿Cae este ISO dentro del mes/año dados? (mes: 0-11) */
export function esDelMes(iso: string, anio: number, mes: number): boolean {
  const d = new Date(iso)
  return d.getFullYear() === anio && d.getMonth() === mes
}
