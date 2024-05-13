import { Button  } from "@mui/material";
import { Product } from "../../app/models/product"
import ProductList from "./ProductList";

interface Props {
    products: Product[]
    addProduct: () => void;
}


// export default function Catalog(props: Props) {
// destructuring from the object 
export default function Catalog({products, addProduct}: Props) {
    return (
        // No output is needed here then use <Fragment> and a shorthand of it is <>
        <> 
            <ProductList products={products} />
            {/* Do not need to add parentheses */}
            <Button variant='contained' onClick={addProduct}>Add product</Button>
        </> 

    )
}