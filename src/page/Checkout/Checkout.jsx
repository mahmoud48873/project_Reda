import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../../components/context/CartContext';
import { UserContext } from '../../components/context/UserContext';
import { ToastContext } from '../../components/context/ToastContext';
import { FaShippingFast, FaCreditCard, FaMoneyBillWave, FaLock } from 'react-icons/fa';
import './Checkout.css';

function Checkout() {
    const { CartItem, clearCart } = useContext(CartContext);
    const { user, saveOrder } = useContext(UserContext);
    const { showToast } = useContext(ToastContext);
    const location = useLocation();
    const navigate = useNavigate();
    const { total = 0, discount = 0, appliedPromo } = location.state || {};

    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: '',
        paymentMethod: 'cod',
        cardNumber: '',
        cardExpiry: '',
        cardCVV: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.phone || !form.address || !form.city) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        setIsProcessing(true);
        await new Promise(res => setTimeout(res, 1800));

        const trackingNumber = 'RDA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const order = {
            trackingNumber,
            date: new Date().toISOString(),
            items: CartItem,
            total: total || CartItem.reduce((a, i) => a + i.price * (i.quantity || 1), 0),
            discount,
            appliedPromo,
            shippingAddress: `${form.address}, ${form.city}`,
            paymentMethod: form.paymentMethod,
            status: 'Processing',
        };

        saveOrder(order);
        clearCart();
        setIsProcessing(false);
        navigate('/order-success', { state: { order } });
    };

    if (CartItem.length === 0) {
        navigate('/cart');
        return null;
    }

    const subtotal = CartItem.reduce((a, i) => a + i.price * (i.quantity || 1), 0);
    const finalTotal = total || subtotal;

    return (
        <div className="checkout_page">
            <div className="container">
                <h1 className="checkout_title">Checkout</h1>
                <div className="checkout_grid">
                    {/* Left: Form */}
                    <form className="checkout_form_section" onSubmit={handlePlaceOrder}>
                        {/* Shipping Info */}
                        <div className="checkout_card">
                            <div className="checkout_card_title">
                                <FaShippingFast /> Shipping Information
                            </div>
                            <div className="form_row_2">
                                <div className="form_group">
                                    <label>Full Name *</label>
                                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
                                </div>
                                <div className="form_group">
                                    <label>Email *</label>
                                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                                </div>
                            </div>
                            <div className="form_row_2">
                                <div className="form_group">
                                    <label>Phone *</label>
                                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+20 1xx xxx xxxx" required />
                                </div>
                                <div className="form_group">
                                    <label>City *</label>
                                    <input name="city" value={form.city} onChange={handleChange} placeholder="e.g. Cairo" required />
                                </div>
                            </div>
                            <div className="form_group">
                                <label>Street Address *</label>
                                <input name="address" value={form.address} onChange={handleChange} placeholder="Your full address" required />
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="checkout_card">
                            <div className="checkout_card_title">
                                <FaCreditCard /> Payment Method
                            </div>
                            <div className="payment_methods">
                                <label className={`payment_option ${form.paymentMethod === 'cod' ? 'selected' : ''}`}>
                                    <input type="radio" name="paymentMethod" value="cod" checked={form.paymentMethod === 'cod'} onChange={handleChange} />
                                    <FaMoneyBillWave className="payment_icon" />
                                    <div>
                                        <strong>Cash on Delivery</strong>
                                        <p>Pay when your order arrives</p>
                                    </div>
                                </label>
                                <label className={`payment_option ${form.paymentMethod === 'card' ? 'selected' : ''}`}>
                                    <input type="radio" name="paymentMethod" value="card" checked={form.paymentMethod === 'card'} onChange={handleChange} />
                                    <FaCreditCard className="payment_icon" />
                                    <div>
                                        <strong>Credit / Debit Card</strong>
                                        <p>Visa, Mastercard accepted</p>
                                    </div>
                                </label>
                            </div>

                            {form.paymentMethod === 'card' && (
                                <div className="card_fields">
                                    <div className="form_group">
                                        <label>Card Number</label>
                                        <input name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" maxLength={19} />
                                    </div>
                                    <div className="form_row_2">
                                        <div className="form_group">
                                            <label>Expiry Date</label>
                                            <input name="cardExpiry" value={form.cardExpiry} onChange={handleChange} placeholder="MM/YY" maxLength={5} />
                                        </div>
                                        <div className="form_group">
                                            <label>CVV <FaLock style={{ fontSize: 11 }} /></label>
                                            <input name="cardCVV" value={form.cardCVV} onChange={handleChange} placeholder="•••" maxLength={3} type="password" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="place_order_btn" disabled={isProcessing}>
                            {isProcessing ? (
                                <><span className="btn_spinner"></span> Processing Order...</>
                            ) : (
                                <><FaLock /> Place Order — ${finalTotal.toFixed(2)}</>
                            )}
                        </button>
                    </form>

                    {/* Right: Summary */}
                    <div className="order_summary_card">
                        <div className="checkout_card_title">🛒 Order Summary</div>
                        <div className="summary_items">
                            {CartItem.map((item, i) => (
                                <div key={i} className="summary_item">
                                    <img src={item.images[0]} alt={item.title} />
                                    <div className="summary_item_info">
                                        <p>{item.title}</p>
                                        <span>Qty: {item.quantity || 1}</span>
                                    </div>
                                    <strong>${(item.price * (item.quantity || 1)).toFixed(2)}</strong>
                                </div>
                            ))}
                        </div>
                        <div className="summary_totals">
                            <div className="summary_row">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="summary_row discount">
                                    <span>Discount</span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="summary_row summary_row_total">
                                <strong>Total</strong>
                                <strong>${finalTotal.toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
