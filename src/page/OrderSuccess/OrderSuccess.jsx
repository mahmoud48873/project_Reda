import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaHome, FaTachometerAlt } from 'react-icons/fa';
import './OrderSuccess.css';

function OrderSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const { order } = location.state || {};
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        if (!order) { navigate('/'); return; }
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, [order, navigate]);

    if (!order) return null;

    const confettiPieces = Array.from({ length: 60 }, (_, i) => i);
    const colors = ['#0090f0', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    return (
        <div className="order_success_page">
            {/* Confetti */}
            {showConfetti && (
                <div className="confetti_wrap" aria-hidden="true">
                    {confettiPieces.map(i => (
                        <div
                            key={i}
                            className="confetti_piece"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 3}s`,
                                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                                width: `${6 + Math.random() * 8}px`,
                                height: `${6 + Math.random() * 8}px`,
                                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                                transform: `rotate(${Math.random() * 360}deg)`,
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="container">
                <div className="success_card">
                    {/* Icon */}
                    <div className="success_icon_wrap">
                        <FaCheckCircle className="success_icon" />
                        <div className="success_icon_ring"></div>
                    </div>

                    <h1>Order Placed Successfully! 🎉</h1>
                    <p className="success_subtitle">
                        Thank you for shopping with Reda Store! Your order is being prepared.
                    </p>

                    {/* Tracking */}
                    <div className="tracking_card">
                        <div className="tracking_label">Your Tracking Number</div>
                        <div className="tracking_number">{order.trackingNumber}</div>
                        <p className="tracking_note">Save this number to track your shipment</p>
                    </div>

                    {/* Order Details */}
                    <div className="order_details_grid">
                        <div className="order_detail_item">
                            <span className="detail_label">Order Date</span>
                            <span className="detail_value">
                                {new Date(order.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                        <div className="order_detail_item">
                            <span className="detail_label">Total Amount</span>
                            <span className="detail_value total_amount">${order.total?.toFixed(2)}</span>
                        </div>
                        <div className="order_detail_item">
                            <span className="detail_label">Payment Method</span>
                            <span className="detail_value">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</span>
                        </div>
                        <div className="order_detail_item">
                            <span className="detail_label">Status</span>
                            <span className="detail_value status_badge">{order.status}</span>
                        </div>
                        <div className="order_detail_item full_width">
                            <span className="detail_label">Delivery Address</span>
                            <span className="detail_value">{order.shippingAddress}</span>
                        </div>
                    </div>

                    {/* Order Items Preview */}
                    {order.items?.length > 0 && (
                        <div className="success_items">
                            <h3><FaBox /> Your Items ({order.items.length})</h3>
                            <div className="success_items_grid">
                                {order.items.map((item, i) => (
                                    <div key={i} className="success_item">
                                        <img src={item.images?.[0]} alt={item.title} />
                                        <p>{item.title}</p>
                                        <span>x{item.quantity || 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="success_actions">
                        <Link to="/" className="success_btn primary">
                            <FaHome /> Continue Shopping
                        </Link>
                        <Link to="/dashboard" className="success_btn secondary">
                            <FaTachometerAlt /> View My Orders
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccess;
