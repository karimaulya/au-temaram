import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StoryProvider } from './story/StoryProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoryProvider>
      <App />
    </StoryProvider>
  </StrictMode>,
)
