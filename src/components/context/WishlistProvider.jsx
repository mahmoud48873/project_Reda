import { useState, useEffect, useContext } from 'react';
import { WishlistContext } from './WishlistContext';
import { ToastContext } from './ToastContext';

export default function WishlistProvider({ children }) {
    const [wishlistItems, setWishlistItems] = useState(() => {
        const getWishlistItems = localStorage.getItem("wishlistItems");
        return getWishlistItems ? JSON.parse(getWishlistItems) : [];
    });

    const toastCtx = useContext(ToastContext);

    const addToWishlist = (product) => {
        const isProductInWishlist = wishlistItems.some((item) => item.id === product.id);
        if (isProductInWishlist) {
            setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== product.id));
            toastCtx?.showToast(`${product.title} removed from wishlist!`, 'wishlist');
        } else {
            setWishlistItems((prevItems) => [...prevItems, product]);
            toastCtx?.showToast(`${product.title} added to wishlist!`, 'wishlist');
        }
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
        </WishlistContext.Provider>
    );
}
