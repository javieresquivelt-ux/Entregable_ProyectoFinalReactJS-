# Rick & Morty Explorer ⚡ · ReactJS Final Project

> **Proyecto Final del curso ReactJS — Conquer Blocks**
> Explorador del multiverso C-137: busca, filtra, pagina, inspecciona episodios y guarda favoritos. Construido con **React 19 + Vite + Sass 7-1** y desplegado en GitHub Pages.

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

---

## 👨‍💻 Autor y Créditos
- **Estudiante / Desarrollador:** Javier Esquivel
- **Formación:** Master en Desarrollo Web / ReactJS — Conquer Blocks
- **API Oficial:** [The Rick and Morty API](https://rickandmortyapi.com/) por Axel Fuhrmann
