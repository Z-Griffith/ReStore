import { Product } from "../../app/models/product"

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
            <ul>
                {products.map(product => (
                    <li key={product.id}>{product.name} - {product.price}</li>
                ))}
            </ul>
            {/* Do not need to add parentheses */}
            <button onClick={addProduct}>Add product</button>
        </>

    )
}