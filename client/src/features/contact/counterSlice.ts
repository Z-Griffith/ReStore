import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
    data: number;
    title: string;
}

const initialState: CounterState = {
    data: 42,
    title: 'YARC (yet another redux counter with redux toolkit)'
}

/*
Redux requires that we write all state updates immutably, by making copies of data and updating the copies. 
However, Redux Toolkit's createSlice and createReducer) APIs use Immer inside to allow us to write "mutating" update logic that becomes correct immutable updates.
*/
export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state, action) => {
            state.data += action.payload
        },       
        decrement: (state, action) => {
            state.data -= action.payload
        }
    }
})


export const {increment, decrement} = counterSlice.actions;