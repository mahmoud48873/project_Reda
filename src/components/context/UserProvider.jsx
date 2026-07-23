import { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import { auth, db } from '../../firebase';
import { 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    updateProfile 
} from 'firebase/auth';
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    orderBy 
} from 'firebase/firestore';

export default function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Listen to Firebase Authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Fetch extended user profile data from Firestore
                    const userDocRef = doc(db, 'users', firebaseUser.uid);
                    const userSnap = await getDoc(userDocRef);

                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        const userName = userData.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
                        const userAvatar = (userData.avatar && typeof userData.avatar === 'string' && userData.avatar.trim() !== '') 
                            ? userData.avatar 
                            : (firebaseUser.photoURL || generateAvatar(userName));
                        setUser({ uid: firebaseUser.uid, ...userData, name: userName, avatar: userAvatar });
                    } else {
                        // Fallback if Firestore doc is not created yet
                        const userName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
                        const defaultUser = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            name: userName,
                            avatar: firebaseUser.photoURL || generateAvatar(userName),
                            createdAt: new Date().toISOString()
                        };
                        setUser(defaultUser);
                    }
                } catch (error) {
                    console.error("Firestore user profile fetch error:", error);
                    const userName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: userName,
                        avatar: firebaseUser.photoURL || generateAvatar(userName)
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // 2. Sign Up function (Creates Firebase Auth user & Firestore user document)
    const signup = async (dataOrName, emailParam, passwordParam) => {
        let name, email, password;

        if (typeof dataOrName === 'object') {
            name = dataOrName.name;
            email = dataOrName.email;
            password = dataOrName.password;
        } else {
            name = dataOrName;
            email = emailParam;
            password = passwordParam;
        }

        const avatar = generateAvatar(name);

        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        const userProfile = {
            uid: firebaseUser.uid,
            name: name,
            email: email,
            avatar: avatar,
            role: 'user',
            createdAt: new Date().toISOString()
        };

        // 2. Set user state IMMEDIATELY so UI updates without waiting for network/Firestore
        setUser(userProfile);

        // 3. Save to Firestore in background (non-blocking)
        setDoc(doc(db, 'users', firebaseUser.uid), userProfile).catch(err => {
            console.warn("Firestore setDoc background error:", err);
        });

        // 4. Update Auth Profile in background (non-blocking)
        updateProfile(firebaseUser, {
            displayName: name,
            photoURL: avatar
        }).catch(err => {
            console.warn("Auth updateProfile background error:", err);
        });

        return userProfile;
    };

    // 3. Login function (Sign in with Firebase Auth)
    const login = async (dataOrEmail, passwordParam) => {
        let email, password;

        if (typeof dataOrEmail === 'object') {
            email = dataOrEmail.email;
            password = dataOrEmail.password;
        } else {
            email = dataOrEmail;
            password = passwordParam;
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        const userProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            avatar: firebaseUser.photoURL || generateAvatar(firebaseUser.displayName || firebaseUser.email),
        };

        // Set user state IMMEDIATELY so app redirects without waiting
        setUser(userProfile);

        // Fetch Firestore profile in background if available
        getDoc(doc(db, 'users', firebaseUser.uid)).then(userSnap => {
            if (userSnap.exists()) {
                setUser({ uid: firebaseUser.uid, ...userSnap.data() });
            }
        }).catch(err => {
            console.warn("Firestore user fetch background error:", err);
        });

        return userProfile;
    };

    // 4. Logout function
    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    // 5. Update User Data (Firestore & Local state)
    const updateUser = async (updatedData) => {
        if (!user || !user.uid) return;

        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);

        // Update document in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, updatedData);

        // Update Firebase Auth profile if name or avatar updated
        if (auth.currentUser && (updatedData.name || updatedData.avatar)) {
            await updateProfile(auth.currentUser, {
                displayName: updatedData.name || auth.currentUser.displayName,
                photoURL: updatedData.avatar || auth.currentUser.photoURL
            });
        }
    };

    // 6. Save Order to Firestore & Local Storage
    const saveOrder = async (order) => {
        if (!user || !user.uid) return;

        const orderData = {
            ...order,
            userId: user.uid,
            userEmail: user.email,
            customerName: user.name || 'Customer',
            createdAt: order.date || new Date().toISOString()
        };

        // Fallback LocalStorage update
        const key = `orders_${user.email}`;
        const localOrders = JSON.parse(localStorage.getItem(key) || '[]');
        localOrders.unshift(orderData);
        localStorage.setItem(key, JSON.stringify(localOrders));

        try {
            // Save in user subcollection
            const userOrdersRef = collection(db, 'users', user.uid, 'orders');
            await addDoc(userOrdersRef, orderData);

            // Save in top-level global orders collection for admin/dashboard tracking
            const globalOrderRef = doc(db, 'orders', order.trackingNumber || `ORD-${Date.now()}`);
            await setDoc(globalOrderRef, orderData);
        } catch (error) {
            console.error("Error saving order to Firestore:", error);
        }
    };

    // 7. Get Orders from Firestore & Local Storage fallback
    const getOrders = async () => {
        if (!user || !user.uid) return [];

        try {
            const userOrdersRef = collection(db, 'users', user.uid, 'orders');
            const q = query(userOrdersRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const orders = [];
                querySnapshot.forEach((docSnap) => {
                    orders.push({ id: docSnap.id, ...docSnap.data() });
                });
                return orders;
            }
        } catch (error) {
            console.error("Error fetching orders from Firestore, falling back to local:", error);
        }

        const key = `orders_${user.email}`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    };

    // 8. Cancel Order & Restore Stock in Firestore
    const cancelOrder = async (orderToCancel) => {
        if (!user || !user.uid || !orderToCancel) return;

        try {
            // Update order status in user subcollection if order has id
            if (orderToCancel.id) {
                const userOrderRef = doc(db, 'users', user.uid, 'orders', orderToCancel.id);
                await updateDoc(userOrderRef, { status: 'Cancelled' });
            }

            // Update order status in global collection
            if (orderToCancel.trackingNumber) {
                const globalOrderRef = doc(db, 'orders', orderToCancel.trackingNumber);
                await updateDoc(globalOrderRef, { status: 'Cancelled' });
            }

            // Restore Stock for each product in the order
            if (orderToCancel.items && orderToCancel.items.length > 0) {
                for (const item of orderToCancel.items) {
                    try {
                        const productRef = doc(db, 'products', String(item.id));
                        const productSnap = await getDoc(productRef);
                        if (productSnap.exists()) {
                            const currentStock = productSnap.data().stock ?? 0;
                            const restoredQty = item.quantity || 1;
                            await updateDoc(productRef, { stock: currentStock + restoredQty });
                        }
                    } catch (prodErr) {
                        console.error("Error restoring product stock:", prodErr);
                    }
                }
            }

            // Update local storage fallback
            const key = `orders_${user.email}`;
            const localOrders = JSON.parse(localStorage.getItem(key) || '[]');
            const updatedLocal = localOrders.map(o => 
                o.trackingNumber === orderToCancel.trackingNumber ? { ...o, status: 'Cancelled' } : o
            );
            localStorage.setItem(key, JSON.stringify(updatedLocal));

            return true;
        } catch (error) {
            console.error("Error cancelling order:", error);
            throw error;
        }
    };

    // Helper for legacy lookups
    const getUser = (email) => {
        if (user && user.email === email) return user;
        return null;
    };

    return (
        <UserContext.Provider value={{ 
            user, 
            loading, 
            login, 
            signup, 
            logout, 
            updateUser, 
            saveOrder, 
            getOrders,
            cancelOrder,
            getUser 
        }}>
            {children}
        </UserContext.Provider>
    );
}

function generateAvatar(name) {
    const safeName = (name && typeof name === 'string' && name.trim() !== '') ? name.trim() : 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName)}&background=0090f0&color=fff&size=128&bold=true`;
}
