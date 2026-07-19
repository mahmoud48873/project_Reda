import React, { useContext, useState } from 'react';
import { CartContext } from '../../components/context/CartContext';
import { LanguageContext } from '../../components/context/LanguageContext';
import { UserContext } from '../../components/context/UserContext';
import { ToastContext } from '../../components/context/ToastContext';
import { FaTrash, FaTag, FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const PROMO_CODES = {
    'F1': { type: 'percent', value: 20, label: '20% Off' },
    'SAVE10': { type: 'percent', value: 10, label: '10% Off' },
    'SAVE20': { type: 'percent', value: 20, label: '20% Off' },
    'FLAT50': { type: 'fixed', value: 50, label: '$50 Off' },
};

function Cart() {
    const { CartItem, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);
    const { user } = useContext(UserContext) || {};
    const { showToast } = useContext(ToastContext) || {};
    const { t, language } = useContext(LanguageContext) || {};
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
            setPromoError(t ? t('invalidPromo') : 'Invalid promo code. Try F1, SAVE10, SAVE20, or FLAT50');
            setAppliedPromo(null);
        }
    };

    const removePromo = () => {
        setAppliedPromo(null);
        setPromoCode('');
        setPromoError('');
    };

    const handleProceedToCheckout = () => {
        if (!user) {
            showToast?.(
                language === 'ar'
                    ? 'عذراً! يجب عليك إنشاء حساب أولاً لعمل الطلب 🛒'
                    : 'Please create an account or log in first to place your order! 🛒',
                'error'
            );
            navigate('/signup');
            return;
        }
        navigate('/checkout', { state: { total, discount, appliedPromo } });
    };

    const getProductImage = (item) => {
        if (Array.isArray(item.images) && item.images.length > 0) {
            return item.images[0];
        }
        if (typeof item.images === 'string' && item.images.length > 5) {
            return item.images;
        }
        return item.thumbnail || 'https://via.placeholder.com/150';
    };

    return (
        <div className='cart_page'>
            <div className="cart_container">
                <h1 className='cart_title'>{t ? t('orderSummary') : 'Order Summary'}</h1>
                <div className='items_container'>
                    {CartItem.length === 0 ? (
                        <p className='empty'>{t ? t('yourCartIsEmpty') : 'Your Cart is Empty'}</p>
                    ) : (
                        CartItem.map((item, index) => (
                            <div className='item_cart' key={index}>
                                <img src={getProductImage(item)} alt={item.title} className='product_img' />
                                <div className='content'>
                                    <h1>{item.title}</h1>
                                    <p className='price'>${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                                    <div className='quantity'>
                                        <button onClick={() => decreaseQuantity(item.id)}>-</button>
                                        <span>{item.quantity || 1}</span>
                                        <button onClick={() => increaseQuantity(item.id)}>+</button>
                                    </div>
                                </div>
                                <button className='dele' onClick={() => removeFromCart(item.id)} title="Remove Item">
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
                            <div className="promo_header"><FaTag /> {t ? t('promoCode') : 'Promo Code'}</div>
                            {appliedPromo ? (
                                <div className="promo_applied">
                                    <span>🎉 <strong>{appliedPromo.code}</strong> — {appliedPromo.label} {t ? t('promoApplied') : 'applied!'}</span>
                                    <button onClick={removePromo}>{t ? t('remove') : 'Remove'}</button>
                                </div>
                            ) : (
                                <div className="promo_input_wrap">
                                    <input
                                        type="text"
                                        placeholder={t ? t('enterPromoCode') : "Enter promo code..."}
                                        value={promoCode}
                                        onChange={e => setPromoCode(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && applyPromo()}
                                    />
                                    <button onClick={applyPromo}>{t ? t('apply') : 'Apply'}</button>
                                </div>
                            )}
                            {promoError && <p className="promo_error">{promoError}</p>}
                        </div>

                        {/* Totals */}
                        <div className='totals_section'>
                            <div className="total_row">
                                <span>{t ? t('subtotal') : 'Subtotal'}</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="total_row discount_row">
                                    <span>{t ? t('discount') : 'Discount'} ({appliedPromo.label})</span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="total_row total_row_final">
                                <span>{t ? t('total') : 'Total'}</span>
                                <strong>${total.toFixed(2)}</strong>
                            </div>
                        </div>

                        <button
                            className='checkout_btn'
                            onClick={handleProceedToCheckout}
                        >
                            {t ? t('proceedToCheckout') : 'Proceed to Checkout'} <FaArrowRight />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Cart;