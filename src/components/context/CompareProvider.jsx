import { useState, useContext } from 'react';
import { CompareContext } from './CompareContext';
import { ToastContext } from './ToastContext';

export default function CompareProvider({ children }) {
    const [compareItems, setCompareItems] = useState([]);
    const toastCtx = useContext(ToastContext);

    const addToCompare = (product) => {
        const isAlreadyAdded = compareItems.some(p => p.id === product.id);
        if (isAlreadyAdded) {
            setCompareItems(prev => prev.filter(p => p.id !== product.id));
            toastCtx?.showToast(`${product.title} removed from comparison!`, 'compare');
        } else if (compareItems.length >= 4) {
            toastCtx?.showToast('You can compare up to 4 products only!', 'error');
        } else {
            setCompareItems(prev => [...prev, product]);
            toastCtx?.showToast(`${product.title} added to comparison!`, 'compare');
        }
    };

    const removeFromCompare = (id) => {
        setCompareItems(prev => prev.filter(p => p.id !== id));
    };

    const clearCompare = () => setCompareItems([]);

    const isInCompare = (id) => compareItems.some(p => p.id === id);

    return (
        <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
            {children}
        </CompareContext.Provider>
    );
}
