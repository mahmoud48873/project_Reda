import { useState } from 'react';
import { UserContext } from './UserContext';

export default function UserProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData) => {
        const userObj = { ...userData, avatar: userData.avatar || generateAvatar(userData.name) };
        setUser(userObj);
        localStorage.setItem('currentUser', JSON.stringify(userObj));

        // Save order history if not exists
        if (!localStorage.getItem(`orders_${userObj.email}`)) {
            localStorage.setItem(`orders_${userObj.email}`, JSON.stringify([]));
        }
    };

    const signup = (userData) => {
        // Save user to "database" (localStorage)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userObj = { ...userData, avatar: generateAvatar(userData.name), createdAt: new Date().toISOString() };
        users.push(userObj);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem(`orders_${userData.email}`, JSON.stringify([]));
        // Auto-login after signup
        setUser(userObj);
        localStorage.setItem('currentUser', JSON.stringify(userObj));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const getUser = (email) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.find(u => u.email === email);
    };

    const saveOrder = (order) => {
        if (!user) return;
        const key = `orders_${user.email}`;
        const orders = JSON.parse(localStorage.getItem(key) || '[]');
        orders.unshift(order);
        localStorage.setItem(key, JSON.stringify(orders));
    };

    const getOrders = () => {
        if (!user) return [];
        const key = `orders_${user.email}`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    };

    const updateUser = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        // Update in users array too
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const idx = users.findIndex(u => u.email === user.email);
        if (idx !== -1) {
            users[idx] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
    };

    return (
        <UserContext.Provider value={{ user, login, signup, logout, getUser, saveOrder, getOrders, updateUser }}>
            {children}
        </UserContext.Provider>
    );
}

function generateAvatar(name) {
    const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=0090f0&color=fff&size=128&bold=true`;
}
