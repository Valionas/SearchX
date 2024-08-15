import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SearchHistoryProvider } from './context/SearchHistoryContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SearchHistoryProvider>
      <App />
    </SearchHistoryProvider>
  </StrictMode>,
)
