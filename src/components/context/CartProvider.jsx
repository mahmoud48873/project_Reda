// Developer: Mahmoud Sameh Fathy Ibrahim
// Student Code: 624018
import { useState, useEffect, useContext } from 'react';
import { CartContext } from './CartContext';
import { ToastContext } from './ToastContext';
import { UserContext } from './UserContext';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function CartProvider({ children }) {
    const { user } = useContext(UserContext) || {};
    const toastCtx = useContext(ToastContext);

    const [CartItem, setCartItem] = useState(() => {
        const localCart = localStorage.getItem("cartItem");
        return localCart ? JSON.parse(localCart) : [];
    });

    // 1. Fetch Cart from Firestore when user logs in
    useEffect(() => {
        if (!user || !user.uid) return;

        const fetchFirestoreCart = async () => {
            try {
                const cartRef = doc(db, 'users', user.uid, 'cart', 'items');
                const cartSnap = await getDoc(cartRef);
                if (cartSnap.exists()) {
                    setCartItem(cartSnap.data().items || []);
                } else if (CartItem.length > 0) {
                    // Sync initial local cart to Firestore for newly logged in user
                    await setDoc(cartRef, { items: CartItem, updatedAt: new Date().toISOString() });
                }
            } catch (error) {
                console.error("Error fetching cart from Firestore:", error);
            }
        };

        fetchFirestoreCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.uid]);

    // Helper function to sync cart with local state, LocalStorage, and Firestore
    const syncCart = async (newCart) => {
        setCartItem(newCart);
        localStorage.setItem("cartItem", JSON.stringify(newCart));

        if (user && user.uid) {
            try {
                const cartRef = doc(db, 'users', user.uid, 'cart', 'items');
                await setDoc(cartRef, { items: newCart, updatedAt: new Date().toISOString() });
            } catch (error) {
                console.error("Error saving cart to Firestore:", error);
            }
        }
    };

    const addToCart = (product) => {
        const isProductInCart = CartItem.some((item) => item.id === product.id);
        if (isProductInCart) {
            toastCtx?.showToast(`${product.title} is already in cart!`, 'info');
        } else {
            const updated = [...CartItem, { ...product, quantity: 1 }];
            syncCart(updated);
            toastCtx?.showToast(`${product.title} added to cart!`, 'success');
        }
    };

    const removeFromCart = (id) => {
        const updated = CartItem.filter((item) => item.id !== id);
        syncCart(updated);
    };

    const increaseQuantity = (id) => {
        const updated = CartItem.map((item) =>
            item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
        syncCart(updated);
    };

    const decreaseQuantity = (id) => {
        const updated = CartItem.map((item) =>
            item.id === id && (item.quantity || 1) > 1
                ? { ...item, quantity: (item.quantity || 1) - 1 }
                : item
        );
        syncCart(updated);
    };

    const clearCart = () => {
        syncCart([]);
    };

    return (
        <CartContext.Provider value={{ CartItem, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}
