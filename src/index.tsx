import 'polyfills'
import { createRoot } from 'react-dom/client'
import App from './app'

// Set dark theme as default
document.documentElement.setAttribute('data-color-mode', 'dark')
document.documentElement.classList.add('dark')

const root = createRoot(document.getElementById('root')!)

root.render(<App />)
