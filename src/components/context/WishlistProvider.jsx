import { useState, useEffect, useContext } from 'react';
import { WishlistContext } from './WishlistContext';
import { ToastContext } from './ToastContext';
import { UserContext } from './UserContext';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function WishlistProvider({ children }) {
    const { user } = useContext(UserContext) || {};
    const toastCtx = useContext(ToastContext);

    const [wishlistItems, setWishlistItems] = useState(() => {
        const localWishlist = localStorage.getItem("wishlistItems");
        return localWishlist ? JSON.parse(localWishlist) : [];
    });

    // 1. Fetch Wishlist from Firestore when user logs in
    useEffect(() => {
        if (!user || !user.uid) return;

        const fetchFirestoreWishlist = async () => {
            try {
                const wishlistRef = doc(db, 'users', user.uid, 'wishlist', 'items');
                const snap = await getDoc(wishlistRef);
                if (snap.exists()) {
                    setWishlistItems(snap.data().items || []);
                } else if (wishlistItems.length > 0) {
                    await setDoc(wishlistRef, { items: wishlistItems, updatedAt: new Date().toISOString() });
                }
            } catch (error) {
                console.error("Error fetching wishlist from Firestore:", error);
            }
        };

        fetchFirestoreWishlist();
    }, [user?.uid]);

    // Helper function to sync wishlist with local state, LocalStorage, and Firestore
    const syncWishlist = async (newWishlist) => {
        setWishlistItems(newWishlist);
        localStorage.setItem("wishlistItems", JSON.stringify(newWishlist));

        if (user && user.uid) {
            try {
                const wishlistRef = doc(db, 'users', user.uid, 'wishlist', 'items');
                await setDoc(wishlistRef, { items: newWishlist, updatedAt: new Date().toISOString() });
            } catch (error) {
                console.error("Error saving wishlist to Firestore:", error);
            }
        }
    };

    const addToWishlist = (product) => {
        const isProductInWishlist = wishlistItems.some((item) => item.id === product.id);
        if (isProductInWishlist) {
            const updated = wishlistItems.filter((item) => item.id !== product.id);
            syncWishlist(updated);
            toastCtx?.showToast(`${product.title} removed from wishlist!`, 'wishlist');
        } else {
            const updated = [...wishlistItems, product];
            syncWishlist(updated);
            toastCtx?.showToast(`${product.title} added to wishlist!`, 'wishlist');
        }
    };

    const removeFromWishlist = (id) => {
        const updated = wishlistItems.filter((item) => item.id !== id);
        syncWishlist(updated);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}
