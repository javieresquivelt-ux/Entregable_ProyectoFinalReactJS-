import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './scss/app.scss'
import App from './App.jsx'
import { FavoritesProvider } from './context/FavoritesProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* El proveedor de favoritos envuelve toda la app para compartir el estado
        global de favoritos con cualquier componente (catálogo, tarjetas, etc.). */}
    <FavoritesProvider>
      <App />
    </FavoritesProvider>
  </StrictMode>,
)
