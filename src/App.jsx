/**
 * @file App.jsx
 * @description Componente raíz de la aplicación Rick and Morty Explorer.
 *
 * RESPONSABILIDAD: Orquestar el layout y actuar como FUENTE ÚNICA DE LA VERDAD
 * (Single Source of Truth) del estado de filtros y navegación. Los componentes
 * hijos (Header, SearchControls, CharacterGrid, Pagination...) son "tontos":
 * reciben datos y emiten eventos, pero no guardan estado propio.
 *
 * Los FAVORITOS, por ser un estado transversal, viven en un Context global
 * (`FavoritesProvider`) y se consumen aquí mediante el hook `useFavorites()`.
 *
 * FLUJO DE DATOS (unidireccional):
 *   App (estado) ──props──> SearchControls / CharacterGrid / Pagination
 *        │                        │
 *        │   callbacks (onChange, onToggleFavorite, ...)
 *        │<───────────────────────┘
 *        ▼
 *   useCharacters({ name: debounced, status, gender, enabled }) ──> API
 *
 * ACCESIBILIDAD (WCAG 2.1 AA):
 * - Skip link: primer elemento tabulable, salta a `<main id="main-content">`.
 * - Panel "Todos" tiene `id="panel-all"` + `aria-labelledby="tab-all"` (vinculado
 *   con el botón homólogo en SearchControls).
 * - Panel "Favoritos" tiene `id="panel-favorites"` + `aria-labelledby="tab-favorites"`.
 * - `aria-busy={isLoading}` en el panel del catálogo: indica a AT que el
 *   contenido se está actualizando.
 * - Región `aria-live="polite"` (visualmente oculta) anuncia el conteo de
 *   resultados al cambiar filtros.
 */

import { useMemo, useState } from 'react'
import { Header } from './components/layout/Header.jsx'
import { SearchControls } from './components/controls/SearchControls.jsx'
import { CharacterGrid } from './components/cards/CharacterGrid.jsx'
import { Pagination } from './components/controls/Pagination.jsx'
import { CharacterModal } from './components/modal/CharacterModal.jsx'
import { Loader } from './components/feedback/Loader.jsx'
import { ErrorMessage } from './components/feedback/ErrorMessage.jsx'
import { EmptyState } from './components/feedback/EmptyState.jsx'
import { useCharacters } from './hooks/useCharacters.js'
import { useDebounce } from './hooks/useDebounce.js'
import { useFavorites } from './context/favoritesContext.js'

function App() {
  // -------------------------------------------------------------------------
  // 1. Estado de los controles (fuente única de la verdad)
  // -------------------------------------------------------------------------
  // `searchTerm` es el valor INMEDIATO del input: se actualiza en cada tecla
  // para que el campo nunca se sienta lento.
  const [searchTerm, setSearchTerm] = useState('')
  const [status, setStatus] = useState('')
  const [gender, setGender] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  // Personaje seleccionado para el modal de detalle (null = modal cerrado).
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  // `debouncedSearchTerm` es el valor OPTIMIZADO: solo cambia cuando el usuario
  // deja de escribir por 350 ms. Es este valor (no `searchTerm`) el que viaja a
  // la API, evitando una petición por pulsación.
  const debouncedSearchTerm = useDebounce(searchTerm, 350)

  // Bandera derivada (no es estado): nos dice si hay algo que limpiar.
  const hasActiveFilters = Boolean(searchTerm.trim() || status || gender)

  // Reinicia todos los controles de una sola vez.
  const handleClearFilters = () => {
    setSearchTerm('')
    setStatus('')
    setGender('')
  }

  // -------------------------------------------------------------------------
  // 2. Estado global de favoritos (Context)
  // -------------------------------------------------------------------------
  const { favorites, favoritesCount, isFavorite, toggleFavorite } = useFavorites()

  // -------------------------------------------------------------------------
  // 3. Consumo de datos a través del Custom Hook
  // -------------------------------------------------------------------------
  // `enabled` pausa las peticiones mientras no estemos en la pestaña "Todos":
  // así la vista de Favoritos (que filtra en memoria) no golpea la API.
  const {
    characters,
    info,
    page,
    isLoading,
    error,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    refetch,
  } = useCharacters({
    name: debouncedSearchTerm,
    status,
    gender,
    enabled: activeTab === 'all',
  })

  // -------------------------------------------------------------------------
  // 4. Filtrado LOCAL de favoritos (sin red)
  // -------------------------------------------------------------------------
  // Aplicamos los mismos controles (nombre, estado, género) sobre la lista en
  // memoria. `useMemo` evita refiltrar en cada render si nada cambió.
  const filteredFavorites = useMemo(() => {
    const term = debouncedSearchTerm.trim().toLowerCase()

    return favorites.filter((character) => {
      // Nombre: coincidencia parcial y sin distinguir mayúsculas.
      const matchesName = !term || character.name.toLowerCase().includes(term)
      // Estado y género: comparación normalizada (API: "Alive" vs filtro "alive").
      const matchesStatus =
        !status || character.status?.toLowerCase() === status
      const matchesGender =
        !gender || character.gender?.toLowerCase() === gender

      return matchesName && matchesStatus && matchesGender
    })
  }, [favorites, debouncedSearchTerm, status, gender])

  // -------------------------------------------------------------------------
  // 5. Mensaje para la región aria-live de resultados (WCAG 1.3.1 / 4.1.3)
  // -------------------------------------------------------------------------
  // Este texto es anunciado por los lectores de pantalla cada vez que cambia
  // el número de resultados, gracias a `aria-live="polite"`.
  // Se omite visualmente mediante la clase `.visually-hidden` (_reset.scss).
  //
  // EVITAR DOBLE ANUNCIO: durante la carga o el error, dejamos esta región vacía
  // porque `Loader` (role="status") y `ErrorMessage` (role="alert") ya comunican
  // esos estados. Así cada mensaje se anuncia una sola vez.
  const liveAnnouncement =
    activeTab === 'all'
      ? isLoading || error
        ? ''
        : `${characters.length} personaje${characters.length !== 1 ? 's' : ''} encontrado${characters.length !== 1 ? 's' : ''} en la página ${page}.`
      : `${filteredFavorites.length} personaje${filteredFavorites.length !== 1 ? 's' : ''} favorito${filteredFavorites.length !== 1 ? 's' : ''} ${hasActiveFilters ? 'coinciden con los filtros actuales' : 'guardados'}.`

  // -------------------------------------------------------------------------
  // 6. Render
  // -------------------------------------------------------------------------
  return (
    <div className="app-layout">
      {/* Skip link: primer elemento tabulable de la página (WCAG 2.4.1).
          Salta directamente al contenido principal, omitiendo la navegación.
          Visible SOLO al recibir el foco con Tab (ver .skip-link en _reset.scss). */}
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      <Header />

      {/* Región aria-live: visualmente invisible, pero leída por AT cada vez
          que cambia el conteo de resultados o el estado de la carga. */}
      <span className="visually-hidden" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </span>

      {/* `tabIndex={-1}` hace que <main> sea enfocable por programa: al pulsar
          el skip-link, el foco aterriza realmente en el contenido (WCAG 2.4.1). */}
      <main id="main-content" className="container" tabIndex={-1}>
        <SearchControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          status={status}
          onStatusChange={setStatus}
          gender={gender}
          onGenderChange={setGender}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          favoritesCount={favoritesCount}
        />

        {activeTab === 'all' ? (
          // Panel de la pestaña "Todos": catálogo definitivo con estados de
          // feedback mutuamente excluyentes (carga / error / vacío / datos).
          // `aria-busy` indica a los AT que el contenido se está actualizando.
          <section
            id="panel-all"
            className="main-content"
            role="tabpanel"
            aria-labelledby="tab-all"
            aria-busy={isLoading}
          >
            {isLoading && <Loader />}

            {!isLoading && error && (
              <ErrorMessage message={error} onRetry={refetch} />
            )}

            {!isLoading && !error && characters.length === 0 && (
              <EmptyState
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            )}

            {!isLoading && !error && characters.length > 0 && (
              <>
                <CharacterGrid
                  characters={characters}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                  onSelectCharacter={setSelectedCharacter}
                />

                <Pagination
                  page={page}
                  totalPages={info.pages}
                  hasPrevPage={hasPrevPage}
                  hasNextPage={hasNextPage}
                  onPrevPage={prevPage}
                  onNextPage={nextPage}
                />
              </>
            )}
          </section>
        ) : (
          // Panel de la pestaña "Favoritos": renderiza desde memoria (sin red).
          <section
            id="panel-favorites"
            className="main-content"
            role="tabpanel"
            aria-labelledby="tab-favorites"
          >
            {favorites.length === 0 ? (
              // Caso A: todavía no hay favoritos guardados.
              <div className="status-feedback">
                <span className="status-feedback__icon" aria-hidden="true">
                  ⭐
                </span>
                <h3 className="status-feedback__title">
                  Aún no tienes personajes favoritos
                </h3>
                <p className="status-feedback__desc">
                  Explora el multiverso y marca tus personajes favoritos con la
                  estrella para verlos aquí.
                </p>
              </div>
            ) : filteredFavorites.length === 0 ? (
              // Caso B: hay favoritos, pero no coinciden con los filtros activos.
              <EmptyState
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            ) : (
              // Caso C: favoritos filtrados listos para mostrar.
              <CharacterGrid
                characters={filteredFavorites}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                onSelectCharacter={setSelectedCharacter}
              />
            )}
          </section>
        )}
      </main>

      {/* Modal de detalle: vive fuera del <main> porque usa la capa superior
          nativa del navegador (top layer) al invocar showModal(). */}
      <CharacterModal
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
      />
    </div>
  )
}

export default App
