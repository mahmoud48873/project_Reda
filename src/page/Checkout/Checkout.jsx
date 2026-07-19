import React, { useState, useContext, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { 
    Elements, 
    CardNumberElement, 
    CardExpiryElement, 
    CardCvcElement, 
    useStripe, 
    useElements 
} from '@stripe/react-stripe-js';
import { CartContext } from '../../components/context/CartContext';
import { UserContext } from '../../components/context/UserContext';
import { ToastContext } from '../../components/context/ToastContext';
import { LanguageContext } from '../../components/context/LanguageContext';
import { FaShippingFast, FaCreditCard, FaMoneyBillWave, FaLock } from 'react-icons/fa';
import './Checkout.css';

const stripePromise = loadStripe('pk_test_51Turd1B5gNPSqgtEWN1cdMt5fOReZwO0a595K49WnpSSEZc4l8B2ceFEzumW62CWQOgATBd7BUCEuxqLqxSdH4kd00IoJ9A2wK');

const ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#0090f0',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '14px',
            '::placeholder': {
                color: '#888888',
            },
        },
        invalid: {
            color: '#ef4444',
            iconColor: '#ef4444',
        },
    },
};

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const { CartItem, clearCart } = useContext(CartContext);
    const { user, saveOrder } = useContext(UserContext);
    const { showToast } = useContext(ToastContext);
    const { language, t } = useContext(LanguageContext) || {};
    const location = useLocation();
    const navigate = useNavigate();
    const { total = 0, discount = 0, appliedPromo } = location.state || {};

    const [cardError, setCardError] = useState('');

    useEffect(() => {
        if (!user) {
            showToast?.(
                language === 'ar'
                    ? 'عذراً! يجب عليك إنشاء حساب أولاً لعمل الطلب 🛒'
                    : 'Please create an account or log in first to place your order! 🛒',
                'error'
            );
            navigate('/signup', { replace: true });
        }
    }, [user, navigate, language, showToast]);

    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: '',
        paymentMethod: 'cod',
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const orderPlacedRef = useRef(false);

    useEffect(() => {
        if (!orderPlacedRef.current && !isProcessing && CartItem.length === 0) {
            navigate('/cart');
        }
    }, [CartItem.length, isProcessing, navigate]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!user) {
            showToast?.(
                language === 'ar'
                    ? 'عذراً! يجب عليك إنشاء حساب أولاً لعمل الطلب 🛒'
                    : 'Please create an account or log in first to place your order! 🛒',
                'error'
            );
            navigate('/signup', { replace: true });
            return;
        }

        if (!form.name || !form.email || !form.phone || !form.address || !form.city) {
            showToast(t ? t('fillRequired') : 'Please fill in all required fields.', 'error');
            return;
        }

        setCardError('');
        setIsProcessing(true);

        if (form.paymentMethod === 'card') {
            if (stripe && elements) {
                const cardNumberElement = elements.getElement(CardNumberElement);
                if (cardNumberElement) {
                    const { error } = await stripe.createPaymentMethod({
                        type: 'card',
                        card: cardNumberElement,
                    });
                    if (error) {
                        setCardError(error.message || 'Card details validation error');
                        setIsProcessing(false);
                        return;
                    }
                }
            }
        }

        await new Promise(res => setTimeout(res, 1500));

        orderPlacedRef.current = true;
        const trackingNumber = 'RDA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const order = {
            trackingNumber,
            date: new Date().toISOString(),
            items: [...CartItem],
            total: total || CartItem.reduce((a, i) => a + i.price * (i.quantity || 1), 0),
            discount,
            appliedPromo,
            shippingAddress: `${form.address}, ${form.city}`,
            paymentMethod: form.paymentMethod,
            status: 'Processing',
        };

        await saveOrder(order);
        try {
            sessionStorage.setItem('last_order', JSON.stringify(order));
        } catch (e) {
            console.error(e);
        }
        clearCart();
        navigate('/order-success', { state: { order }, replace: true });
    };

    if (!orderPlacedRef.current && !isProcessing && CartItem.length === 0) {
        return null;
    }

    const subtotal = CartItem.reduce((a, i) => a + i.price * (i.quantity || 1), 0);
    const finalTotal = total || subtotal;

    return (
        <div className="checkout_page">
            <div className="container">
                <h1 className="checkout_title">{t ? t('checkout') : 'Checkout'}</h1>
                <div className="checkout_grid">
                    {/* Left: Form */}
                    <form className="checkout_form_section" onSubmit={handlePlaceOrder}>
                        {/* Shipping Info */}
                        <div className="checkout_card">
                            <div className="checkout_card_title">
                                <FaShippingFast /> {t ? t('shippingInfo') : 'Shipping Information'}
                            </div>
                            <div className="form_row_2">
                                <div className="form_group">
                                    <label>{t ? t('fullName') : 'Full Name *'}</label>
                                    <input name="name" value={form.name} onChange={handleChange} placeholder={t ? t('enterYourName') : "Your full name"} required />
                                </div>
                                <div className="form_group">
                                    <label>{t ? t('email') : 'Email *'}</label>
                                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                                </div>
                            </div>
                            <div className="form_row_2">
                                <div className="form_group">
                                    <label>{t ? t('phone') : 'Phone *'}</label>
                                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+20 1xx xxx xxxx" required />
                                </div>
                                <div className="form_group">
                                    <label>{t ? t('city') : 'City *'}</label>
                                    <input name="city" value={form.city} onChange={handleChange} placeholder={t ? t('cairo') : "e.g. Cairo"} required />
                                </div>
                            </div>
                            <div className="form_group">
                                <label>{t ? t('streetAddress') : 'Street Address *'}</label>
                                <input name="address" value={form.address} onChange={handleChange} placeholder={t ? t('address') : "Your full address"} required />
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="checkout_card">
                            <div className="checkout_card_title">
                                <FaCreditCard /> {t ? t('paymentMethod') : 'Payment Method'}
                            </div>
                            <div className="payment_methods">
                                <label className={`payment_option ${form.paymentMethod === 'cod' ? 'selected' : ''}`}>
                                    <input type="radio" name="paymentMethod" value="cod" checked={form.paymentMethod === 'cod'} onChange={handleChange} />
                                    <FaMoneyBillWave className="payment_icon" />
                                    <div>
                                        <strong>{t ? t('cashOnDelivery') : 'Cash on Delivery'}</strong>
                                        <p>{t ? t('codDesc') : 'Pay when your order arrives'}</p>
                                    </div>
                                </label>
                                <label className={`payment_option ${form.paymentMethod === 'card' ? 'selected' : ''}`}>
                                    <input type="radio" name="paymentMethod" value="card" checked={form.paymentMethod === 'card'} onChange={handleChange} />
                                    <FaCreditCard className="payment_icon" />
                                    <div>
                                        <strong>{t ? t('cardPayment') : 'Credit / Debit Card'}</strong>
                                        <p>{t ? t('cardDesc') : 'Visa, Mastercard accepted'}</p>
                                    </div>
                                </label>
                            </div>

                            {form.paymentMethod === 'card' && (
                                <div className="card_fields">
                                    <div className="form_group">
                                        <label>{t ? t('cardNumber') : 'Card Number'}</label>
                                        <div className="stripe_input_wrap">
                                            <CardNumberElement options={ELEMENT_OPTIONS} />
                                        </div>
                                    </div>
                                    <div className="form_row_2">
                                        <div className="form_group">
                                            <label>{t ? t('expiryDate') : 'Expiry Date'}</label>
                                            <div className="stripe_input_wrap">
                                                <CardExpiryElement options={ELEMENT_OPTIONS} />
                                            </div>
                                        </div>
                                        <div className="form_group">
                                            <label>{t ? t('cvv') : 'CVV'} <FaLock style={{ fontSize: 11 }} /></label>
                                            <div className="stripe_input_wrap">
                                                <CardCvcElement options={ELEMENT_OPTIONS} />
                                            </div>
                                        </div>
                                    </div>
                                    {cardError && <div className="stripe_error">{cardError}</div>}
                                </div>
                            )}
                        </div>

                        <button type="submit" className="place_order_btn" disabled={isProcessing}>
                            {isProcessing ? (
                                <><span className="btn_spinner"></span> {t ? t('processingOrder') : 'Processing Order...'}</>
                            ) : (
                                <><FaLock /> {t ? t('placeOrder') : 'Place Order'} — ${finalTotal.toFixed(2)}</>
                            )}
                        </button>
                    </form>

                    {/* Right: Summary */}
                    <div className="order_summary_card">
                        <div className="checkout_card_title">🛒 {t ? t('orderSummary') : 'Order Summary'}</div>
                        <div className="summary_items">
                            {CartItem.map((item, i) => (
                                <div key={i} className="summary_item">
                                    <img src={item.images?.[0] || item.thumbnail} alt={item.title} />
                                    <div className="summary_item_info">
                                        <p>{item.title}</p>
                                        <span>{t ? t('qty') : 'Qty'}: {item.quantity || 1}</span>
                                    </div>
                                    <strong>${(item.price * (item.quantity || 1)).toFixed(2)}</strong>
                                </div>
                            ))}
                        </div>
                        <div className="summary_totals">
                            <div className="summary_row">
                                <span>{t ? t('subtotal') : 'Subtotal'}</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="summary_row discount">
                                    <span>{t ? t('discount') : 'Discount'}</span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="summary_row summary_row_total">
                                <strong>{t ? t('total') : 'Total'}</strong>
                                <strong>${finalTotal.toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Checkout() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
}
