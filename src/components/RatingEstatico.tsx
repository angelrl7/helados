import Heladito from './Heladito'

type Props = {
  valor: number
  tamano?: 'sm' | 'md'
}

/** Los heladitos ya puntuados, sólo para mostrar (feed, top 5). */
export default function RatingEstatico({ valor, tamano = 'md' }: Props) {
  const alto = tamano === 'sm' ? 'h-5' : 'h-7'
  return (
    <div className="flex items-center gap-0.5" aria-label={`${valor} de 5 heladitos`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Heladito key={n} lleno={valor >= n} className={`${alto} w-auto`} />
      ))}
    </div>
  )
}
