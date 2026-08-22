export type Tab = 'cargar' | 'feed' | 'resumen'

const TABS: { id: Tab; icono: string; texto: string }[] = [
  { id: 'cargar', icono: '➕', texto: 'Cargar' },
  { id: 'feed', icono: '🍦', texto: 'Helados' },
  { id: 'resumen', icono: '📊', texto: 'Resumen' },
]

type Props = {
  activa: Tab
  onCambiar: (t: Tab) => void
}

/** Navegación fija abajo: al alcance del pulgar. */
export default function BarraTabs({ activa, onCambiar }: Props) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-vainilla bg-crema/95 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-md">
        {TABS.map((t) => {
          const activo = activa === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onCambiar(t.id)}
              aria-current={activo ? 'page' : undefined}
              className="flex flex-1 flex-col items-center gap-0.5 py-3 active:scale-95 transition-transform"
            >
              <span className={`text-2xl transition-transform ${activo ? 'scale-110' : 'opacity-45 grayscale'}`}>
                {t.icono}
              </span>
              <span
                className={`font-display text-xs font-700 ${activo ? 'text-frutillaOscuro' : 'text-cacao/50'}`}
              >
                {t.texto}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
