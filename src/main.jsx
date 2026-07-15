import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import CartProvider from './components/context/CartProvider'
import WishlistProvider from './components/context/WishlistProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <WishlistProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </WishlistProvider>
    </BrowserRouter>
  </StrictMode>,
)
