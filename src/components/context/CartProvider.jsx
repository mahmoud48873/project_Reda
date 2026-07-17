import { useState, useEffect, useContext } from 'react';
import { CartContext } from './CartContext';
import { ToastContext } from './ToastContext';

export default function CartProvider({ children }) {
    const [CartItem, setCartItem] = useState(() => {
        const getCartItem = localStorage.getItem("cartItem");
        return getCartItem ? JSON.parse(getCartItem) : [];
    });

    const toastCtx = useContext(ToastContext);

    const addToCart = (product) => {
        const isProductInCart = CartItem.some((item) => item.id === product.id);
        if (isProductInCart) {
            toastCtx?.showToast(`${product.title} is already in cart!`, 'info');
        } else {
            setCartItem((prevItems) => [...prevItems, { ...product, quantity: 1 }]);
            toastCtx?.showToast(`${product.title} added to cart!`, 'success');
        }
    };

    const removeFromCart = (id) => {
        setCartItem((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const increaseQuantity = (id) => {
        setCartItem((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id) => {
        setCartItem((prevItems) =>
            prevItems.map((item) =>
                item.id === id && (item.quantity || 1) > 1
                    ? { ...item, quantity: (item.quantity || 1) - 1 }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItem([]);
    };

    useEffect(() => {
        localStorage.setItem("cartItem", JSON.stringify(CartItem));
    }, [CartItem]);

    return (
        <CartContext.Provider value={{ CartItem, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}
