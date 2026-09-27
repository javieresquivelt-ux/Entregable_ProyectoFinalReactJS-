/**
 * @file api.js
 * @description Capa de Servicios (Service Layer) para el Rick and Morty Explorer.
 *
 * ¿POR QUÉ UNA CAPA DE SERVICIOS?
 * Centralizamos TODA la comunicación HTTP en un único módulo. Así los
 * componentes y hooks nunca conocen la URL base, el formato de la respuesta ni
 * las particularidades de la API. Si mañana cambia el endpoint o se migra a
 * Axios, solo se toca este archivo (Principio de Responsabilidad Única - SRP).
 *
 * Documentación oficial de la API: https://rickandmortyapi.com/documentation
 */

// ---------------------------------------------------------------------------
// Configuración base
// ---------------------------------------------------------------------------

/**
 * URL raíz de la API. Se expone como constante para evitar "números mágicos"
 * repetidos y facilitar el cambio de entorno (por ejemplo, un mock en tests).
 */
export const BASE_URL = 'https://rickandmortyapi.com/api'

/**
 * Error personalizado para la capa de servicios.
 *
 * ¿POR QUÉ EXTENDER `Error`?
 * Nos permite distinguir en el hook si un fallo provino de la API (con un
 * código HTTP) de un error de programación. Además `instanceof ApiError`
 * funciona correctamente, a diferencia de lanzar objetos planos.
 */
export class ApiError extends Error {
  /**
   * @param {string} message - Mensaje legible para el usuario/desarrollador.
   * @param {number} [status] - Código de estado HTTP asociado (si existe).
   */
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// ---------------------------------------------------------------------------
// Utilidades internas
// ---------------------------------------------------------------------------

/**
 * Construye un objeto `URLSearchParams` descartando los valores vacíos.
 *
 * ¿POR QUÉ DESCARTAR VACÍOS?
 * La API interpreta `?name=` como una búsqueda de cadena vacía (que puede
 * devolver resultados inesperados). Al omitir claves sin valor garantizamos
 * que "sin filtro" signifique realmente "sin parámetro" en la URL.
 *
 * @param {Record<string, string|number|undefined|null>} params
 * @returns {URLSearchParams}
 */
function buildQueryParams(params) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    // Ignoramos null, undefined y cadenas vacías/solo-espacios.
    if (value === null || value === undefined) return
    if (typeof value === 'string' && value.trim() === '') return
    searchParams.append(key, String(value).trim())
  })

  return searchParams
}

/**
 * Realiza una petición `fetch` y normaliza la respuesta en JSON.
 *
 * @param {string} url - URL absoluta a consultar.
 * @param {AbortSignal} [signal] - Señal para cancelar la petición en curso.
 * @returns {Promise<any>} El cuerpo de la respuesta ya parseado a JSON.
 * @throws {ApiError} Si el servidor responde con un error HTTP o falla la red.
 */
async function request(url, signal) {
  let response

  try {
    response = await fetch(url, { signal })
  } catch (error) {
    // `AbortError` NO es un fallo real: la petición fue cancelada a propósito
    // (por ejemplo, el usuario siguió escribiendo). Lo re-lanzamos tal cual
    // para que el hook pueda ignorarlo sin mostrarlo como error al usuario.
    if (error.name === 'AbortError') throw error

    throw new ApiError(
      'No se pudo conectar con el servidor. Revisa tu conexión a internet.',
      0,
    )
  }

  if (!response.ok) {
    throw new ApiError(
      `La API respondió con un error (HTTP ${response.status}).`,
      response.status,
    )
  }

  return response.json()
}

// ---------------------------------------------------------------------------
// Endpoints públicos
// ---------------------------------------------------------------------------

/**
 * Obtiene un listado paginado de personajes, con búsqueda y filtros opcionales.
 *
 * COMPORTAMIENTO CLAVE — MANEJO DEFENSIVO DEL 404:
 * Cuando la búsqueda no arroja resultados, la API responde `404` en lugar de
 * un listado vacío. Ese 404 NO es un error para nuestra UX: significa
 * "no hay personajes que coincidan". Por eso lo traducimos a una estructura
 * vacía válida, en vez de lanzar una excepción que rompería el flujo.
 *
 * @param {object} [options]
 * @param {number} [options.page=1] - Número de página a consultar.
 * @param {string} [options.name] - Filtro por nombre (parcial).
 * @param {string} [options.status] - Estado: 'alive' | 'dead' | 'unknown'.
 * @param {string} [options.gender] - Género: 'female' | 'male' | 'genderless' | 'unknown'.
 * @param {string} [options.species] - Especie (ej. 'Human').
 * @param {AbortSignal} [options.signal] - Señal de cancelación.
 * @returns {Promise<{results: object[], info: {count:number, pages:number, next:string|null, prev:string|null}}>}
 */
export async function fetchCharacters({
  page = 1,
  name = '',
  status = '',
  gender = '',
  species = '',
  signal,
} = {}) {
  const query = buildQueryParams({ page, name, status, gender, species })
  const url = `${BASE_URL}/character?${query.toString()}`

  try {
    return await request(url, signal)
  } catch (error) {
    // Traducimos el 404 "sin resultados" a un estado vacío legible por la UI.
    if (error instanceof ApiError && error.status === 404) {
      return {
        results: [],
        info: { count: 0, pages: 0, next: null, prev: null },
      }
    }
    // Cualquier otro error (red, 500, abort) se propaga al hook.
    throw error
  }
}

/**
 * Obtiene el detalle de un personaje por su id.
 * Se usará en la Fase 5 (Modal de detalle) si se requiere refrescar datos.
 *
 * @param {number|string} id - Identificador del personaje.
 * @param {AbortSignal} [signal] - Señal de cancelación.
 * @returns {Promise<object>}
 */
export async function fetchCharacter(id, signal) {
  return request(`${BASE_URL}/character/${id}`, signal)
}

/**
 * Resuelve múltiples episodios CONCURRENTEMENTE a partir de sus URLs.
 *
 * ¿POR QUÉ `Promise.all`?
 * Un personaje puede aparecer en decenas de episodios. Si los pidiéramos en
 * secuencia (uno tras otro), el tiempo total sería la suma de todas las
 * latencias. `Promise.all` lanza las peticiones en paralelo y espera el
 * conjunto, reduciendo el tiempo al del episodio más lento.
 *
 * ¿POR QUÉ UN LÍMITE?
 * Rick Sanchez aparece en 51 episodios. Limitar (por defecto a 20) protege la
 * cuota de la API y mantiene el modal ágil, en línea con la decisión heredada
 * del proyecto original en Vanilla JS.
 *
 * Las respuestas fallidas se descartan silenciosamente (`filter(res => res.ok)`)
 * para que un único episodio roto no derribe toda la carga.
 *
 * @param {string[]} urls - Lista de URLs absolutas de episodios.
 * @param {number} [limit=20] - Máximo de episodios a resolver.
 * @param {AbortSignal} [signal] - Señal de cancelación.
 * @returns {Promise<object[]>} Lista de episodios resueltos con éxito.
 */
export async function fetchEpisodesByUrls(urls = [], limit = 20, signal) {
  // Defensa ante entradas no válidas.
  if (!Array.isArray(urls) || urls.length === 0) return []

  const selectedUrls = urls.slice(0, limit)

  const responses = await Promise.all(
    selectedUrls.map((url) =>
      fetch(url, { signal })
        .then((res) => (res.ok ? res.json() : null))
        // Aislamos el fallo individual para no romper el `Promise.all`.
        .catch(() => null),
    ),
  )

  // Filtramos los `null` provenientes de respuestas fallidas o canceladas.
  return responses.filter((episode) => episode !== null)
}
