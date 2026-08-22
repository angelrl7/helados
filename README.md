# 🍦 Heladómetro

Registro de las heladerías que probamos en San Juan, Argentina. Mobile-first, dos perfiles
fijos, puntuación en **heladitos** (del 1 al 5) y un resumen de fin de mes con el top 5.

**Stack:** React 18 + TypeScript + Vite · Tailwind CSS · Supabase (base de datos + storage).

---

## Puesta en marcha (5 minutos)

### 1. Crear el proyecto en Supabase

1. Entrá a [supabase.com](https://supabase.com) y creá un proyecto nuevo.
2. Andá a **SQL Editor → New query**, pegá **todo** el contenido de [`supabase.sql`](supabase.sql)
   y dale **Run**. Eso crea:
   - la tabla `helados`
   - las policies de RLS
   - el bucket público `fotos-helados` con sus policies

### 2. Configurar las variables de entorno

En Supabase: **Settings → API**. Vas a necesitar dos valores.

Copiá `.env.example` a `.env` y completalos:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://tuproyecto.supabase.co        # Settings → API → Project URL
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...                    # Settings → API → anon / public key
```

> Si la app abre y te muestra la pantalla “Falta conectar Supabase”, es que el `.env` todavía
> tiene los valores de ejemplo. Completalos y reiniciá `npm run dev` (Vite lee el `.env` sólo al arrancar).

### 3. Correr la app

```bash
npm install
npm run dev
```

Para probarla desde el celular en la misma red WiFi:

```bash
npm run dev -- --host
```

y abrí en el celu la dirección `http://192.168.x.x:5173` que te imprime la consola.

---

## Cómo se usa

| Pantalla | Qué hace |
|---|---|
| **Selector de perfil** | Al abrir, elegís quién carga. Sin login. El nombre queda guardado en el celu. Con el ✏️ los renombrás (los registros viejos se actualizan solos). |
| **➕ Cargar** | Heladería, sabores, heladitos (1-5, tappables), foto opcional y reseña opcional. La fecha se pone sola. |
| **🍦 Helados** | Feed de tarjetas con la foto full-bleed arriba, del más reciente al más viejo. Se filtra por persona. |
| **📊 Resumen** | Total del mes, cuántos probó cada uno y el **top 5 de heladerías por promedio de heladitos**. El mes se cambia con las flechas ‹ ›. |

Con el botón 🔄 del header cambiás de persona en cualquier momento.

---

## Modelo de datos

Tabla `helados`:

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | PK, `gen_random_uuid()` |
| `persona` | `text` | el nombre del perfil que cargó |
| `heladeria` | `text` | |
| `sabores` | `text` | |
| `puntuacion` | `int` | 1 a 5, con `check` en la base |
| `foto_url` | `text` | nullable — URL pública del bucket |
| `resena` | `text` | nullable |
| `created_at` | `timestamptz` | `default now()` |

Storage: bucket público **`fotos-helados`**. Las fotos se achican a 1400 px y se comprimen a
JPEG en el navegador **antes** de subirse, así no se comen los datos móviles ni el bucket.

### Sobre el top 5

Agrupa por nombre de heladería ignorando mayúsculas y espacios de más (así `Verona` y
`verona ` cuentan como la misma) y ordena por promedio de puntuación. Si dos empatan en
promedio, va primero la que se probó más veces.

---

## Un detalle de seguridad

La app no tiene login, así que las policies del SQL le dan permiso de lectura y escritura al
rol `anon`: **cualquiera con la URL y la anon key puede leer y escribir**. Para dos personas y
un registro de helados está perfecto, pero no metas ahí nada privado. Si algún día querés
cerrarlo, el lugar para hacerlo son las policies en [`supabase.sql`](supabase.sql).

---

## Scripts

```bash
npm run dev       # servidor de desarrollo
npm run build     # type-check + build de producción en dist/
npm run preview   # previsualizar el build
```

## Estructura

```
src/
├── App.tsx                     # shell: header, tabs, ruteo entre pantallas
├── components/
│   ├── SelectorPersona.tsx     # pantalla de entrada (los dos perfiles)
│   ├── PantallaCargar.tsx      # formulario de carga + subida de foto
│   ├── PantallaFeed.tsx        # feed con filtro por persona
│   ├── PantallaResumen.tsx     # stats del mes + top 5
│   ├── TarjetaHelado.tsx       # tarjeta con foto full-bleed
│   ├── Heladito.tsx            # el ícono de cucurucho (SVG)
│   ├── RatingHeladitos.tsx     # los 5 heladitos tappables
│   ├── RatingEstatico.tsx      # heladitos sólo para mostrar
│   └── BarraTabs.tsx           # navegación fija abajo
├── hooks/
│   ├── useHelados.ts           # datos: traer, agregar, borrar, renombrar
│   └── usePersonas.ts          # perfiles + persona activa (localStorage)
└── lib/
    ├── supabase.ts             # cliente
    ├── imagen.ts               # compresión de fotos
    └── fecha.ts                # formateo de fechas en español
```
