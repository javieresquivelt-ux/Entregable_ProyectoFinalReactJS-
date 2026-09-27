/**
 * @file ErrorMessage.jsx
 * @description Feedback amigable ante fallos de red o errores de la API.
 *
 * ¿POR QUÉ `role="alert"`?
 * A diferencia de `role="status"`, `role="alert"` es una región "asertiva":
 * los lectores de pantalla la anuncian de inmediato. Es lo correcto para un
 * error, porque el usuario necesita enterarse sin demora.
 *
 * El botón de reintento es opcional (`onRetry`): si no se pasa, el componente
 * sigue siendo válido y solo muestra el mensaje.
 */

/**
 * @param {object} props
 * @param {string} props.message - Mensaje de error legible para el usuario.
 * @param {() => void} [props.onRetry] - Callback para reintentar la petición.
 */
export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status-feedback status-feedback--error" role="alert">
      <span className="status-feedback__icon" aria-hidden="true">
        💥
      </span>
      <h3 className="status-feedback__title">Error en el multiverso</h3>
      <p className="status-feedback__desc">{message}</p>

      {/* El botón solo existe si el consumidor provee una acción de reintento. */}
      {onRetry && (
        <button type="button" className="btn btn--secondary" onClick={onRetry}>
          Reintentar conexión
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
