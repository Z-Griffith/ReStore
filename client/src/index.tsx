import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/layout/App.tsx'
import './app/layout/styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode> // Only in Dev not Production
  // Two requests will be made when we get a resource in the React StrictMode 
  // It helps to detect any problems with out code and warn us about them
)
