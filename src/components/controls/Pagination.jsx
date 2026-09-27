/**
 * @file Pagination.jsx
 * @description Controles de paginación (Anterior / Siguiente) con indicador numérico.
 *
 * ¿POR QUÉ ESTE COMPONENTE ESTÁ DESACOPLADO DE LA API?
 * Solo conoce su página actual y si puede avanzar o retroceder; delega la lógica
 * al hook (`useCharacters`). Así es un componente de presentación puro que
 * podría reutilizarse en cualquier listado paginado.
 *
 * SCROLL SUAVE:
 * Al cambiar de página, hacemos `window.scrollTo` hacia arriba para que el
 * usuario no quede a mitad del catálogo tras la nueva carga. Es una mejora de
 * UX heredada del proyecto original en Vanilla JS.
 */

/**
 * @param {object} props
 * @param {number} props.page - Página actual.
 * @param {number} props.totalPages - Total de páginas disponibles.
 * @param {boolean} props.hasPrevPage - Habilita el botón "Anterior".
 * @param {boolean} props.hasNextPage - Habilita el botón "Siguiente".
 * @param {() => void} props.onPrevPage - Acción de retroceder.
 * @param {() => void} props.onNextPage - Acción de avanzar.
 */
export function Pagination({
  page,
  totalPages,
  hasPrevPage,
  hasNextPage,
  onPrevPage,
  onNextPage,
}) {
  // Envolvemos la acción de navegación con el scroll para no repetir código.
  const handlePrev = () => {
    onPrevPage()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNext = () => {
    onNextPage()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className="pagination-section" aria-label="Navegación de páginas">
      <div className="pagination-section__wrapper">
        <button
          type="button"
          className="pagination-section__btn"
          onClick={handlePrev}
          disabled={!hasPrevPage}
          aria-label="Página anterior"
        >
          {/* Chevron izquierdo decorativo */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <span className="pagination-section__info">
          Página <span className="current-page">{page}</span> de {totalPages || 1}
        </span>

        <button
          type="button"
          className="pagination-section__btn"
          onClick={handleNext}
          disabled={!hasNextPage}
          aria-label="Página siguiente"
        >
          {/* Chevron derecho decorativo */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </nav>
  )
}

export default Pagination
