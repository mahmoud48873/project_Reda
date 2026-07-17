import React, { useContext, useState } from 'react';
import { UserContext } from '../../components/context/UserContext';
import { ToastContext } from '../../components/context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBox, FaHeart, FaEdit, FaSave, FaTimes, FaShoppingBag, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import './Dashboard.css';

function Dashboard() {
    const { user, logout, getOrders, updateUser } = useContext(UserContext);
    const { showToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });

    if (!user) {
        navigate('/login');
        return null;
    }

    const orders = getOrders();

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
                                    {orders.map((order, idx) => (
                                        <div key={idx} className="order_card">
                                            <div className="order_card_header">
                                                <div>
                                                    <span className="order_id">Order #{order.trackingNumber}</span>
                                                    <span className="order_date">{new Date(order.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                                <span className="order_status" style={{ backgroundColor: getStatusColor(order.status) + '22', color: getStatusColor(order.status), border: `1px solid ${getStatusColor(order.status)}` }}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="order_items_preview">
                                                {order.items?.slice(0, 3).map((item, i) => (
                                                    <img key={i} src={item.images?.[0]} alt={item.title} title={item.title} />
                                                ))}
                                                {order.items?.length > 3 && <span className="more_items">+{order.items.length - 3}</span>}
                                            </div>
                                            <div className="order_card_footer">
                                                <span>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
                                                <strong className="order_total">${order.total?.toFixed(2)}</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
