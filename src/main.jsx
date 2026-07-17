import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import CartProvider from './components/context/CartProvider'
import WishlistProvider from './components/context/WishlistProvider'
import UserProvider from './components/context/UserProvider'
import CompareProvider from './components/context/CompareProvider'
import ToastProvider from './components/context/ToastProvider'
import LanguageProvider from './components/context/LanguageProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ToastProvider>
          <UserProvider>
            <WishlistProvider>
              <CartProvider>
                <CompareProvider>
                  <App />
                </CompareProvider>
              </CartProvider>
            </WishlistProvider>
          </UserProvider>
        </ToastProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
