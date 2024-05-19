import { Product } from "../../app/models/product"
import agent from "../../app/api/agent"
import ProductList from "./ProductList";
import { useEffect, useState } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";

// export default function Catalog(props: Props) {
// destructuring from the object 
export default function Catalog() {

    // React hook
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);


    // useEffect(() => {
    //     fetch('http://170.64.205.145:5000/api/products')
    //     .then(response => response.json())
    //     .then(data => setProducts(data)) // The method that changes state and cause a re-render and will cause a endless loop...
    // }, []); // Put a dependancy of empty array and it means to this can only be called once

    useEffect(() => {
        // if (loading) return; // React Hook useEffect has a missing dependency: 'loading'. Either include it or remove the dependency array.
        agent.Catalog.list()
            .then(products => setProducts(products))
            .catch(error => console.log(error))
            .finally(() => setLoading(false))

    }, []) 

    if (loading) return <LoadingComponent message="Loading products..." />

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
        <> 
            <ProductList products={products} />
            {/* Do not need to add parentheses */}
            {/* <Button variant='contained' onClick={addProduct}>Add product</Button> */}
        </> 

    )
}