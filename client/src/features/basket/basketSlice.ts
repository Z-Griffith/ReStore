import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit"
import { Basket } from "../../app/models/basket"
import agent from "../../app/api/agent";
import { getCookie } from "../../app/util/util";

interface BasketState {
    basket: Basket | null
    status: string;
}

const initialState: BasketState ={
    basket: null,
    status: 'idle'
}

export const fetchBasketAsync = createAsyncThunk<Basket>(
    'bakset/fetchBasketAsync',
    async (_, thunkAPI) => {
        try {
            return await agent.Basket.get();
        } catch(error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    },
    {
        condition: () => {
            if (!getCookie('buyerId')) return false;
        }
    }
)
export const addBasketItemAsync = createAsyncThunk<Basket, {productId: number, quantity?: number}>(
    'basket/addBasketItemAsync',
    async({productId, quantity = 1}, thunkAPI) => {
        try {
            return await agent.Basket.addItem(productId, quantity);
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const removeBasketItemAsync = createAsyncThunk<void, 
    {productId: number, quantity: number, name?:string}>(
    'basket/removeBasketItemAsync',
    async({productId, quantity}, thunkAPI) => {
        try {
            await agent.Basket.removeItem(productId, quantity);
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)


export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload
        }
        // removeItem: (state, action) => {
        //     const {productId, quantity} = action.payload;
        //     const itemIndex = state.basket?.items.findIndex(i => i.productId === productId);
        //     if (itemIndex === -1 || itemIndex === undefined) return;
        //     state.basket!.items[itemIndex].quantity -= quantity; // Non-Null Assertion Operator (!):  state.basket is not null or undefined, This tells the TypeScript compiler to trust that state.basket is definitely an object and not null or undefined, bypassing any null checks.
        //     //  Optional Chaining Operator (?):  If state.basket is null or undefined, the entire expression evaluates to undefined and the operation after the ? will not be executed, thus preventing any runtime errors that would occur from trying to access properties on a null or undefined object.
        //     if (state.basket?.items[itemIndex].quantity === 0) 
        //         state.basket.items.splice(itemIndex, 1);
        // } 
    },
    extraReducers: (builder => {
        builder.addCase(addBasketItemAsync.pending, (state, action) => {
            // console.log(action);
            state.status = 'pendingAddItem' + action.meta.arg.productId;
        });
        builder.addCase(removeBasketItemAsync.pending, (state, action) => {
            state.status = 'pendingRemoveItem' + action.meta.arg.productId + action.meta.arg.name;
        });
        builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
            const {productId, quantity} = action.meta.arg;
            const itemIndex = state.basket?.items.findIndex(i => i.productId === productId);
            if (itemIndex === -1 || itemIndex === undefined) return;
            state.basket!.items[itemIndex].quantity -= quantity!; // Non-Null Assertion Operator (!):  state.basket is not null or undefined, This tells the TypeScript compiler to trust that state.basket is definitely an object and not null or undefined, bypassing any null checks.
            //  Optional Chaining Operator (?):  If state.basket is null or undefined, the entire expression evaluates to undefined and the operation after the ? will not be executed, thus preventing any runtime errors that would occur from trying to access properties on a null or undefined object.
            if (state.basket?.items[itemIndex].quantity === 0) 
                state.basket.items.splice(itemIndex, 1);
            state.status = 'idle';
        });
        builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action.payload);
        });
        // builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
        //     state.basket = action.payload;
        //     state.status = 'idle';
        // });
        // builder.addCase(addBasketItemAsync.rejected, (state, action) => {
        //     state.status = 'idle';
        //     console.log(action.payload);
        // });
        builder.addMatcher(isAnyOf (addBasketItemAsync.fulfilled, fetchBasketAsync.fulfilled), (state, action) => {
            state.basket = action.payload;
            state.status = 'idle';
        });
        builder.addMatcher(isAnyOf (addBasketItemAsync.rejected, fetchBasketAsync.rejected), (state, action) => {
            state.status = 'idle';
            console.log(action.payload);
        });

    })
})


export const {setBasket} = basketSlice.actions;

