// Developer: Mahmoud Sameh Fathy Ibrahim
// Student Code: 624018
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaHome, FaTachometerAlt, FaArrowRight, FaTruck } from 'react-icons/fa';
import { LanguageContext } from '../../components/context/LanguageContext';
import './OrderSuccess.css';

function OrderSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, language } = useContext(LanguageContext) || {};
    const [showConfetti, setShowConfetti] = useState(true);

    const [order] = useState(() => {
        if (location.state?.order) return location.state.order;
        try {
            const saved = sessionStorage.getItem('last_order');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error(e);
        }
        return null;
    });

    useEffect(() => {
        if (!order) { navigate('/'); return; }
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, [order, navigate]);

    const [confettiStyles, setConfettiStyles] = useState([]);

    useEffect(() => {
        const colors = ['#0090f0', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setConfettiStyles(Array.from({ length: 60 }).map(() => ({
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${Math.random() * 360}deg)`,
        })));
    }, []);

    if (!order) return null;

    return (
        <div className="order_success_page">
            {/* Confetti */}
            {showConfetti && (
                <div className="confetti_wrap" aria-hidden="true">
                    {confettiStyles.map((style, i) => (
                        <div
                            key={i}
                            className="confetti_piece"
                            style={style}
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

                    <h1>{t ? t('orderSuccessTitle') : 'Order Placed Successfully!'}</h1>
                    <p className="success_subtitle">
                        {t ? t('orderSuccessDesc') : 'Thank you for shopping with us. Your order is being processed.'}
                    </p>

                    {/* Tracking */}
                    <div className="tracking_card">
                        <div className="tracking_label">{t ? t('trackingNumber') : 'TRACKING NUMBER:'}</div>
                        <div className="tracking_number">{order.trackingNumber}</div>
                    </div>

                    {/* Order Details */}
                    {(() => {
                        const orderDate = new Date(order.date || Date.now());
                        const deliveryDate = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000);
                        const formattedOrderDate = orderDate.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                        const formattedDeliveryDate = deliveryDate.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });

                        return (
                            <div className="order_details_grid">
                                <div className="order_detail_item full_width">
                                    <span className="detail_label">{language === 'ar' ? 'جدول تتبع الطلب والتوصيل (3 أيام)' : 'ORDER & ESTIMATED DELIVERY TIMELINE (3 DAYS)'}</span>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginTop: '6px', fontSize: '14px', background: '#f8fafc', padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                                        <span>📅 {language === 'ar' ? 'تاريخ الطلب:' : 'Ordered:'} <strong>{formattedOrderDate}</strong></span>
                                        <FaArrowRight style={{ color: '#0090f0', transform: language === 'ar' ? 'rotate(180deg)' : 'none' }} />
                                        <span style={{ color: '#16a34a' }}><FaTruck style={{ margin: '0 4px', verticalAlign: 'middle' }} /> {language === 'ar' ? 'الاستلام المتوقع:' : 'Est. Delivery:'} <strong>{formattedDeliveryDate}</strong></span>
                                    </div>
                                </div>
                                <div className="order_detail_item">
                                    <span className="detail_label">{language === 'ar' ? 'الإجمالي' : 'TOTAL'}</span>
                                    <span className="detail_value total_amount">${order.total?.toFixed(2)}</span>
                                </div>
                                <div className="order_detail_item">
                                    <span className="detail_label">{language === 'ar' ? 'طريقة الدفع' : 'PAYMENT METHOD'}</span>
                                    <span className="detail_value">
                                        {order.paymentMethod === 'cod' 
                                            ? (t ? t('cashOnDelivery') : 'Cash on Delivery') 
                                            : (t ? t('cardPayment') : 'Credit / Debit Card')}
                                    </span>
                                </div>
                                <div className="order_detail_item">
                                    <span className="detail_label">{language === 'ar' ? 'الحالة' : 'STATUS'}</span>
                                    <span className="detail_value status_badge">{order.status || 'Processing'}</span>
                                </div>
                                <div className="order_detail_item full_width">
                                    <span className="detail_label">{language === 'ar' ? 'العنوان' : 'STREET ADDRESS *'}</span>
                                    <span className="detail_value">{order.shippingAddress}</span>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Actions */}
                    <div className="success_actions">
                        <Link to="/" className="success_btn primary">
                            <FaHome /> {t ? t('backToHome') : 'Back to Home'}
                        </Link>
                        <Link to="/dashboard" className="success_btn secondary">
                            <FaTachometerAlt /> {t ? t('dashboard') : 'Dashboard'}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccess;
