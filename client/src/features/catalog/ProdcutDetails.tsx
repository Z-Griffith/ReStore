import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStoreContext } from "../../app/context/StoreContext";
import { LoadingButton } from "@mui/lab";

export default function ProductDetails() {
    // debugger; // As endpoint
    const {basket, setBasket, removeItem} = useStoreContext();
    const {id} = useParams<{id: string}>(); // Extracts the 'id' parameter from the URL
    const [product, setProduct] = useState<Product | null>(null); // State to hold the product data
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [quantity, setQuantity] = useState(0);
    const [submitting, setSubmitting] = useState(false)
    const item = basket?.items.find(i => i.productId === product?.id);

    useEffect(() => {
        if (item) setQuantity(item.quantity);
        id && agent.Catalog.details(parseInt(id)) // Ensure we have the id before using it
            .then(response => setProduct(response)) // Sets the retrieved product data to state
            .catch(error => console.log(error)) // Logs any errors that occur during the API request
            .finally(() => setLoading(false)); // Sets loading state to false when request is complete
    }, [id, item]);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        if (parseInt(event.currentTarget.value) >= 0) {
            setQuantity(parseInt(event.currentTarget.value));
        }
    }

    function handleUpdateCart() {
        if (!product) return;
        setSubmitting(true);
        if (!item || quantity > item.quantity) {
            const updatedQuantity = item ? quantity - item.quantity : quantity;
            agent.Basket.addItem(product.id, updatedQuantity)
                .then(basket => setBasket(basket))
                .catch(error => console.log(error))
                .finally(( )=> setSubmitting(false))
        } else {
            const updatedQuantity = item.quantity - quantity;
            agent.Basket.removeItem(product.id, updatedQuantity)
                .then(() => removeItem(product.id, updatedQuantity))
                .catch(error => console.log(error))
                .finally(()=> setSubmitting(false))
        }
    }

    // useEffect(()=> {
    //     // useEffect hook runs when 'id' changes or on initial render
    //     axios.get(`http://170.64.205.145:5000/api/products/${id}`)
    //         .then(response => setProduct(response.data)) // Sets the retrieved product data to state
    //         .catch(error => console.log(error)) // Logs any errors that occur during the API request
    //         .finally(() => setLoading(false)); // Sets loading state to false when request is complete
    // }, [id]); // Dependency array ensures useEffect runs when 'id' changes

        // Render loading message if data is being fetched
        if (loading) return <LoadingComponent message="Loading product..."/>
        // Render message if product is not found
        if (!product) return <NotFound />
        // Render the product name using Typography component from Material-UI
    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{width: '100%'}} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'>{product.name}</Typography>
                <Divider sx={{mb: 2}} />
                <Typography variant='h4' color='secondary'>${(product.price / 100).toFixed(2)}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField 
                            onChange={handleInputChange}
                            variant='outlined'
                            type='number'
                            label='Quantity in Cart'
                            fullWidth
                            value={quantity}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton
                            disabled={item?.quantity === quantity || !item && quantity === 0}
                            loading={submitting}
                            onClick={handleUpdateCart}
                            sx={{height: '55px'}}
                            color='primary'
                            size='large'
                            variant='contained'
                            fullWidth
                        >
                            {item ? 'Update Quantity' : 'Add to Cart'}
                        </LoadingButton>

                        
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}