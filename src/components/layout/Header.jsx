/**
 * @file Header.jsx
 * @description Encabezado principal de la aplicación (componente de presentación).
 *
 * ¿POR QUÉ UN COMPONENTE DE PRESENTACIÓN?
 * El Header no gestiona estado ni efectos: recibe el "qué" mostrar (aquí es
 * totalmente estático) y se limita a renderizar el marcado semántico. Esta
 * separación (SoC) lo hace trivial de testear y de reutilizar.
 *
 * Las clases CSS (`app-header`, `app-header__badge`, ...) provienen de la
 * arquitectura Sass 7-1 (`src/scss/layout/_header.scss`) y NO se modifican,
 * garantizando fidelidad visual con el proyecto original.
 */

/**
 * Renderiza el encabezado temático del multiverso.
 *
 * @returns {JSX.Element} El elemento `<header>` con badge, título y subtítulo.
 */
export function Header() {
  return (
    // <header> es la región semántica natural para la cabecera de la página.
    <header className="app-header">
      <div className="container">
        {/* Badge superior: refuerza la identidad tecnológica del proyecto */}
        <span className="app-header__badge">
          ⚡ ReactJS Explorer • Multiverse Edition
        </span>

        {/* Título principal: un único <h1> por página por accesibilidad (WCAG) */}
        <h1 className="app-header__title">Rick and Morty Explorer</h1>

        {/* Subtítulo descriptivo del propósito de la app */}
        <p className="app-header__subtitle">
          Explora dimensiones, conoce personajes y descubre episodios del multiverso C-137.
        </p>
      </div>
    </header>
  )
}

export default Header
