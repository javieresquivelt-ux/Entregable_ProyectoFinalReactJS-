/**
 * @file EmptyState.jsx
 * @description Estado vacío cuando la búsqueda o los filtros no arrojan resultados.
 *
 * DIFERENCIA CLAVE CON EL ERROR:
 * "Sin resultados" no es un fallo, es una situación normal de búsqueda. Por eso
 * este componente NO usa `role="alert"` (no es urgente) y, en su lugar, ofrece
 * una acción útil: restablecer los filtros.
 *
 * El botón solo aparece si `hasActiveFilters` es verdadero; si la lista está
 * vacía sin filtros (caso improbable), no tiene sentido ofrecer "limpiar".
 */

/**
 * @param {object} props
 * @param {() => void} [props.onClearFilters] - Callback para restablecer filtros.
 * @param {boolean} [props.hasActiveFilters] - Indica si hay filtros activos.
 */
export function EmptyState({ onClearFilters, hasActiveFilters }) {
  return (
    <div className="status-feedback">
      <span className="status-feedback__icon" aria-hidden="true">
        🛸
      </span>
      <h3 className="status-feedback__title">No se encontraron personajes</h3>
      <p className="status-feedback__desc">
        No hay coincidencias en esta dimensión. Intenta ajustar los filtros de búsqueda.
      </p>

      {hasActiveFilters && (
        <button type="button" className="btn btn--secondary" onClick={onClearFilters}>
          Restablecer filtros
        </button>
      )}
    </div>
  )
}

export default EmptyState
