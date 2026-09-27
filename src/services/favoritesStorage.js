/**
 * @file favoritesStorage.js
 * @description Capa de persistencia de favoritos sobre la Web Storage API.
 *
 * ¿POR QUÉ AISLAR EL ACCESO A `localStorage`?
 *  1. Responsabilidad Única (SRP): el resto de la app no sabe "dónde" ni "cómo"
 *     se guardan los favoritos, solo pide el array y confía.
 *  2. Robustez: `localStorage` puede no estar disponible (modo privado estricto)
 *     o estar corrupto/cuota llena. Envolver todo en `try/catch` evita que un
 *     fallo de almacenamiento rompa la aplicación (que seguiría funcionando
 *     en memoria).
 *
 * CLAVE: usamos `rmx_react_favorites` para no colisionar con el proyecto
 * original en Vanilla JS, que usaba `rmx_favorites`.
 */

const STORAGE_KEY = 'rmx_react_favorites'

/**
 * Lee y deserializa la lista de favoritos almacenada.
 *
 * @returns {object[]} Array de personajes favoritos, o `[]` si no hay nada o
 *                     si el dato almacenado está corrupto.
 */
export function getStoredFavorites() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)

    // Validación defensiva: si el JSON no es un array (dato corrupto o
    // manipulado), lo descartamos para no romper el render de la lista.
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // JSON inválido, localStorage bloqueado, etc.
    return []
  }
}

/**
 * Serializa y persiste la lista de favoritos.
 *
 * @param {object[]} favorites - Array de personajes a guardar.
 */
export function saveStoredFavorites(favorites) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  } catch {
    // `QuotaExceededError` u otros fallos de escritura: se ignoran de forma
    // silenciosa. La app mantiene los favoritos en memoria durante la sesión.
  }
}
