import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './About.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
