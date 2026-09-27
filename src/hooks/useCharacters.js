/**
 * @file useCharacters.js
 * @description Custom Hook que encapsula TODA la lógica de datos del catálogo
 * de personajes: filtros, paginación, estados de carga/error y cancelación de
 * peticiones.
 *
 * ¿POR QUÉ UN CUSTOM HOOK?
 * Un componente no debería saber "cómo" se obtienen los datos, solo "qué"
 * mostrar. Al extraer esta lógica aquí:
 *   1. El componente queda limpio y enfocado en la presentación (SRP).
 *   2. La lógica es testeable y reutilizable en cualquier vista.
 *   3. Los efectos secundarios quedan aislados y documentados en un solo lugar.
 */

import { useCallback, useEffect, useState } from 'react'
import { fetchCharacters } from '../services/api.js'

/**
 * Estado inicial de la metadata de paginación que devuelve la API.
 * Se usa como valor de reposo y al limpiar tras un error.
 */
const EMPTY_INFO = { count: 0, pages: 0, next: null, prev: null }

/**
 * Hook de gestión de personajes con búsqueda, filtros y paginación.
 *
 * @param {object} [filters]
 * @param {string} [filters.name] - Término de búsqueda por nombre.
 * @param {string} [filters.status] - 'alive' | 'dead' | 'unknown'.
 * @param {string} [filters.gender] - 'female' | 'male' | 'genderless' | 'unknown'.
 * @param {string} [filters.species] - Especie (ej. 'Human').
 * @param {boolean} [filters.enabled=true] - Si es `false`, el hook NO consulta
 *   la API (útil para pausar peticiones cuando el catálogo no está visible).
 * @returns {{
 *   characters: object[],
 *   info: {count:number, pages:number, next:string|null, prev:string|null},
 *   page: number,
 *   isLoading: boolean,
 *   error: string|null,
 *   hasNextPage: boolean,
 *   hasPrevPage: boolean,
 *   nextPage: () => void,
 *   prevPage: () => void,
 *   goToPage: (page:number) => void,
 *   refetch: () => void
 * }}
 */
export function useCharacters({
  name = '',
  status = '',
  gender = '',
  species = '',
  enabled = true,
} = {}) {
  // -------------------------------------------------------------------------
  // 1. Estado del hook
  // -------------------------------------------------------------------------
  const [characters, setCharacters] = useState([])
  const [info, setInfo] = useState(EMPTY_INFO)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  // Token incremental que, al cambiar, fuerza una nueva consulta (refetch).
  const [reloadToken, setReloadToken] = useState(0)

  // -------------------------------------------------------------------------
  // 2. Reset de página al cambiar los filtros
  // -------------------------------------------------------------------------
  // PATRÓN "AJUSTAR ESTADO DURANTE EL RENDER" (recomendado por React):
  // Si el usuario está en la página 5 y escribe una búsqueda, la nueva consulta
  // podría no tener 5 páginas. En lugar de usar un `useEffect` (que provocaría
  // un render extra y una petición con datos obsoletos), comparamos los filtros
  // actuales con los previos y, si cambiaron, reiniciamos la página aquí mismo.
  // React re-renderiza inmediatamente sin pintar el estado intermedio.
  const [prevFilters, setPrevFilters] = useState({ name, status, gender, species })

  if (
    prevFilters.name !== name ||
    prevFilters.status !== status ||
    prevFilters.gender !== gender ||
    prevFilters.species !== species
  ) {
    setPrevFilters({ name, status, gender, species })
    setPage(1)
  }

  // -------------------------------------------------------------------------
  // 3. Efecto de carga de datos (con cancelación)
  // -------------------------------------------------------------------------
  useEffect(() => {
    // Si el catálogo no está visible (p. ej. pestaña "Favoritos"), no gastamos
    // peticiones de red. El hook simplemente no ejecuta la carga.
    if (!enabled) return undefined

    // AbortController nos permite CANCELAR la petición anterior cuando cambian
    // los filtros o la página. Sin esto, respuestas lentas y fuera de orden
    // podrían sobrescribir a respuestas más recientes ("race condition").
    const controller = new AbortController()
    // Bandera para evitar actualizar estado tras el desmontaje del componente.
    let isActive = true

    async function loadCharacters() {
      setIsLoading(true)
      setError(null)

      try {
        const data = await fetchCharacters({
          page,
          name,
          status,
          gender,
          species,
          signal: controller.signal,
        })

        // Si el efecto ya se limpió (filtro cambiado o desmontaje), descartamos.
        if (!isActive) return

        setCharacters(data.results)
        setInfo(data.info)
      } catch (err) {
        // Una cancelación intencional NO es un error: la ignoramos.
        if (err.name === 'AbortError') return
        if (!isActive) return

        setError(err.message || 'Ocurrió un error inesperado al cargar los personajes.')
        setCharacters([])
        setInfo(EMPTY_INFO)
      } finally {
        // Solo apagamos el loader si seguimos "activos".
        if (isActive) setIsLoading(false)
      }
    }

    loadCharacters()

    // Función de limpieza: se ejecuta antes del siguiente efecto o al desmontar.
    return () => {
      isActive = false
      controller.abort()
    }
  }, [page, name, status, gender, species, reloadToken, enabled])

  // -------------------------------------------------------------------------
  // 4. Controles de paginación
  // -------------------------------------------------------------------------
  // `useCallback` memoriza las funciones para que no se recreen en cada render.
  // Así, si en el futuro se pasan a componentes hijos memorizados (`memo`),
  // no provocarán re-renders innecesarios.

  const hasNextPage = page < info.pages
  const hasPrevPage = page > 1

  const nextPage = useCallback(() => {
    setPage((current) => (current < info.pages ? current + 1 : current))
  }, [info.pages])

  const prevPage = useCallback(() => {
    setPage((current) => (current > 1 ? current - 1 : current))
  }, [])

  const goToPage = useCallback(
    (targetPage) => {
      const safePage = Math.min(Math.max(1, targetPage), info.pages || 1)
      setPage(safePage)
    },
    [info.pages],
  )

  // Permite forzar una recarga manual (útil tras un error de red). El cambio de
  // `reloadToken` está en las dependencias del efecto principal, por lo que
  // dispara una nueva consulta sin alterar los filtros ni la página actual.
  const refetch = useCallback(() => setReloadToken((token) => token + 1), [])

  return {
    characters,
    info,
    page,
    isLoading,
    error,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
    refetch,
  }
}
