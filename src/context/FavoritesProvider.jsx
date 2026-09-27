/**
 * @file FavoritesProvider.jsx
 * @description Proveedor global del estado de favoritos con persistencia.
 *
 * ESTE ARCHIVO EXPORTA SOLO UN COMPONENTE (requisito de `react-refresh`).
 * La definición del contexto y el hook `useFavorites` viven en
 * `favoritesContext.js`.
 *
 * ESTRATEGIA DE ESTADO:
 *  - Fuente de verdad: un array `favorites` con los personajes completos. Así
 *    la vista de favoritos funciona 100% offline, sin volver a llamar a la API.
 *  - Verificación O(1): derivamos un `Set` de ids para saber al instante si un
 *    personaje es favorito, sin recorrer el array en cada tarjeta.
 *  - Persistencia: un `useEffect` escribe en `localStorage` ante cada cambio.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { FavoritesContext } from './favoritesContext.js'
import {
  getStoredFavorites,
  saveStoredFavorites,
} from '../services/favoritesStorage.js'

/**
 * Envuelve la aplicación y comparte el estado de favoritos con todos sus hijos.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Subárbol de la aplicación.
 */
export function FavoritesProvider({ children }) {
  // Inicialización perezosa: `localStorage` solo se lee UNA vez, en el montaje,
  // y no en cada re-render (evita I/O síncrono innecesario).
  const [favorites, setFavorites] = useState(() => getStoredFavorites())

  // Sincronización con el sistema externo (localStorage) ante cada cambio.
  // No usamos setState aquí, por lo que no viola `set-state-in-effect`.
  useEffect(() => {
    saveStoredFavorites(favorites)
  }, [favorites])

  // Conjunto de ids para comprobaciones en tiempo constante O(1).
  // `useMemo` evita reconstruir el Set si `favorites` no cambió.
  const favoriteIds = useMemo(
    () => new Set(favorites.map((character) => character.id)),
    [favorites],
  )

  // ¿Es favorito este id? Búsqueda O(1) en el Set.
  const isFavorite = useCallback(
    (id) => favoriteIds.has(id),
    [favoriteIds],
  )

  // Alterna: si existe lo quita; si no, lo agrega al inicio de la lista.
  // Usamos el updater funcional `(prev) => ...` para operar SIEMPRE sobre el
  // estado más reciente y evitar stale closures al marcar varias estrellas
  // en rápida sucesión.
  const toggleFavorite = useCallback((character) => {
    setFavorites((prev) =>
      prev.some((item) => item.id === character.id)
        ? prev.filter((item) => item.id !== character.id)
        : [character, ...prev],
    )
  }, [])

  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [])

  // Memorizamos el objeto de valor para que los consumidores no se re-rendericen
  // si el provider se vuelve a renderizar sin cambios reales en favoritos.
  const contextValue = useMemo(
    () => ({
      favorites,
      favoritesCount: favorites.length,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      clearFavorites,
    }),
    [favorites, isFavorite, toggleFavorite, removeFavorite, clearFavorites],
  )

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  )
}

export default FavoritesProvider
