import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { currencyFormat } from "../../app/util/util";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync } from "../basket/basketSlice";


interface Props {
    product: Product;
}



export default function ProductCard({product} : Props) {  
  // const [loading, setLoading] = useState(false);
  const {status} = useAppSelector(state => state.basket);
  // const {setBasket} = useStoreContext();
  const dispatch = useAppDispatch();



  // function handleAddItem(productId: number) {
  //   setLoading(true);
  //   agent.Basket.addItem(productId)
  //     // .then(basket => setBasket(basket))
  //     .then(basket => dispatch(setBasket(basket)))
  //     .catch(error => console.log(error))
  //     .finally(() => setLoading(false));
  // }


  return (
        
        <Card >
            <CardHeader 
                avatar={
                    <Avatar sx={{bgcolor: 'secondary.main' }}>
                        {product.name.charAt(0).toUpperCase()} {/* first character of name */}
                        
                    </Avatar>
                }
                title={product.name}
                titleTypographyProps={{
                    sx: { fontWeight: 'bold', color: 'primary.main',  }
                }}
                component={Link} to={`/catalog/${product.id}`}
                style={{ textDecoration: 'none' }}
            />
      <CardMedia
        sx={{ height: 140, backgroundSize: 'contain', bgcolor: 'primary.light' }}
        image={product.pictureUrl}
        title={product.name}
      />
      <CardContent>
        <Typography gutterBottom color='secondary' variant="h5">
          {currencyFormat(product.price)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton 
          loading={status.includes('pendingaddItem' + product.id)} 
          // onClick={() => handleAddItem(product.id)} 
          onClick={() => dispatch(addBasketItemAsync({productId: product.id}))} 
          size="small">Add to cart</LoadingButton>
        <Button component={Link} to={`/catalog/${product.id}`}>View</Button>
      </CardActions>
    </Card>
        
        
        
        
        // <ListItem key={product.id}>
        //             <ListItemAvatar>
        //                 <Avatar src={product.pictureUrl}></Avatar>
        //             </ListItemAvatar>
        //             <ListItemText>{product.name} - {product.price}</ListItemText>
        //         </ListItem>
    )
}