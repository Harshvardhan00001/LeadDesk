import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'
import { applyThemeMode } from './hooks/Usethememode'

const storedMode = localStorage.getItem('theme-mode');
applyThemeMode(storedMode === 'light' || storedMode === 'dark' || storedMode === 'system' ? storedMode : 'system');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="bottom-right" />
    </BrowserRouter>
  </React.StrictMode>,
)