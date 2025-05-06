import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

export const cartSlice = createSlice({
  name: "cart-data",
  initialState,
  reducers: {
    updateCart: (state, action) => {
      console.log(action.payload);
      state.cartItems = action.payload;
      localStorage.setItem("cart-data", JSON.stringify(state.cartItems));
    },
    loadCartData: (state, action) => {
      const data = localStorage.getItem("cart-data");
      if (data) {
        state.cartItems = JSON.parse(data);
      }
    },
    addToCart: (state, action) => {
      const id = action.payload.id;
      const cartItem = state.cartItems.find((i) => i.id === id);
      if (cartItem) {
        cartItem.quantity++;
      }else{
        state.cartItems.push(action.payload);
      }
      localStorage.setItem("cart-data", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
      localStorage.setItem("cart-data", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cart-data");
    },
  },
});

export const { addToCart, removeFromCart, clearCart, loadCartData, updateCart } =
  cartSlice.actions;
export default cartSlice.reducer;
