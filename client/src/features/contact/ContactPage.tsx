import { Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { increment, decrement } from "./counterSlice";

export default function ContactPage() {
    // const dispatch = useDispatch();
    const dispatch = useAppDispatch();
    const { data, title } = useAppSelector(state => state.counter);
    // const {data, title} = useSelector((state: CounterState) => state); // Selector unknown returned the root state when called. This can lead to unnecessary rerenders.
    // Selectors that return the entire state are almost certainly a mistake, as they will cause a rerender whenever *anything* in state changes. 
    // const data = useSelector((state: CounterState) => state.data);
    // const title = useSelector((state: CounterState) => state.title);
    return (
        <>
            <Typography variant="h2">
                {title}
            </Typography>
            
            <Typography variant="h5">
                The data is: {data}
            </Typography>
                <Button onClick={() => dispatch(decrement(1))} variant='contained' color='error'>Decrement</Button>
                <Button onClick={() => dispatch(increment(1))} variant='contained' color='primary'>Increment</Button>
                <Button onClick={() => dispatch(increment(5))} variant='contained' color='secondary'>Increment by 5</Button>
        </>
    )
}