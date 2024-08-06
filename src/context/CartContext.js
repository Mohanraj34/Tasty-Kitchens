import React from 'react'

const CartContext = React.createContext({
  cartItems: [],
  isOrderPlaced: false,
  placeOrder: () => {},
  emptyCart: () => {},
  addCartItem: () => {},
  getQuantity: () => {},
  removeCartItem: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
})

export default CartContext
