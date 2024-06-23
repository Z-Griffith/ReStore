import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Header from "./Header";
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync } from "../../features/basket/basketSlice";
import { fetchCurrentUser } from "../../features/account/accountSlice";


function App() {
  // const {setBasket} = useStoreContext();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]) 

  useEffect(() => {
    initApp().then(() => setLoading(false));
    // const buyerId = getCookie('buyerId');
    // dispatch(fetchCurrentUser());
    // if (buyerId) {
    //   agent.Basket.get()
    //     // .then(basket => setBasket(basket))
    //     .then(basket => dispatch(setBasket(basket)))
    //     .catch(error => console.log(error))
    //     .finally(() => setLoading(false))
    // } else {
    //   setLoading(false);
    // }
  }, [initApp])


  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light'? '#eaeaea' : '#121212'
      },
      
    }
  })

  function handleThemeChange() {
    setDarkMode(!darkMode); // Toggle darkMode state
  }

if (loading) return <LoadingComponent message="Initialising app..." /> 


  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
      {/* <Typography variant="h1">Re-Store</Typography> */}
      <CssBaseline />
      {/* Pass down darkMode state and toggleDarkMode function as props */}
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default App
