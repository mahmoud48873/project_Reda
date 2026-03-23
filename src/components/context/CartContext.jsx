import { useState, createContext, useEffect } from 'react'

export const CartContext = createContext();

export default function CartProvider({children}) {

    const [CartItem , setCartItem] = useState(()=>{
      const getCartItem = localStorage.getItem("cartItem");
      return getCartItem ? JSON.parse(getCartItem) : [];
    });
    const addToCart = (product) => {
        setCartItem ((pervItem) => [...pervItem, product]);
    };
    useEffect(() => {
      localStorage.setItem("cartItem", JSON.stringify(CartItem));
    }, [CartItem]);
  return (
    <CartContext.Provider value={{CartItem , addToCart}}>
        {children}
    </CartContext.Provider>
  )
}
