import { useEffect, useState } from "react";
import { Product } from "../models/product";
import Catalog from "../../features/catalog/Catalog";
import { Typography } from "@mui/material";



function App() {

  // React hook
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
    .then(response => response.json())
    .then(data => setProducts(data)) // The method that changes state and cause a re-render and will cause a endless loop...
  }, []); // Put a dependancy of empty array and it means to this can only be called once

  function addProduct() {
      // Add Function or a syntax called a spread operator
      // The effectively working here is to take items from the array and spread them across into the new array 
    // setProducts([...products, {name: 'product3', price: 302.00}])
    setProducts(prevState => [...prevState, 
      {
        id: prevState.length + 101,
        name: 'product' + (prevState.length + 1), 
        price: (prevState.length * 100 + 100),
        brand: 'some brand',
        description: 'some description',
        pictureUrl: 'http://picsum.photos/200'
      }
    ])
  }

  return (
    <div className="app">
      <Typography variant="h1">Re-Store</Typography>
      <Catalog products={products} addProduct={addProduct} />
     
    </div>
  );
}

export default App
