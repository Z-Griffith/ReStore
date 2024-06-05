// import { useEffect, useState, } from "react";
// import agent from "../../app/api/agent";
// import { Basket } from "../../app/models/basket";
// import LoadingComponent from "../../app/layout/LoadingComponent";
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addBasketItemAsync, removeBasketItemAsync, setBasket } from "./basketSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";

export default function BasketPage() {

  /*
    const [loading, setLoading] = useState(true);
    const [basket, setBasket] = useState<Basket | null>()

    useEffect(() => {
        agent.Basket.get()
        .then(basket => setBasket(basket))
        .catch(error => console.log(error))
        .finally(() => setLoading(false))
    }, []);

    if (loading) return <LoadingComponent message='Loading basket...' />

  */

    // const {basket, setBasket, removeItem} = useStoreContext();
    const {basket, status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    // const [status, setStatus] = useState({
    //   loading: false,
    //   name: ''
    // });

    // function handleAddItem(productId: number, name: string) {
    //   setStatus({loading: true, name});
    //   agent.Basket.addItem(productId)
    //     // .then(basket => setBasket(basket))
    //     .then(basket => dispatch(setBasket(basket)))
    //     .catch(error => console.log(error))
    //     .finally(() => setStatus({loading: false, name: ''}))
    // }

    // function handleRemoveItem(productId: number, quantity = 1, name: string) {
    //   setStatus({loading: true, name});
    //   agent.Basket.removeItem(productId, quantity)
    //     // .then(() => removeItem(productId, quantity))
    //     .then(() => dispatch(removeItem({productId, quantity})))
    //     .catch(error => console.log(error))
    //     .finally(() => setStatus({loading: false, name: ''}))
    // }


    if (!basket) return <Typography variant='h3'>Your basket is empty</Typography>

    return (
        // <h1>Buyer Id = {basket.buyerId}</h1>
        <>  
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket.items.map(item => (
              <TableRow
                key={item.productId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display='flex' alignItems='center'>
                    <img src={item.pictureUrl} alt={item.name} style={{height: 50, marginRight: 20}} />
                    <span>{item.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="right">{(item.price / 100).toFixed(2)}</TableCell>
                <TableCell align="center">
                  <LoadingButton 
                    // loading={status.loading && status.name == 'rem' + item.productId} 
                    loading={status === 'pendingRemoveItem' + item.productId + 'rem'} 
                    // onClick={() => handleRemoveItem(item.productId, 1, 'rem' + item.productId)} color='secondary'>
                    onClick={() => dispatch(removeBasketItemAsync({
                      productId: item.productId, quantity: 1, name: 'rem'
                      }))}>
                    <Remove />
                  </LoadingButton>
                  {item.quantity}
                  <LoadingButton 
                    loading={status === 'pendingAddItem' + item.productId} 
                    // onClick={() => handleAddItem(item.productId, 'add' + item.productId)} color='secondary'>
                    onClick={() => dispatch(addBasketItemAsync({productId: item.productId}))} color='secondary'>
                    <Add />
                  </LoadingButton>
                </TableCell>
                <TableCell align="right">{((item.price / 100) * item.quantity).toFixed(2)}</TableCell>
                <TableCell align="right">
                  <LoadingButton 
                    loading={status === 'pendingRemoveItem' + item.productId + 'del'} 
                    // onClick={() => handleRemoveItem(item.productId, item.quantity, 'del' + item.productId)} color='error'>
                    onClick={() => dispatch(removeBasketItemAsync({
                      productId: item.productId, quantity: item.quantity, name: 'del'
                    }))}
                    color='error'  
                  >
                    <Delete />
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary />
          <Button
            component={Link}
            to='/checkout'
            variant='contained'
            size='large'
            fullWidth
          >
            Checkout
          </Button>
        </Grid>
      </Grid>

    </>


    )
}

// function removeItem(arg0: { productId: number; quantity: number; }): any {
//   throw new Error("Function not implemented.");
// }
