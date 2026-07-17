import React, { useContext, useState } from 'react'
import { CartContext } from '../../components/context/CartContext'
import { FaTrash, FaTag, FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import './Cart.css'

const PROMO_CODES = {
    'F1': { type: 'percent', value: 20, label: '20% Off' },
    'SAVE10': { type: 'percent', value: 10, label: '10% Off' },
    'SAVE20': { type: 'percent', value: 20, label: '20% Off' },
    'FLAT50': { type: 'fixed', value: 50, label: '$50 Off' },
};

function Cart() {
    const { CartItem, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext)
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoError, setPromoError] = useState('');
    const navigate = useNavigate();

    const subtotal = CartItem.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

    let discount = 0;
    if (appliedPromo) {
        if (appliedPromo.type === 'percent') discount = subtotal * appliedPromo.value / 100;
        else discount = Math.min(appliedPromo.value, subtotal);
    }
    const total = subtotal - discount;

    const applyPromo = () => {
        const code = promoCode.trim().toUpperCase();
        if (PROMO_CODES[code]) {
            setAppliedPromo({ ...PROMO_CODES[code], code });
            setPromoError('');
        } else {
            setPromoError('Invalid promo code. Try F1, SAVE10, SAVE20, or FLAT50');
            setAppliedPromo(null);
        }
    };

    const removePromo = () => {
        setAppliedPromo(null);
        setPromoCode('');
        setPromoError('');
    };

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
                                    <p className='price'>${(item.price * (item.quantity || 1)).toFixed(2)}</p>
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

                {CartItem.length > 0 && (
                    <>
                        {/* Promo Code */}
                        <div className="promo_section">
                            <div className="promo_header"><FaTag /> Promo Code</div>
                            {appliedPromo ? (
                                <div className="promo_applied">
                                    <span>🎉 <strong>{appliedPromo.code}</strong> — {appliedPromo.label} applied!</span>
                                    <button onClick={removePromo}>Remove</button>
                                </div>
                            ) : (
                                <div className="promo_input_wrap">
                                    <input
                                        type="text"
                                        placeholder="Enter promo code..."
                                        value={promoCode}
                                        onChange={e => setPromoCode(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && applyPromo()}
                                    />
                                    <button onClick={applyPromo}>Apply</button>
                                </div>
                            )}
                            {promoError && <p className="promo_error">{promoError}</p>}
                        </div>

                        {/* Totals */}
                        <div className='totals_section'>
                            <div className="total_row">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="total_row discount_row">
                                    <span>Discount ({appliedPromo.label})</span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="total_row total_row_final">
                                <span>Total</span>
                                <strong>${total.toFixed(2)}</strong>
                            </div>
                        </div>

                        <button
                            className='checkout_btn'
                            onClick={() => navigate('/checkout', { state: { total, discount, appliedPromo } })}
                        >
                            Proceed to Checkout <FaArrowRight />
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default Cart