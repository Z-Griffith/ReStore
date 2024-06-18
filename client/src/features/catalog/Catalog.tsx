import ProductList from "./ProductList";
import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchFilters, fetchProductsAsync, setProductParams, productSelectors } from "./catalogSlice";
import { Grid, Paper } from "@mui/material";
import ProductSearch from "./ProdcutSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import AppPagination from "../../app/components/AppPagination";

const sortOptions = [
    {value: 'name', label: 'Alphabetical'},
    {value: 'priceDesc', label: 'Price - High to low'},
    {value: 'price', label: 'Price - Low to high'},
]


// export default function Catalog(props: Props) {
// destructuring from the object 
export default function Catalog() {

    // React hook
    // const [products, setProducts] = useState<Product[]>([]);
    const products = useAppSelector(productSelectors.selectAll);
    const { productsLoaded, status, filtersLoaded, brands, types, productParams, metaData } = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     fetch('http://170.64.205.145:5000/api/products')
    //     .then(response => response.json())
    //     .then(data => setProducts(data)) // The method that changes state and cause a re-render and will cause a endless loop...
    // }, []); // Put a dependancy of empty array and it means to this can only be called once

    useEffect(() => {
        if (!productsLoaded) dispatch(fetchProductsAsync());


        // if (loading) return; // React Hook useEffect has a missing dependency: 'loading'. Either include it or remove the dependency array.
        // agent.Catalog.list()
        //     .then(products => setProducts(products))
        //     .catch(error => console.log(error))
        //     .finally(() => setLoading(false))

    }, [productsLoaded, dispatch]) 

    useEffect(() => {
        if (!filtersLoaded) dispatch(fetchFilters());
    }, [dispatch, filtersLoaded])



    if (!filtersLoaded) return <LoadingComponent message="Loading products..." />
    // if (status.includes('pending') || !metaData) return <LoadingComponent message="Loading products..." />

    // function addProduct() {
    //     // Add Function or a syntax called a spread operator
    //     // The effectively working here is to take items from the array and spread them across into the new array 
    //     // setProducts([...products, {name: 'product3', price: 302.00}])
    //     setProducts(prevState => [...prevState, 
    //     {
    //         id: prevState.length + 101,
    //         name: 'product' + (prevState.length + 1), 
    //         price: (prevState.length * 100 + 100),
    //         brand: 'some brand',
    //         description: 'some description',
    //         pictureUrl: 'http://picsum.photos/200'
    //     }
    //     ])
    // }


    return (
        // No output is needed here then use <Fragment> and a shorthand of it is <>
        <Grid container spacing={4}> 
            <Grid item xs={3}>
                <Paper sx={{mb: 2}}>
                    <ProductSearch />
                </Paper>
                <Paper sx={{ mb : 2, p : 2}}>   
                    <RadioButtonGroup 
                        selectedValue={productParams.orderBy}
                        options={sortOptions}
                        onChange={(e) => dispatch(setProductParams({orderBy: e.target.value}))}
                    />
                </Paper>

                <Paper sx={{ mb : 2, p : 2}}>
                    <CheckboxButtons
                        items={brands}
                        checked={productParams.brands}
                        onChange={(items: string[]) => dispatch(setProductParams({brands: items}))}
                    />
                </Paper>


                <Paper sx={{ mb : 2, p : 2}}>
                    <CheckboxButtons
                        items={types}
                        checked={productParams.types}
                        onChange={(items: string[]) => dispatch(setProductParams({types: items}))}
                    />
                </Paper>

            </Grid>
            <Grid item xs={9}>
                <ProductList products={products} />
                {/* Do not need to add parentheses */}
                {/* <Button variant='contained' onClick={addProduct}>Add product</Button> */}
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={9} sx={{mb:2}}>
                {metaData &&
                <AppPagination 
                    metaData={metaData}
                    onPageChange={(page:number) => dispatch(setProductParams({pageNumber: page}))}    
                />}
            </Grid> 
        </Grid> 

    )
}