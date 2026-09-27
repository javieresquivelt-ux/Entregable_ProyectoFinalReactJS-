/**
 * @file CharacterModal.jsx
 * @description Modal de detalle extendido del personaje usando el elemento
 * nativo HTML5 `<dialog>`.
 *
 * ¿POR QUÉ `<dialog>` NATIVO Y NO UN `<div>`?
 * Al invocar `dialog.showModal()`, el navegador nos regala accesibilidad de
 * nivel producción sin código extra:
 *   1. *Focus trap*: el teclado no puede salir del modal mientras está abierto.
 *   2. Cierre con la tecla `Escape` (dispara el evento `close`).
 *   3. `aria-modal="true"` nativo y una capa superior (*top layer*) que evita
 *      conflictos de `z-index`.
 *   4. El pseudo-elemento `::backdrop` permite oscurecer y desenfocar el fondo.
 *
 * El reto en React es unir el estado DECLARATIVO (`character !== null`) con la
 * API IMPERATIVA del DOM (`showModal()` / `close()`). Para eso usamos `useEffect`.
 */

import { useEffect, useRef, useState } from 'react'
import { fetchEpisodesByUrls } from '../../services/api.js'

/**
 * @param {object} props
 * @param {object|null} props.character - Personaje a mostrar (null = cerrado).
 * @param {() => void} props.onClose - Notifica al padre que debe cerrar.
 */
export function CharacterModal({ character, onClose }) {
  // Referencia directa al nodo <dialog> para invocar su API imperativa.
  const dialogRef = useRef(null)

  // Estado local de los episodios (no pertenece al catálogo global).
  const [episodes, setEpisodes] = useState([])
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false)
  const [episodesError, setEpisodesError] = useState(null)

  // Total real de episodios del personaje (la API puede traer 51, etc.).
  const totalEpisodes = character?.episode?.length || 0

  // -------------------------------------------------------------------------
  // 0. Reset de episodios al cambiar de personaje
  // -------------------------------------------------------------------------
  // PATRÓN "AJUSTAR ESTADO DURANTE EL RENDER": comparamos el id actual con el
  // último cargado y, si cambió, reiniciamos aquí mismo. Evita un `useEffect`
  // de limpieza y los renders en cascada que este provocaría.
  const [loadedCharacterId, setLoadedCharacterId] = useState(null)

  if ((character?.id ?? null) !== loadedCharacterId) {
    setLoadedCharacterId(character?.id ?? null)
    setEpisodes([])
    setEpisodesError(null)
    setIsLoadingEpisodes(Boolean(character?.episode?.length))
  }

  // -------------------------------------------------------------------------
  // 1. Sincronización declarativo -> imperativo del <dialog>
  // -------------------------------------------------------------------------
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (character && !dialog.open) {
      // showModal() abre el diálogo en la capa superior con focus trap.
      dialog.showModal()
    } else if (!character && dialog.open) {
      dialog.close()
    }
  }, [character])

  // -------------------------------------------------------------------------
  // 2. Cierre nativo (Escape) -> notificar al padre
  // -------------------------------------------------------------------------
  // Cuando el usuario pulsa Escape, el navegador cierra el <dialog> y dispara
  // el evento `close`. React 19 lo expone como `onClose` (ver etiqueta abajo),
  // donde llamamos a `onClose()` para vaciar el estado del padre.
  // El clic en el backdrop también llega con `target === dialog` (el área oscura
  // es el propio <dialog>), así que lo detectamos y cerramos.
  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) {
      onClose()
    }
  }

  // -------------------------------------------------------------------------
  // 3. Carga concurrente de episodios (con cancelación)
  // -------------------------------------------------------------------------
  useEffect(() => {
    // Sin personaje o sin episodios no hay nada que pedir. El reseteo de estado
    // ya ocurrió durante el render (ver bloque 0).
    if (!character || !character.episode?.length) return undefined

    // `isActive` evita actualizar estado si el modal se cierra durante la carga.
    // Es necesario porque `fetchEpisodesByUrls` absorbe los abortos y RESUELVE
    // con un array vacío (no rechaza), por lo que el `catch` no basta.
    let isActive = true
    const controller = new AbortController()

    // Las actualizaciones de estado ocurren dentro de callbacks ASÍNCRONOS
    // (then/catch), que es la forma recomendada de sincronizar con un sistema
    // externo (la red) sin provocar renders en cascada.
    fetchEpisodesByUrls(character.episode, 20, controller.signal)
      .then((data) => {
        if (!isActive) return
        setEpisodes(data)
        setIsLoadingEpisodes(false)
      })
      .catch(() => {
        if (!isActive) return
        setEpisodesError('No se pudo obtener la información de los episodios.')
        setIsLoadingEpisodes(false)
      })

    // Limpieza: cancelamos la petición y anulamos la actualización pendiente.
    return () => {
      isActive = false
      controller.abort()
    }
  }, [character])

  // -------------------------------------------------------------------------
  // 4. Bloqueo del scroll de fondo mientras el modal está abierto
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!character) return undefined

    // Guardamos el valor previo para restaurarlo al cerrar (evita dejar el
    // body bloqueado si algo falla).
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [character])

  // -------------------------------------------------------------------------
  // 5. Render
  // -------------------------------------------------------------------------
  return (
    // El <dialog> SIEMPRE existe en el DOM (para que el ref sea válido); su
    // contenido interno se monta solo cuando hay un personaje seleccionado.
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-labelledby={character ? 'modal-character-name' : undefined}
    >
      {character && (
        <div className="modal__content">
          <button
            type="button"
            className="modal__close-btn"
            onClick={onClose}
            aria-label="Cerrar ventana de detalles"
          >
            ✕
          </button>

          <header className="modal__header">
            <img
              className="modal__avatar"
              src={character.image}
              alt={character.name}
            />
            <div className="modal__info">
              <h2 id="modal-character-name">{character.name}</h2>
              <span className="character-card__status">
                <span
                  className={`status-dot status-dot--${character.status?.toLowerCase() || 'unknown'}`}
                  aria-hidden="true"
                ></span>
                {character.status} — {character.species}
              </span>
            </div>
          </header>

          <div className="modal__body">
            <section>
              <h4 className="modal__section-title">Información</h4>
              <div className="modal__meta-grid">
                <div className="character-card__meta-item">
                  <span className="label">Género:</span>
                  <span className="value">{character.gender}</span>
                </div>
                <div className="character-card__meta-item">
                  <span className="label">Tipo:</span>
                  <span className="value">{character.type || 'N/A'}</span>
                </div>
                <div className="character-card__meta-item">
                  <span className="label">Origen:</span>
                  <span className="value">{character.origin?.name}</span>
                </div>
                <div className="character-card__meta-item">
                  <span className="label">Última ubicación:</span>
                  <span className="value">{character.location?.name}</span>
                </div>
              </div>
            </section>

            <section>
              <h4 className="modal__section-title">
                Episodios (
                {!isLoadingEpisodes && episodes.length > 0
                  ? `mostrando ${episodes.length} de ${totalEpisodes}`
                  : totalEpisodes}
                )
              </h4>

              {isLoadingEpisodes && (
                <p style={{ color: '#9aa0a6', fontSize: '0.9rem' }}>
                  Cargando episodios del multiverso...
                </p>
              )}

              {!isLoadingEpisodes && episodesError && (
                <p role="alert" style={{ color: '#d63d2e', fontSize: '0.85rem' }}>
                  {episodesError}
                </p>
              )}

              {!isLoadingEpisodes && !episodesError && episodes.length > 0 && (
                <div className="modal__episodes-list">
                  {episodes.map((episode) => (
                    <span
                      key={episode.id}
                      className="episode-badge"
                      title={`${episode.episode}: ${episode.name}`}
                    >
                      {episode.episode}: {episode.name}
                    </span>
                  ))}
                </div>
              )}

              {!isLoadingEpisodes && !episodesError && episodes.length === 0 && (
                <p style={{ color: '#9aa0a6', fontSize: '0.85rem' }}>
                  No se pudo obtener la información de los episodios.
                </p>
              )}
            </section>
          </div>
        </div>
      )}
    </dialog>
  )
}

export default CharacterModal
