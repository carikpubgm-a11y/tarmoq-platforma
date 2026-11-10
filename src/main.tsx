import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { DefenseProvider } from './lib/defense'
import { OquvchiProvider } from './lib/student'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <OquvchiProvider>
        <DefenseProvider>
          <App />
        </DefenseProvider>
      </OquvchiProvider>
    </HashRouter>
  </StrictMode>,
)
