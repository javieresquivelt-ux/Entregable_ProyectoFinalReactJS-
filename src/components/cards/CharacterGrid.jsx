/**
 * @file CharacterGrid.jsx
 * @description Contenedor de disposición (layout) que distribuye las tarjetas.
 *
 * RESPONSABILIDAD ÚNICA:
 * Solo se ocupa del "cómo se acomodan" las tarjetas, no de "qué datos" tienen.
 * El número de columnas (1 a 4) lo resuelve el CSS Grid responsive definido en
 * `src/scss/layout/_grid.scss`, así que este componente no necesita conocer
 * breakpoints: delega todo al estilo.
 *
 * La `key` es obligatoria en listas de React: permite identificar cada elemento
 * de forma estable para un re-renderizado eficiente (usa `character.id`, único).
 */

import { CharacterCard } from './CharacterCard.jsx'

/**
 * @param {object} props
 * @param {object[]} props.characters - Lista de personajes a renderizar.
 * @param {(id: number|string) => boolean} [props.isFavorite] - Indica si un id es favorito.
 * @param {(character: object) => void} [props.onToggleFavorite] - Alterna favorito.
 * @param {(character: object) => void} [props.onSelectCharacter] - Abre el detalle.
 */
export function CharacterGrid({
  characters,
  isFavorite,
  onToggleFavorite,
  onSelectCharacter,
}) {
  return (
    <div className="characters-grid">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          // Evaluamos el favorito por id (búsqueda O(1) en el Set del contexto).
          isFavorite={isFavorite ? isFavorite(character.id) : false}
          onToggleFavorite={onToggleFavorite}
          onSelectCharacter={onSelectCharacter}
        />
      ))}
    </div>
  )
}

export default CharacterGrid
