import { useState, useCallback } from 'react';
import { ToastContext } from './ToastContext';
import { FaCheck, FaHeart, FaExclamationCircle, FaInfoCircle, FaTimes, FaBalanceScale } from 'react-icons/fa';
import './toast.css';

const ICONS = {
  success: <FaCheck />,
  wishlist: <FaHeart />,
  error: <FaExclamationCircle />,
  info: <FaInfoCircle />,
  compare: <FaBalanceScale />,
};

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast_container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast_${toast.type}`}>
            <span className="toast_icon">{ICONS[toast.type] || ICONS.info}</span>
            <span className="toast_message">{toast.message}</span>
            <button
              type="button"
              className="toast_close"
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
