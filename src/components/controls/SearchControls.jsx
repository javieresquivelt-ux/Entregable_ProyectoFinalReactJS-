/**
 * @file SearchControls.jsx
 * @description Controles de búsqueda, filtros y pestañas del catálogo.
 *
 * PATRÓN DE DISEÑO: COMPONENTE CONTROLADO
 * Este componente NO guarda el estado de los filtros; lo recibe por props y
 * notifica los cambios mediante callbacks (`onSearchChange`, `onStatusChange`,
 * `onGenderChange`, `onTabChange`). Así el estado vive en un único lugar
 * (`App.jsx`), respetando la Fuente Única de la Verdad (SSOT).
 *
 * Esto es clave porque los filtros alimentan a `useCharacters`, a la futura
 * grilla y a la paginación: si cada uno tuviera su propia copia, se
 * desincronizarían.
 *
 * ACCESIBILIDAD (WCAG 2.1 AA — Patrón WAI-ARIA Tabs):
 * - Cada botón de pestaña tiene un `id` único (`tab-all`, `tab-favorites`) y
 *   un `aria-controls` que apunta al panel que controla.
 * - El panel correspondiente en `App.jsx` recibe `id` + `aria-labelledby`.
 * - La navegación por teclado con ArrowLeft/ArrowRight (y Home/End) implementa
 *   el patrón de «roving tabindex»: solo la pestaña activa es tabulable
 *   (`tabIndex={0}`), las inactivas tienen `tabIndex={-1}`.
 *
 * Las clases CSS provienen de `_controls.scss` y `_buttons.scss` (Sass 7-1)
 * y no se alteran, preservando el diseño original.
 */

/**
 * @param {object} props
 * @param {string} props.searchTerm - Valor inmediato del campo de búsqueda.
 * @param {(value: string) => void} props.onSearchChange - Notifica cada tecla.
 * @param {string} props.status - Estado seleccionado ('alive' | 'dead' | 'unknown' | '').
 * @param {(value: string) => void} props.onStatusChange - Notifica el cambio de estado.
 * @param {string} props.gender - Género seleccionado.
 * @param {(value: string) => void} props.onGenderChange - Notifica el cambio de género.
 * @param {'all' | 'favorites'} props.activeTab - Pestaña activa.
 * @param {(tab: 'all' | 'favorites') => void} props.onTabChange - Notifica el cambio de pestaña.
 * @param {() => void} props.onClearFilters - Reinicia búsqueda y filtros.
 * @param {boolean} props.hasActiveFilters - Indica si hay algún filtro o búsqueda activa.
 * @param {number} [props.favoritesCount=0] - Contador mostrado en la pestaña Favoritos.
 */
export function SearchControls({
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  gender,
  onGenderChange,
  activeTab,
  onTabChange,
  onClearFilters,
  hasActiveFilters,
  favoritesCount = 0,
}) {
  // Orden de pestañas para la navegación circular con flechas.
  const tabs = ['all', 'favorites']

  /**
   * Manejo de teclado para el patrón WAI-ARIA Tabs.
   *
   * ArrowRight / ArrowLeft: mueve el foco a la siguiente/anterior pestaña
   * (con envoltura circular). Home/End: primera/última pestaña.
   * Al mover el foco también se activa la pestaña (patrón "activation follows focus"),
   * que es la variante más simple y adecuada para un listado de dos pestañas.
   *
   * @param {React.KeyboardEvent} event
   */
  const handleTabKeyDown = (event) => {
    const currentIndex = tabs.indexOf(activeTab)

    let nextIndex = currentIndex
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1
    } else {
      return // Tecla no relevante: dejar el evento fluir normalmente.
    }

    event.preventDefault() // Evitar el comportamiento por defecto de la tecla (scroll/cambio de foco).
    onTabChange(tabs[nextIndex])

    // Trasladar el foco al botón de la pestaña recién activada.
    // El `setTimeout(0)` garantiza que React ya re-renderizó antes de buscar el elemento.
    setTimeout(() => {
      document.getElementById(`tab-${tabs[nextIndex]}`)?.focus()
    }, 0)
  }

  return (
    <section className="controls-section" aria-label="Controles de búsqueda y filtros">
      <div className="controls-section__wrapper">
        {/* -----------------------------------------------------------------
            Campo de búsqueda
            IMPORTANTE: el <svg> va DESPUÉS del <input> para que el selector
            adyacente `input:focus + svg` (_controls.scss:61) ilumine la lupa.
        ------------------------------------------------------------------ */}
        <div className="controls-section__search-box">
          <input
            type="search"
            placeholder="Buscar personaje por nombre..."
            value={searchTerm}
            // Componente controlado: el valor siempre proviene del estado padre.
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Buscar personaje por nombre"
          />
          {/* Icono decorativo: `aria-hidden` evita que el lector de pantalla lo anuncie */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* -----------------------------------------------------------------
            Fila de filtros + pestañas
        ------------------------------------------------------------------ */}
        <div className="controls-section__filters">
          <div className="controls-section__filters-group">
            {/* Filtro por estado del personaje */}
            <select
              value={status}
              onChange={(event) => onStatusChange(event.target.value)}
              aria-label="Filtrar por estado"
            >
              <option value="">Todos los estados</option>
              <option value="alive">Vivo</option>
              <option value="dead">Muerto</option>
              <option value="unknown">Desconocido</option>
            </select>

            {/* Filtro por género */}
            <select
              value={gender}
              onChange={(event) => onGenderChange(event.target.value)}
              aria-label="Filtrar por género"
            >
              <option value="">Todos los géneros</option>
              <option value="female">Femenino</option>
              <option value="male">Masculino</option>
              <option value="genderless">Sin género</option>
              <option value="unknown">Desconocido</option>
            </select>

            {/* El botón de limpieza solo aparece cuando hay algo que limpiar */}
            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn--secondary"
                onClick={onClearFilters}
              >
                ✕ Limpiar filtros
              </button>
            )}
          </div>

          {/* Pestañas de modo de visualización (patrón WAI-ARIA Tabs completo).
              - `role="tablist"` en el contenedor + `role="tab"` en cada botón.
              - `aria-controls` vincula cada pestaña a su panel (`id` en App.jsx).
              - `tabIndex`: solo la activa es tabulable (roving tabindex). */}
          <div
            className="controls-section__tabs"
            role="tablist"
            aria-label="Modo de visualización"
          >
            <button
              id="tab-all"
              type="button"
              role="tab"
              aria-selected={activeTab === 'all'}
              aria-controls="panel-all"
              tabIndex={activeTab === 'all' ? 0 : -1}
              className={`tab-btn ${activeTab === 'all' ? 'tab-btn--active' : ''}`}
              onClick={() => onTabChange('all')}
              onKeyDown={handleTabKeyDown}
            >
              🛸 Todos
            </button>

            <button
              id="tab-favorites"
              type="button"
              role="tab"
              aria-selected={activeTab === 'favorites'}
              aria-controls="panel-favorites"
              tabIndex={activeTab === 'favorites' ? 0 : -1}
              className={`tab-btn ${activeTab === 'favorites' ? 'tab-btn--active' : ''}`}
              onClick={() => onTabChange('favorites')}
              onKeyDown={handleTabKeyDown}
            >
              ⭐ Favoritos {favoritesCount > 0 ? `(${favoritesCount})` : ''}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchControls
