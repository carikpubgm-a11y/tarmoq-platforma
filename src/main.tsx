import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { DefenseProvider } from './lib/defense'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <DefenseProvider>
        <App />
      </DefenseProvider>
    </HashRouter>
  </StrictMode>,
)
