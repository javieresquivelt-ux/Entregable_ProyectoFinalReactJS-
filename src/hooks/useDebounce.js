/**
 * @file useDebounce.js
 * @description Custom Hook que aplica la técnica de *debounce* (rebote) a un valor.
 *
 * ¿QUÉ ES DEBOUNCE Y POR QUÉ LO NECESITAMOS?
 * Si conectáramos el `onChange` de un buscador directamente a una petición HTTP,
 * cada pulsación de tecla dispararía una consulta a la API. Al escribir "Rick"
 * (4 letras) generaríamos 4 peticiones, de las cuales solo la última importa.
 *
 * El *debounce* retrasa la propagación del valor hasta que el usuario deja de
 * escribir durante un intervalo (`delay`). Así pasamos de N peticiones a 1.
 *
 * NOTA PEDAGÓGICA:
 * Este hook NO usa `useRef` ni `useCallback` porque no necesita conservar la
 * función callback entre renders: solo observa `value` y programa un temporizador.
 * La clave está en la LIMPIEZA del `useEffect`: cada vez que `value` cambia,
 * React ejecuta el `cleanup` del efecto anterior, cancelando el `setTimeout`
 * pendiente antes de programar el nuevo.
 */

import { useEffect, useState } from 'react'

/**
 * Devuelve una versión "retardada" del valor recibido.
 *
 * @param {*} value - Valor a diferir (típicamente el texto de un input).
 * @param {number} [delay=350] - Milisegundos de espera tras el último cambio.
 * @returns {*} El valor actualizado solo cuando transcurre `delay` sin cambios.
 */
export function useDebounce(value, delay = 350) {
  // Estado interno que almacena el valor "estabilizado". Se inicializa con el
  // valor de entrada para evitar un primer render con `undefined`.
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // 1. Programamos la actualización del valor diferido.
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // 2. Función de limpieza: si `value` o `delay` cambian antes de que el
    //    temporizador se cumpla, cancelamos el anterior. Este es el corazón
    //    del debounce: "reinicia el reloj" en cada pulsación.
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
