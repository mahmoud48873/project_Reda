import { useState, createContext, useEffect } from 'react'

export const CartContext = createContext();

export default function CartProvider({ children }) {

    const [CartItem, setCartItem] = useState(() => {
        const getCartItem = localStorage.getItem("cartItem");
        return getCartItem ? JSON.parse(getCartItem) : [];
    });

    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    const addToCart = (product) => {
        setCartItem((prevItems) => {
            const isProductInCart = prevItems.find((item) => item.id === product.id);
            if (isProductInCart) {
                // If it's already in the cart, do nothing (to prevent repetitive adds or quantity increase from outside)
                setNotificationMessage(`${product.title} is already in the cart!`);
                return prevItems;
            }
            
            // If it's new, add it with quantity 1
            setNotificationMessage(`${product.title} added to cart!`);
            return [...prevItems, { ...product, quantity: 1 }];
        });

        // Trigger notification
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
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

    useEffect(() => {
        localStorage.setItem("cartItem", JSON.stringify(CartItem));
    }, [CartItem]);

    return (
        <CartContext.Provider value={{ CartItem, addToCart, removeFromCart, increaseQuantity, decreaseQuantity }}>
            {children}
            {showNotification && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '15px 25px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 9999,
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    <style>{`
                        @keyframes slideIn {
                            from { transform: translateX(100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                    `}</style>
                    {notificationMessage}
                </div>
            )}
        </CartContext.Provider>
    )
}
