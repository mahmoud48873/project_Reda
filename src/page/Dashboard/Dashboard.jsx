// Developer: Mahmoud Sameh Fathy Ibrahim
// Student Code: 624018
import React, { useContext, useState } from 'react';
import { UserContext } from '../../components/context/UserContext';
import { ToastContext } from '../../components/context/ToastContext';
import { LanguageContext } from '../../components/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBox, FaHeart, FaEdit, FaSave, FaTimes, FaShoppingBag, FaMapMarkerAlt, FaPhone, FaArrowRight, FaTruck } from 'react-icons/fa';
import './Dashboard.css';

function Dashboard() {
    const { user, logout, getOrders, cancelOrder, updateUser } = useContext(UserContext);
    const { showToast } = useContext(ToastContext);
    const { language } = useContext(LanguageContext) || {};
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });

    const [orders, setOrders] = useState([]);
    const [, setLoadingOrders] = useState(true);

    const [cancelModalData, setCancelModalData] = useState({ isOpen: false, order: null });

    const handleCancelOrderClick = (order) => {
        setCancelModalData({ isOpen: true, order });
    };

    const confirmCancelOrder = async () => {
        const orderToCancel = cancelModalData.order;
        if (!orderToCancel) return;
        
        setCancelModalData({ isOpen: false, order: null });
        try {
            await cancelOrder(orderToCancel);
            setOrders(prev => prev.map(o => o.trackingNumber === orderToCancel.trackingNumber ? { ...o, status: 'Cancelled' } : o));
            showToast?.(language === 'ar' ? "تم إلغاء الطلب بنجاح 📦" : "Order cancelled successfully 📦", "info");
        } catch (err) {
            console.error("Cancel order error:", err);
            showToast?.(language === 'ar' ? "حدث خطأ أثناء إلغاء الطلب" : "Error cancelling order", "error");
        }
    };

    React.useEffect(() => {
        if (!user) return;
        const fetchUserOrders = async () => {
            try {
                const userOrders = await getOrders();
                setOrders(userOrders || []);
            } catch (err) {
                console.error("Error loading orders:", err);
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchUserOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleSave = () => {
        updateUser(editData);
        showToast('Profile updated successfully!', 'success');
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        showToast('Logged out. See you soon! 👋', 'info');
        navigate('/');
    };

    const getStatusColor = (status) => {
        const map = { 'Processing': '#f59e0b', 'Shipped': '#3b82f6', 'Delivered': '#22c55e', 'Cancelled': '#ef4444' };
        return map[status] || '#888';
    };

    return (
        <div className="dashboard_page">
            <div className="container">
                {/* Sidebar */}
                <aside className="dashboard_sidebar">
                    <div className="sidebar_profile">
                        <img src={user.avatar} alt={user.name} className="sidebar_avatar" />
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                    </div>
                    <nav className="sidebar_nav">
                        <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
                            <FaUser /> My Profile
                        </button>
                        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
                            <FaBox /> Order History
                            {orders.length > 0 && <span className="order_badge">{orders.length}</span>}
                        </button>
                        {(user?.email?.toLowerCase() === 'mahmod48873@gmail.com' || user?.role === 'admin') && (
                            <button onClick={() => navigate('/admin')} style={{ background: 'linear-gradient(135deg, #0090f0, #0060c0)', color: '#fff', fontWeight: 'bold' }}>
                                ⚡ Admin Dashboard (لوحة التحكم)
                            </button>
                        )}
                        <button className="logout_btn_dash" onClick={handleLogout}>
                            <FaTimes /> Logout
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="dashboard_main">
                    {activeTab === 'profile' && (
                        <div className="profile_section">
                            <div className="section_header">
                                <h2><FaUser /> My Profile</h2>
                                {!isEditing ? (
                                    <button className="edit_btn" onClick={() => setIsEditing(true)}>
                                        <FaEdit /> Edit Profile
                                    </button>
                                ) : (
                                    <div className="edit_actions">
                                        <button className="save_btn" onClick={handleSave}><FaSave /> Save</button>
                                        <button className="cancel_btn" onClick={() => setIsEditing(false)}><FaTimes /> Cancel</button>
                                    </div>
                                )}
                            </div>

                            <div className="profile_card">
                                <div className="profile_avatar_wrap">
                                    <img src={user.avatar} alt={user.name} />
                                    <div className="profile_avatar_badge">
                                        <FaUser />
                                    </div>
                                </div>
                                <div className="profile_info_grid">
                                    <div className="info_field">
                                        <label><FaUser /> Full Name</label>
                                        {isEditing ? (
                                            <input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
                                        ) : (
                                            <p>{user.name}</p>
                                        )}
                                    </div>
                                    <div className="info_field">
                                        <label>📧 Email Address</label>
                                        <p>{user.email}</p>
                                    </div>
                                    <div className="info_field">
                                        <label><FaPhone /> Phone Number</label>
                                        {isEditing ? (
                                            <input value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} placeholder="e.g. +20 1xx xxx xxxx" />
                                        ) : (
                                            <p>{user.phone || <span className="not_set">Not set</span>}</p>
                                        )}
                                    </div>
                                    <div className="info_field">
                                        <label><FaMapMarkerAlt /> Address</label>
                                        {isEditing ? (
                                            <input value={editData.address} onChange={e => setEditData({ ...editData, address: e.target.value })} placeholder="e.g. Cairo, Egypt" />
                                        ) : (
                                            <p>{user.address || <span className="not_set">Not set</span>}</p>
                                        )}
                                    </div>
                                    <div className="info_field">
                                        <label>📅 Member Since</label>
                                        <p>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
                                    </div>
                                    <div className="info_field">
                                        <label><FaShoppingBag /> Total Orders</label>
                                        <p>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="orders_section">
                            <div className="section_header">
                                <h2><FaBox /> Order History</h2>
                            </div>
                            {orders.length === 0 ? (
                                <div className="no_orders">
                                    <FaShoppingBag />
                                    <h3>No orders yet</h3>
                                    <p>When you place your first order, it will appear here.</p>
                                    <button onClick={() => navigate('/')} className="shop_now_btn">Shop Now</button>
                                </div>
                            ) : (
                                <div className="orders_list">
                                    {orders.map((order, idx) => {
                                        const orderDate = new Date(order.date || Date.now());
                                        const deliveryDate = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000);
                                        const formattedOrderDate = orderDate.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                                        const formattedDeliveryDate = deliveryDate.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });

                                        return (
                                            <div key={idx} className="order_card">
                                                <div className="order_card_header">
                                                    <div>
                                                        <span className="order_id">Order #{order.trackingNumber}</span>
                                                        <div className="order_delivery_timeline">
                                                            <span className="order_date_created" title={language === 'ar' ? 'تاريخ الطلب' : 'Order Date'}>
                                                                📅 {formattedOrderDate}
                                                            </span>
                                                            <FaArrowRight className="timeline_arrow" style={{ transform: language === 'ar' ? 'rotate(180deg)' : 'none' }} />
                                                            <span className="order_date_delivery" title={language === 'ar' ? 'تاريخ الاستلام المتوقع' : 'Expected Delivery Date'}>
                                                                <FaTruck />
                                                                <span>{language === 'ar' ? 'الاستلام:' : 'Est. Delivery:'} {formattedDeliveryDate}</span>
                                                             </span>
                                                        </div>
                                                    </div>
                                                    <span className="order_status" style={{ backgroundColor: getStatusColor(order.status) + '22', color: getStatusColor(order.status), border: `1px solid ${getStatusColor(order.status)}` }}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="order_items_preview">
                                                    {order.items?.slice(0, 3).map((item, i) => (
                                                        <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                                                            <img src={item.images?.[0]} alt={item.title} title={`${item.title} (${item.quantity || 1}x)`} />
                                                            {(item.quantity > 1) && (
                                                                <span style={{
                                                                    position: 'absolute',
                                                                    top: '-5px',
                                                                    right: '-5px',
                                                                    background: '#0090f0',
                                                                    color: '#fff',
                                                                    fontSize: '11px',
                                                                    fontWeight: 'bold',
                                                                    padding: '1px 6px',
                                                                    borderRadius: '10px',
                                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                                                                }}>
                                                                    x{item.quantity}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {order.items?.length > 3 && <span className="more_items">+{order.items.length - 3}</span>}
                                                </div>
                                                <div className="order_card_footer">
                                                    <span>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
                                                    <strong className="order_total">${order.total?.toFixed(2)}</strong>
                                                    {order.status !== 'Cancelled' && (
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleCancelOrderClick(order)}
                                                            style={{ marginLeft: 'auto', padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Custom Cancel Modal */}
            {cancelModalData.isOpen && (
                <div className="custom_modal_overlay">
                    <div className="custom_modal">
                        <div className="custom_modal_header">
                            <h3>{language === 'ar' ? 'تأكيد الإلغاء' : 'Confirm Cancellation'}</h3>
                            <button className="close_modal_btn" onClick={() => setCancelModalData({ isOpen: false, order: null })}><FaTimes /></button>
                        </div>
                        <div className="custom_modal_body">
                            <p>{language === 'ar' ? 'هل أنت متأكد من إلغاء هذا الطلب؟' : 'Are you sure you want to cancel this order?'}</p>
                        </div>
                        <div className="custom_modal_footer">
                            <button className="btn_modal_cancel" onClick={() => setCancelModalData({ isOpen: false, order: null })}>
                                {language === 'ar' ? 'تراجع' : 'Cancel'}
                            </button>
                            <button className="btn_modal_confirm" onClick={confirmCancelOrder}>
                                {language === 'ar' ? 'نعم، قم بالإلغاء' : 'Yes, Cancel Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
