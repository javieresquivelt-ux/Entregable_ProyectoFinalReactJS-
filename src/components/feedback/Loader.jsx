/**
 * @file Loader.jsx
 * @description Indicador de carga temático con la animación de portal interdimensional.
 *
 * ¿POR QUÉ `role="status"` + `aria-live="polite"`?
 * Los lectores de pantalla no "ven" la animación. Con `role="status"` y
 * `aria-live="polite"` anuncian el texto de carga cuando aparece, sin
 * interrumpir lo que el usuario esté escuchando en ese momento.
 *
 * La animación visual (`.portal-loader`) es puramente decorativa, por eso se
 * marca con `aria-hidden="true"`: no aporta información semántica.
 */

/**
 * Renderiza el estado de carga del catálogo.
 *
 * @returns {JSX.Element}
 */
export function Loader() {
  return (
    <div className="status-feedback" role="status" aria-live="polite">
      {/* Spinner decorativo: animado con CSS (spinPortal / spinPortalReverse) */}
      <div className="portal-loader" aria-hidden="true"></div>
      <p className="status-feedback__desc">Abriendo portal dimensional...</p>
    </div>
  )
}

export default Loader
