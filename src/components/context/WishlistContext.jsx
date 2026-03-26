import { useState, createContext, useEffect } from 'react'

export const WishlistContext = createContext();

export default function WishlistProvider({ children }) {
    const [wishlistItems, setWishlistItems] = useState(() => {
        const getWishlistItems = localStorage.getItem("wishlistItems");
        return getWishlistItems ? JSON.parse(getWishlistItems) : [];
    });

    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    const addToWishlist = (product) => {
        setWishlistItems((prevItems) => {
            const isProductInWishlist = prevItems.find((item) => item.id === product.id);
            if (isProductInWishlist) {
                // If it's already in the wishlist, remove it (toggle behavior)
                setNotificationMessage(`${product.title} removed from wishlist!`);
                return prevItems.filter((item) => item.id !== product.id);
            }
            
            // If it's new, add it
            setNotificationMessage(`${product.title} added to wishlist!`);
            return [...prevItems, product];
        });

        // Trigger notification
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const removeFromWishlist = (id) => {
        setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    useEffect(() => {
        localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist }}>
            {children}
            {showNotification && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '20px', // shown on the left so it doesn't overlap cart notification
                    backgroundColor: '#ff4b4b',
                    color: 'white',
                    padding: '15px 25px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 9999,
                    animation: 'slideInLeft 0.3s ease-out'
                }}>
                    <style>{`
                        @keyframes slideInLeft {
                            from { transform: translateX(-100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                    `}</style>
                    {notificationMessage}
                </div>
            )}
        </WishlistContext.Provider>
    )
}
