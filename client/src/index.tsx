import ReactDOM from 'react-dom/client'
import './app/layout/styles.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Routes';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store/configureStore';



// const store = configureStore();
// console.log(store.getState());

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// store.dispatch(fetchProductsAsync());

root.render(
  <Provider store={store}>
  <RouterProvider router={router} />
  </Provider>
  // <React.StrictMode>
  //   {/* <StoreProvider> */}
  //     <Provider store={store}>
  //     <RouterProvider router={router} />
  //     </Provider>
  //   {/* </StoreProvider>    */}
  // </React.StrictMode> // Only in Dev not Production
  // Two requests will be made when we get a resource in the React StrictMode 
  // It helps to detect any problems with out code and warn us about them
)


// export const history = createBrowserHistory();

// ReactDOM.render(
//   <React.StrictMode>
//     <StoreProvider>
//       <Provider store={store}>
//       <RouterProvider router={router} />
//       </Provider>
//     </StoreProvider>   
//   </React.StrictMode>,
//   document.getElementById('root')
//   )

// reportWebVitals();