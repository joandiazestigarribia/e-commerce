import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/api";

// TODO: Revisar

interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
    isOpen: boolean;
}

const initialState: CartState = {
    items: [],
    total: 0,
    itemCount: 0,
    isOpen: false
}

const calculateTotals = (items: CartItem[]) => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const total = items.reduce((total, item) => total + item.price * item.quantity, 0);
    return { itemCount, total }
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({
                    id: action.payload.id,
                    title: action.payload.title,
                    price: action.payload.price,
                    quantity: 1,
                    image: action.payload.image
                })
            }

            const totals = calculateTotals(state.items)
            state.itemCount = totals.itemCount
            state.total = totals.total
            state.isOpen = true;
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            const itemIdPayload = action.payload;
            state.items = state.items.filter(item => item.id !== itemIdPayload);
            const totals = calculateTotals(state.items);
            state.itemCount = totals.itemCount
            state.total = totals.total
        },
        updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
            const { id, quantity } = action.payload

            if (quantity <= 0) {
                state.items = state.items.filter(item => item.id !== id)
            } else {
                const item = state.items.find(item => item.id === id)
                if (item) {
                    item.quantity = quantity
                }
            }

            const totals = calculateTotals(state.items)
            state.itemCount = totals.itemCount
            state.total = totals.total
        },
        clearCart: (state) => {
            state.items = []
            state.total = 0
            state.itemCount = 0
        },
        toggleCart: (state) => {
            state.isOpen = !state.isOpen
        },
        closeCart: (state) => {
            state.isOpen = false
        }
    }
})

export const { addToCart, removeFromCart, clearCart, toggleCart, closeCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;