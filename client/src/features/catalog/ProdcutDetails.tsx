import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function ProductDetails() {
    // debugger; // As endpoint
    const {id} = useParams<{id: string}>(); // Extracts the 'id' parameter from the URL
    const [product, setProduct] = useState<Product | null>(null); // State to hold the product data
    const [loading, setLoading] = useState(true); // State to manage loading state

    useEffect(() => {
        id && agent.Catalog.details(parseInt(id)) // Ensure we have the id before using it
            .then(response => setProduct(response)) // Sets the retrieved product data to state
            .catch(error => console.log(error)) // Logs any errors that occur during the API request
            .finally(() => setLoading(false)); // Sets loading state to false when request is complete
    }, [id]);

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
            </Grid>
        </Grid>
    )
}