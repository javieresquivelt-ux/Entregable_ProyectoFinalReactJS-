/**
 * @file CharacterCard.jsx
 * @description Tarjeta individual de personaje (componente atómico y de presentación).
 *
 * RESPONSABILIDAD ÚNICA:
 * Mostrar los datos de UN personaje y emitir eventos de interacción. No conoce
 * la API, ni la grilla, ni el estado de favoritos global. Todo lo recibe por
 * props y lo comunica mediante callbacks. Esto la hace reutilizable y testeable.
 *
 * ¿POR QUÉ `onToggleFavorite?.(character)` CON OPTIONAL CHAINING?
 * Los callbacks son opcionales: si el componente se usa en un contexto sin esa
 * funcionalidad, el `?.` evita un error de "no es una función".
 */

/**
 * @param {object} props
 * @param {object} props.character - Objeto de personaje de la API.
 * @param {boolean} [props.isFavorite=false] - Si el personaje está en favoritos.
 * @param {(character: object) => void} [props.onToggleFavorite] - Alterna favorito.
 * @param {(character: object) => void} [props.onSelectCharacter] - Abre el detalle.
 */
export function CharacterCard({
  character,
  isFavorite = false,
  onToggleFavorite,
  onSelectCharacter,
}) {
  // Derivamos el modificador del punto de estado desde el dato de la API.
  // `toLowerCase()` normaliza "Alive"/"Dead"/"unknown" a las clases del Sass.
  const statusModifier = character.status?.toLowerCase() || 'unknown'

  return (
    <article className="character-card">
      <div className="character-card__media">
        <img
          className="character-card__image"
          src={character.image}
          alt={character.name}
          // Carga diferida nativa: ahorra ancho de banda en móvil.
          loading="lazy"
        />

        {/* Botón flotante de favoritos. El `aria-label` describe la acción. */}
        <button
          type="button"
          className={`btn btn--favorite character-card__fav-btn ${isFavorite ? 'is-favorite' : ''}`}
          onClick={() => onToggleFavorite?.(character)}
          aria-label={
            isFavorite
              ? `Quitar a ${character.name} de favoritos`
              : `Agregar a ${character.name} a favoritos`
          }
        >
          ★
        </button>
      </div>

      <div className="character-card__body">
        <div className="character-card__header">
          <h3 className="character-card__name" title={character.name}>
            {character.name}
          </h3>

          <span className="character-card__status">
            {/* Punto lumínico decorativo: el estado ya se lee en el texto de al lado. */}
            <span
              className={`status-dot status-dot--${statusModifier}`}
              aria-hidden="true"
            ></span>
            {character.status} — {character.species}
          </span>
        </div>

        <div className="character-card__meta">
          <div className="character-card__meta-item">
            <span className="label">Origen:</span>
            <span className="value" title={character.origin?.name}>
              {character.origin?.name}
            </span>
          </div>

          <div className="character-card__meta-item">
            <span className="label">Última ubicación:</span>
            <span className="value" title={character.location?.name}>
              {character.location?.name}
            </span>
          </div>
        </div>

        <div className="character-card__footer">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => onSelectCharacter?.(character)}
          >
            Ver detalles
          </button>
        </div>
      </div>
    </article>
  )
}

export default CharacterCard
