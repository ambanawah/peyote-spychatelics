import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  species: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = { items: [], isOpen: false };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== action.payload.id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearCart(state) { state.items = []; },
    toggleCart(state) { state.isOpen = !state.isOpen; },
    closeCart(state) { state.isOpen = false; },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, toggleCart, closeCart } = cartSlice.actions;

export const selectCartItems = (s: any) => s.cart.items;
export const selectCartCount = (s: any) => s.cart.items.reduce((a: number, c: CartItem) => a + c.quantity, 0);
export const selectCartTotal = (s: any) => s.cart.items.reduce((a: number, c: CartItem) => a + c.price * c.quantity, 0);
export const selectCartOpen = (s: any) => s.cart.isOpen;

export default cartSlice.reducer;
