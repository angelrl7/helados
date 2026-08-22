type Props = {
  /** Relleno (puntuado) o contorno vacío. */
  lleno: boolean
  className?: string
}

/**
 * El "heladito": un cucurucho con dos bochas.
 * Reemplaza a la clásica estrella como unidad de puntuación.
 */
export default function Heladito({ lleno, className = '' }: Props) {
  return (
    <svg viewBox="0 0 32 40" className={className} aria-hidden="true">
      {/* Cucurucho */}
      <path
        d="M16 39 L7.5 19.5 L24.5 19.5 Z"
        fill={lleno ? '#F0B27A' : 'transparent'}
        stroke={lleno ? '#D89257' : '#DCC9BC'}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Rayado del cucurucho, sólo cuando está lleno */}
      {lleno && (
        <g stroke="#D89257" strokeWidth="1.2" strokeLinecap="round" opacity="0.85">
          <line x1="11" y1="23" x2="18" y2="23" />
          <line x1="12.5" y1="28" x2="17.5" y2="28" />
        </g>
      )}
      {/* Bocha izquierda */}
      <circle
        cx="11.5" cy="15" r="6"
        fill={lleno ? '#A9D9BE' : 'transparent'}
        stroke={lleno ? '#5FA97F' : '#DCC9BC'}
        strokeWidth="2"
      />
      {/* Bocha derecha */}
      <circle
        cx="20.5" cy="15" r="6"
        fill={lleno ? '#FFB3C6' : 'transparent'}
        stroke={lleno ? '#E8567A' : '#DCC9BC'}
        strokeWidth="2"
      />
      {/* Bocha de arriba */}
      <circle
        cx="16" cy="9" r="6.5"
        fill={lleno ? '#FF8FA9' : 'transparent'}
        stroke={lleno ? '#E8567A' : '#DCC9BC'}
        strokeWidth="2"
      />
      {/* Brillito */}
      {lleno && <circle cx="13.5" cy="6.5" r="1.6" fill="#FFF6EC" opacity="0.9" />}
    </svg>
  )
}
