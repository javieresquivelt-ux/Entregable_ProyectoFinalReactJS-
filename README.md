# Rick & Morty Explorer ⚡ · ReactJS Final Project

> **Proyecto Final del curso ReactJS — Conquer Blocks**
> Explorador del multiverso C-137: busca, filtra, pagina, inspecciona episodios y guarda favoritos. Construido con **React 19 + Vite + Sass 7-1** y desplegado en GitHub Pages.

---

## 🖥️ Demo

🔗 **[https://tu-usuario.github.io/tu-repo/](https://tu-usuario.github.io/tu-repo/)** — _reemplaza `tu-usuario`/`tu-repo` por tu URL real antes de entregar._

---

## 🎯 Objetivos

Este proyecto pone en práctica, sobre una aplicación real que consume una API REST pública, los conceptos centrales del módulo de ReactJS:

| Concepto | Dónde se practica |
|---|---|
| **Componentes funcionales y composición** | Toda la carpeta `src/components/` (atoms → layout → vistas). |
| **Props y flujo de datos unidireccional** | `App.jsx` pasa datos y callbacks a los componentes hijos. |
| **`useState` y elevación del estado** | Estado de filtros/navegación centralizado en `App.jsx` (SSOT). |
| **`useEffect` y efectos secundarios** | Carga de datos (`useCharacters`), persistencia (`FavoritesProvider`), sincronización del `<dialog>`. |
| **Custom Hooks** | `useCharacters`, `useDebounce`, `useFavorites`. |
| **Context API** | `FavoritesProvider` / `useFavorites` para evitar *prop drilling*. |
| **Optimización** | `useMemo`, `useCallback`, `Set` O(1), `AbortController`, `loading="lazy"`, debounce. |
| **Consumo de API con `fetch`** | `services/api.js` con `URLSearchParams`, `Promise.all` y manejo del 404. |
| **Persistencia en el navegador** | `localStorage` con parseo defensivo (`favoritesStorage.js`). |
| **HTML5 moderno** | `<dialog>` nativo con `showModal()` y `::backdrop`. |
| **Accesibilidad (WCAG 2.1 AA)** | Patrón WAI-ARIA Tabs, skip-link, `aria-live`, `aria-busy`, `:focus-visible`. |
| **Arquitectura Sass 7-1** | `src/scss/` con `@use`/`@forward` y partials por responsabilidad. |
| **Despliegue continuo** | GitHub Actions → GitHub Pages con `base: './'`. |

---

## ✨ Funcionalidades

| Funcionalidad | Descripción |
|---|---|
| 🔍 Búsqueda con Debounce | Busca personajes por nombre sin saturar la API (retardo de 350 ms). |
| 🎛️ Filtros combinados | Filtra por estado (Vivo / Muerto / Desconocido) y género simultáneamente. |
| 📄 Paginación suave | Navega entre las 42 páginas con scroll automático al inicio del catálogo. |
| 🪟 Modal de detalle | Abre cualquier personaje con `<dialog>` nativo: info completa + hasta 20 episodios cargados en paralelo. |
| ⭐ Favoritos persistentes | Marca/desmarca personajes; se guardan en `localStorage` y sobreviven a la recarga. |
| 🌐 Vista de Favoritos | Filtra tus favoritos localmente (sin peticiones de red) con los mismos controles. |
| ♿ Accesibilidad WCAG 2.1 AA | Skip-link, patrón ARIA Tabs, `aria-live`, `aria-busy`, `:focus-visible` y `<dialog>` nativo. |

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|---|---|
| UI Framework | **React 19** (`react` / `react-dom` ^19.2) |
| Bundler / Dev Server | **Vite 8** (`@vitejs/plugin-react`) |
| Estilos | **Sass** (Dart Sass ^1.105) con arquitectura **7-1** |
| Estado Global | **Context API** + Custom Hooks |
| Persistencia | **Web Storage API** (`localStorage`) |
| Linting | **ESLint 10** + `@eslint/js` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` |
| CI/CD | **GitHub Actions** → **GitHub Pages** |
| API | [The Rick and Morty API](https://rickandmortyapi.com/) (pública, gratuita, sin API key) |

---

## 📁 Estructura de Archivos

```text
ProyectoFinal_ReactJS/
│
├── index.html                     # Documento raíz: metadatos, Google Fonts y <div id="root">
├── vite.config.js                 # Config de Vite con `base: './'` (rutas relativas para Pages)
├── eslint.config.js               # Reglas ESLint (flat config) + plugins de React
├── package.json                   # Dependencias y scripts (dev/build/lint/preview)
├── README.md                      # Este documento
├── .gitignore                     # Exclusiones de Git (node_modules, dist, docs internas...)
│
├── public/
│   └── favicon.svg                # Favicon temático (portal interdimensional)
│
├── .github/
│   └── workflows/
│       └── deploy.yml             # CI/CD: lint → build → deploy a GitHub Pages
│
└── src/
    ├── main.jsx                   # Punto de entrada: monta <App> dentro de <FavoritesProvider>
    ├── App.jsx                    # Raíz: fuente única de la verdad del estado y el layout
    │
    ├── components/
    │   ├── layout/
    │   │   └── Header.jsx         # Encabezado/hero temático (presentación pura)
    │   ├── cards/
    │   │   ├── CharacterCard.jsx  # Tarjeta individual del personaje
    │   │   └── CharacterGrid.jsx  # Grilla responsiva (CSS Grid 1–4 columnas)
    │   ├── controls/
    │   │   ├── SearchControls.jsx # Input + selectores + pestañas (componente controlado)
    │   │   └── Pagination.jsx     # Anterior/Siguiente + scroll suave
    │   ├── feedback/
    │   │   ├── Loader.jsx         # Spinner de portal interdimensional
    │   │   ├── ErrorMessage.jsx   # Feedback de error con opción de reintento
    │   │   └── EmptyState.jsx     # Estado vacío cuando no hay resultados
    │   └── modal/
    │       └── CharacterModal.jsx # Modal <dialog> nativo con episodios concurrentes
    │
    ├── context/
    │   ├── favoritesContext.js    # createContext + hook useFavorites()
    │   └── FavoritesProvider.jsx  # Proveedor con persistencia en localStorage
    │
    ├── hooks/
    │   ├── useCharacters.js       # Datos + paginación + cancelación (AbortController)
    │   └── useDebounce.js         # Retardo configurable para inputs (default 350 ms)
    │
    ├── services/
    │   ├── api.js                 # fetchCharacters, fetchCharacter, fetchEpisodesByUrls, ApiError
    │   └── favoritesStorage.js    # getStoredFavorites / saveStoredFavorites (try/catch)
    │
    └── scss/                      # Arquitectura Sass 7-1
        ├── app.scss               # Manifiesto central (@use de todas las capas)
        ├── _settings.scss         # Flags de compilación
        ├── abstracts/             # _variables.scss (tokens) y _mixins.scss (breakpoints)
        ├── base/                  # _reset.scss (reset global + utilidades de accesibilidad)
        ├── layout/                # _header, _container, _controls, _grid
        └── components/            # _buttons, _cards, _loader, _modal, _pagination
```

> **Archivos excluidos del control de versiones (`.gitignore`):**
> - `/instruction/` — material, enunciados y proyecto de referencia del curso.
> - `agent.md`, `task.md`, `memory.md` — documentación interna del proceso de desarrollo (Harness Engineering).
>
> Permanecen en el entorno local para el seguimiento del trabajo, pero **no se publican** en el repositorio.

---

## 🧩 Secciones del Sitio (y sus características CSS)

### 1. Header / Hero — `.app-header`
Encabezado temático que funciona como *hero* de la página.
- **Estructura:** `__badge` (etiqueta superior), `__title` (`<h1>`), `__subtitle`.
- **CSS destacado:** fondo con `linear-gradient` + `backdrop-filter: blur(10px)`, borde inferior sutil (`$color-border`) y `padding` fluido.
- **Tipografía:** el título usa `$font-family-display` (**Orbitron**) con `background-clip: text` para un degradado verde→cian.

### 2. Controles — `.controls-section`
Panel de búsqueda, filtros y pestañas (`.controls-section__wrapper`).
- **`__search-box`:** input con icono de lupa SVG posicionado con `position: absolute`. El icono se ilumina al enfocar gracias al selector adyacente `input:focus + svg`.
- **`__filters-group`:** dos `<select>` con `flex: 1` y `min-width` para envolver en móvil (`flex-wrap`).
- **`__tabs`:** contenedor tipo "segmented control"; la pestaña activa (`.tab-btn--active`) usa fondo `$color-portal-green` y texto oscuro.
- **Foco:** `:focus` cambia borde y aplica `box-shadow` con el glow temático (cian para selects, verde para el input).

### 3. Catálogo / Categorías de Personajes — `.characters-grid`
Grilla donde se "categorizan" los personajes en tarjetas.
- **CSS Grid responsivo:** 1 columna (< 640px) → 2 (≥ 640px) → 3 (≥ 1024px) → 4 (≥ 1280px), vía mixin `breakpoint()`.
- **`.character-card`:** `border-radius: 18px`, sombra `$shadow-md` y `:hover` con elevación (`translateY(-6px)`) + glow del portal.
- **`__media`:** contenedor con `aspect-ratio: 1 / 1`; la imagen hace `scale(1.05)` en hover.
- **`__status` + `.status-dot`:** punto luminoso cuyo color depende del estado (verde/rojo/gris) con `box-shadow` de brillo.
- **`.btn--favorite`:** botón flotante circular con `backdrop-filter`; en `.is-favorite` adopta una cápsula oscura con borde dorado para garantizar contraste sobre cualquier imagen.

### 4. Paginación — `.pagination-section`
- **Estructura:** `<nav>` con botones circulares (`__btn`) y `__info` ("Página X de Y").
- **CSS:** botones `38×38px`, `border-radius: 50%`, `:hover:not(:disabled)` con fondo verde y glow; `:disabled` con `opacity: 0.3`.
- **Comportamiento:** al cambiar de página se ejecuta `window.scrollTo({ behavior: 'smooth' })`.

### 5. Modal de Detalle — `.modal`
- **Tecnología:** `<dialog>` nativo; `::backdrop` aplica `rgba(10,12,18,.8)` + `backdrop-filter: blur(8px)`.
- **`__content`:** `max-height: 85vh`, `overflow` interno y animación de entrada `modalIn` (escala + desplazamiento).
- **`__meta-grid`:** grid de 2 columnas para los datos; **`__episodes-list`** muestra badges (`.episode-badge`) en cian con `flex-wrap` y scroll propio.

### 6. Vista de Favoritos
- Reutiliza `.characters-grid` y `.character-card` sobre la lista local.
- Estados vacíos construidos con `.status-feedback` (icono, título y descripción).

---

## 🎨 Paleta de Colores

Definida en `src/scss/abstracts/_variables.scss`:

| Token | Hex / Valor | Propósito |
|---|---|---|
| `$color-bg-deep` | `#0f111a` | Fondo cósmico profundo (espacio exterior). |
| `$color-bg-surface` | `#181b26` | Superficie de paneles y controles. |
| `$color-bg-card` | `#202433` | Fondo de tarjetas y del modal. |
| `$color-bg-card-hover` | `#272c3d` | Estado hover de tarjetas/contenedores. |
| `$color-portal-green` | `#97ce4c` | Acento principal (portal de Rick); botones primarios y pestaña activa. |
| `$color-portal-glow` | `#39ff14` | Brillo fluorescente para estados activos. |
| `$color-portal-cyan` | `#00b5cc` | Acento secundario, foco (`:focus-visible`) y badges de episodios. |
| `$color-portal-purple` | `#9d4edd` | Detalles "dimensionales" del loader. |
| `$color-status-alive` | `#55cc44` | Punto de estado **Vivo**. |
| `$color-status-dead` | `#d63d2e` | Punto de estado **Muerto** y errores. |
| `$color-status-unknown` | `#9e9e9e` | Punto de estado **Desconocido**. |
| `$color-favorite-gold` | `#ffc107` | Estrella de favoritos (dorado). |
| `$color-text-primary` | `#f5f6fa` | Texto principal de alto contraste. |
| `$color-text-secondary` | `#9aa0a6` | Metadata (especie, origen, ubicación). |
| `$color-text-muted` | `#6b7280` | Texto atenuado y placeholders. |
| `$color-border` | `rgba(255,255,255,.08)` | Bordes sutiles de elementos elevados. |

**Sombras y glows:** `$shadow-sm/md/lg`, `$glow-portal`, `$glow-portal-strong`, `$glow-cyan`.
**Radios:** `$border-radius-sm` (6px), `-md` (12px), `-lg` (18px), `-full` (9999px).

---

## 🔤 Tipografías y Tamaños

Cargadas desde Google Fonts en `index.html` y expuestas como tokens en `_variables.scss`:

| Token | Fuente | Uso |
|---|---|---|
| `$font-family-base` | **Inter** (300–700) | Cuerpo de texto, controles, tarjetas y metadata. |
| `$font-family-display` | **Orbitron** (600–900) | Títulos con estética Sci-Fi (header, títulos de sección). |

Tamaños destacados (base `html` = **16px**, enfoque *mobile-first* con escalado por breakpoint):

| Elemento | Tamaño |
|---|---|
| Título del header (`.app-header__title`) | `2.25rem` → **`3.25rem`** en tablet |
| Subtítulo del header | `1rem` → `1.15rem` en tablet |
| Badge del header | `0.75rem` (mayúsculas, `letter-spacing`) |
| Nombre en la tarjeta (`.character-card__name`) | `1.25rem` |
| Estado/metadata de tarjeta | `0.85rem` (labels `0.75rem`) |
| Título del modal (`h2`) | `1.75rem` |
| Título de sección del modal | `0.95rem` (mayúsculas) |
| Badge de episodio | `0.75rem` |
| Info de paginación | `0.9rem` |
| Botones e input de búsqueda | `0.9rem` / `0.95rem` |

---

## 🚀 Instalación y Uso

### Requisitos
- **Node.js 20+** y **npm**.

### Pasos

```bash
# 1. Clona el repositorio
git clone https://github.com/<tu-usuario>/<tu-repo>.git
cd <tu-repo>

# 2. Instala las dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
# → Abre http://localhost:5173 en tu navegador

# 4. Verifica el linting
npm run lint

# 5. Genera el bundle de producción
npm run build

# 6. Previsualiza el bundle de producción
npm run preview
```

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR. |
| `npm run build` | Bundle optimizado para producción en `dist/`. |
| `npm run lint` | Análisis estático con ESLint (0 errores esperados). |
| `npm run preview` | Previsualiza el bundle de producción localmente. |

---

## 🌐 Despliegue en GitHub Pages

El proyecto incluye CI/CD automatizado en `.github/workflows/deploy.yml`.

1. **Habilita GitHub Pages:** `Settings → Pages → Source → GitHub Actions`.
2. **Haz push a `main`:** el workflow ejecuta `npm ci` → `npm run lint` → `npm run build` y publica `dist/`.
3. También puedes lanzarlo manualmente: `Actions → Deploy to GitHub Pages → Run workflow`.

> **Nota:** `vite.config.js` define `base: './'`, por lo que `dist/index.html` usa rutas relativas (`./assets/...`) y funciona bajo cualquier subdirectorio de GitHub Pages.

---

## ♿ Accesibilidad

Implementación de **WCAG 2.1 nivel AA**:

| Criterio | Implementación |
|---|---|
| WCAG 2.4.1 Bypass Blocks | `.skip-link` que salta a `<main id="main-content" tabindex="-1">`. |
| WCAG 2.4.7 Focus Visible | `:focus-visible` con contorno cian de alto contraste (`_reset.scss`). |
| WCAG 4.1.2 Name, Role, Value | Patrón WAI-ARIA Tabs: `role="tablist/tab/tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`, roving tabindex y navegación con flechas. |
| WCAG 1.3.1 Info and Relationships | `<header>`, `<main>`, `<nav>`, `<section>`, `<dialog>` y `<article>` semánticos. |
| WCAG 4.1.3 Status Messages | `aria-live="polite"` anuncia el conteo de resultados; `aria-busy` durante la carga. |
| WCAG 1.1.1 Non-text Content | `alt` en imágenes; `aria-hidden` en íconos decorativos; `aria-label` en botones de ícono. |
| Focus trap en modal | `<dialog>` nativo con `showModal()` atrapa el foco automáticamente. |

---

## 🧠 Aprendizajes Clave

1. **Separar el "qué" del "cómo":** la capa de servicios (`services/`) y los hooks aíslan la lógica de datos de la presentación. Los componentes solo reciben props y emiten eventos; eso los hace testeables y reutilizables.
2. **Fuente única de la verdad (SSOT):** centralizar filtros y navegación en `App.jsx` evita estados duplicados y desincronizados entre la grilla, la paginación y la búsqueda.
3. **Debounce con Custom Hook:** mantener el input a 60 fps con el valor inmediato y enviar a la API solo el valor diferido (`useDebounce`) redujo drásticamente las peticiones sin perder fluidez.
4. **Cancelar peticiones con `AbortController`:** limpiar en el `useEffect` previene *race conditions* cuando el usuario escribe rápido o cambia de filtro.
5. **Combinar declarativo e imperativo:** el estado de React se tradujo a la API imperativa de `<dialog>` (`showModal`/`close`) mediante un efecto, obteniendo *focus trap*, cierre con `Escape` y accesibilidad "gratis".
6. **Context API sin *prop drilling*:** los favoritos son transversales; el contexto con un `Set` derivado (`useMemo`) permitió comprobaciones **O(1)** por tarjeta y persistencia con *lazy init*.
7. **Robustez defensiva:** el 404 de la API se interpreta como "sin resultados" (no como error), y `localStorage` se accede siempre dentro de `try/catch`.
8. **Reglas modernas de React 19:** el plugin de hooks v7 obliga a no resetear estado dentro de efectos; aprender el patrón "ajustar estado durante el render" y los *updaters* funcionales mejoró la calidad del código.
9. **Accesibilidad desde el diseño:** ARIA, foco visible y regiones vivas se integraron fase a fase, no como parche final.
10. **Sass 7-1 y despliegue:** la arquitectura modular con `@use`/`@forward` y `base: './'` en Vite hicieron el proyecto mantenible y portable a GitHub Pages.

---

## 🎓 Créditos

- **Estudiante:** Proyecto final del curso **ReactJS — Conquer Blocks**.
- **Datos:** [The Rick and Morty API](https://rickandmortyapi.com/) — Axel Fuhrmann (MIT License).
- **Diseño base:** Sistema de estilos **Sass 7-1** heredado del proyecto anterior en Vanilla JS, migrado a componentes React.
