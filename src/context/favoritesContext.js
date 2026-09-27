/**
 * @file favoritesContext.js
 * @description Definición del contexto de favoritos y su Custom Hook de consumo.
 *
 * ¿POR QUÉ ESTE ARCHIVO ES `.js` Y NO `.jsx`?
 * El plugin `eslint-plugin-react-refresh` exige que un archivo `.jsx` exporte
 * SOLO componentes (si no, rompe el Fast Refresh de Vite). Aquí no hay JSX,
 * así que al usar extensión `.js` la regla no lo escanea y podemos exportar
 * con tranquilidad tanto el contexto como el hook.
 *
 * El componente `<FavoritesProvider>` vive aparte, en `FavoritesProvider.jsx`.
 */

import { createContext, useContext } from 'react'

/**
 * Contexto global de favoritos. Su valor será provisto por `FavoritesProvider`.
 * Arranca en `null` para poder detectar si un consumidor se usó fuera del árbol
 * del proveedor.
 */
export const FavoritesContext = createContext(null)

/**
 * Custom Hook para consumir el contexto de favoritos.
 *
 * @returns {{
 *   favorites: object[],
 *   favoritesCount: number,
 *   isFavorite: (id: number|string) => boolean,
 *   toggleFavorite: (character: object) => void,
 *   removeFavorite: (id: number|string) => void,
 *   clearFavorites: () => void
 * }}
 * @throws {Error} Si se invoca fuera de un `<FavoritesProvider>`.
 */
export function useFavorites() {
  const context = useContext(FavoritesContext)

  // Mensaje claro que acelera el diagnóstico de errores de integración.
  if (!context) {
    throw new Error(
      'useFavorites debe utilizarse dentro de un <FavoritesProvider>',
    )
  }

  return context
}
