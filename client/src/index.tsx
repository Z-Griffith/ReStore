import ReactDOM from 'react-dom/client'
import './app/layout/styles.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Routes';
import React from 'react';
import { StoreProvider } from './app/context/StoreContext';




ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>   
  </React.StrictMode> // Only in Dev not Production
  // Two requests will be made when we get a resource in the React StrictMode 
  // It helps to detect any problems with out code and warn us about them
)
