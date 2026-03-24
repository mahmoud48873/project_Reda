import React, { useContext } from 'react'
import { CartContext } from '../../components/context/CartContext'
import { FaTrash } from "react-icons/fa";
import './Cart.css'

function Cart() {
    const { CartItem, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext)
    const total = CartItem.reduce((total, item) => total + item.price * (item.quantity || 1), 0)

    return (
        <div className='checkout'>
            <div className="ourdersummary">
                <h1 className='title'>Order Summary</h1>
                <div className='items_container'>
                    {CartItem.length === 0 ? <p className='empty'>Your Cart is Empty</p> : (
                        CartItem.map((item, index) => (
                            <div className='item_cart' key={index}>
                                <img src={item.images[0]} alt={item.title} className='product_img' />
                                <div className='content'>
                                    <h1>{item.title}</h1>
                                    <p className='price'>${item.price}</p>
                                    <div className='quantity'>
                                        <button onClick={() => decreaseQuantity(item.id)}>-</button>
                                        <span>{item.quantity || 1}</span>
                                        <button onClick={() => increaseQuantity(item.id)}>+</button>
                                    </div>
                                </div>
                                <button className='dele' onClick={() => removeFromCart(item.id)}>
                                    <FaTrash />
                                </button>
                            </div>
                        ))
                    )}
                </div>
                <div className='total'>
                    <p>Total:</p>
                    <span>${total.toFixed(2)}</span>
                </div>
                <button className='checkout_btn'>Place Order</button>
            </div>
        </div>
    )
}

export default Cart