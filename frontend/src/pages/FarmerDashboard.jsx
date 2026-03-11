import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api, { getServerUrl } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Spices', 'Others'];

function AddProductModal({ onClose, onSuccess }) {
    const [form, setForm] = useState({
        name: '', description: '', price: '', category: 'Vegetables', location: '',
        quantity: '', unit: 'kg', type: 'direct', biddingEndTime: ''
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
        if (image) fd.append('image', image);
        try {
            await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Product listed successfully! 🌾');
            onSuccess();
            onClose();
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="glass-card" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: '36px' }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                    <h2 style={{ fontWeight: 800, fontSize: '1.3rem' }}>🌾 Add New Product</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                        { name: 'name', placeholder: 'Product Name', label: 'Product Name' },
                        { name: 'description', placeholder: 'Describe your product...', label: 'Description' },
                        { name: 'price', placeholder: '₹ Base Price', label: 'Price (₹)', type: 'number' },
                        { name: 'location', placeholder: 'Farm location', label: 'Location' },
                        { name: 'quantity', placeholder: 'Available quantity', label: 'Quantity', type: 'number' },
                    ].map(({ name, placeholder, label, type = 'text' }) => (
                        <div key={name}>
                            <label style={{ fontSize: '0.82rem', color: '#9ca3af', display: 'block', marginBottom: 6, fontWeight: 600 }}>{label}</label>
                            {name === 'description' ? (
                                <textarea className="input-field" name={name} placeholder={placeholder} rows={3}
                                    value={form[name]} onChange={handleChange} required style={{ resize: 'vertical' }} />
                            ) : (
                                <input className="input-field" type={type} name={name} placeholder={placeholder}
                                    value={form[name]} onChange={handleChange} required />
                            )}
                        </div>
                    ))}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <label style={{ fontSize: '0.82rem', color: '#9ca3af', display: 'block', marginBottom: 6, fontWeight: 600 }}>Category</label>
                            <select className="input-field" name="category" value={form.category} onChange={handleChange}>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.82rem', color: '#9ca3af', display: 'block', marginBottom: 6, fontWeight: 600 }}>Unit</label>
                            <select className="input-field" name="unit" value={form.unit} onChange={handleChange}>
                                {['kg', 'g', 'ton', 'litre', 'piece', 'dozen', 'quintal'].map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.82rem', color: '#9ca3af', display: 'block', marginBottom: 6, fontWeight: 600 }}>Listing Type</label>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {['direct', 'bidding'].map(t => (
                                <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                                    style={{
                                        flex: 1, padding: '10px', borderRadius: 10, border: '1px solid',
                                        cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.9rem',
                                        borderColor: form.type === t ? '#22c55e' : 'rgba(255,255,255,0.1)',
                                        background: form.type === t ? 'rgba(34,197,94,0.12)' : 'transparent',
                                        color: form.type === t ? '#4ade80' : '#6b7280',
                                    }}>
                                    {t === 'direct' ? '🛒 Direct' : '🔨 Bidding'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {form.type === 'bidding' && (
                        <div>
                            <label style={{ fontSize: '0.82rem', color: '#9ca3af', display: 'block', marginBottom: 6, fontWeight: 600 }}>Bidding End Time</label>
                            <input className="input-field" type="datetime-local" name="biddingEndTime"
                                value={form.biddingEndTime} onChange={handleChange} required />
                        </div>
                    )}

                    <div>
                        <label style={{ fontSize: '0.82rem', color: '#9ca3af', display: 'block', marginBottom: 6, fontWeight: 600 }}>Product Image</label>
                        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])}
                            style={{ color: '#9ca3af', fontSize: '0.85rem' }} />
                    </div>

                    <motion.button type="submit" className="btn-primary"
                        style={{ width: '100%', padding: '14px', marginTop: 8, fontSize: '1rem' }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}>
                        {loading ? 'Listing...' : '✅ List Product'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}

export default function FarmerDashboard() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [bidsMap, setBidsMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [pRes, oRes] = await Promise.all([
                api.get('/products/my'),
                api.get('/orders/farmer'),
            ]);
            setProducts(pRes.data);
            setOrders(oRes.data);

            // Fetch highest bids for bidding products
            const bidding = pRes.data.filter(p => p.type === 'bidding');
            const bidsData = {};
            await Promise.all(bidding.map(async p => {
                const { data } = await api.get(`/bids/${p._id}/highest`);
                bidsData[p._id] = data;
            }));
            setBidsMap(bidsData);
        } catch (e) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const deleteProduct = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success('Product removed');
            fetchAll();
        } catch (e) {
            toast.error('Failed to delete');
        }
    };

    const totalEarnings = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.amount, 0);

    const updateOrderStatus = async (orderId, status) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status });
            toast.success(`Order ${status}`);
            fetchAll();
        } catch (e) {
            toast.error('Failed to update order');
        }
    };

    const STATUS_FLOW = ['placed', 'confirmed', 'shipped', 'delivered'];
    const STATUS_LABELS = { placed: 'Order Placed', confirmed: 'Confirmed', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' };
    const STATUS_COLORS = { placed: 'badge-teal', confirmed: 'badge-teal', shipped: 'badge-orange', delivered: 'badge-green', cancelled: 'badge-red' };
    const getNextStatus = (current) => {
        const idx = STATUS_FLOW.indexOf(current);
        return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
    };

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <h1 className="heading-glow" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '2rem' }}>
                                Farmer <span className="gradient-text">Dashboard</span>
                            </h1>
                            <p style={{ color: '#6b7280', marginTop: 4 }}>Welcome back, <span style={{ color: '#4ade80', fontWeight: 600 }}>{user?.name}</span></p>
                        </div>
                        <motion.button className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                            onClick={() => setShowModal(true)}>
                            + List Product
                        </motion.button>
                    </div>

                    {/* Stats */}
                    <div className="grid-4" style={{ marginBottom: 40 }}>
                        {[
                            { label: 'Listed Products', value: products.length, color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
                            { label: 'Total Orders', value: orders.length, color: '#2dd4bf', bg: 'rgba(45,212,191,0.1)' },
                            { label: 'Total Earnings', value: `₹${totalEarnings.toLocaleString('en-IN')}`, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
                            { label: 'Active Bids', value: Object.values(bidsMap).filter(b => b?.amount).length, color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
                        ].map(({ label, value, color, bg }) => (
                            <div key={label} className="glass-card" style={{ padding: '24px 20px', textAlign: 'center' }}>
                                <div style={{ width: 48, height: 48, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                                </div>
                                <div style={{ fontSize: '1.6rem', fontWeight: 800, color }}>{value}</div>
                                <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: 4 }}>{label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Products */}
                    <div className="gradient-line-animated" style={{ marginBottom: 24 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h2 style={{ fontWeight: 800, fontSize: '1.2rem' }}>My Listings</h2>
                        <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>{products.length} product{products.length !== 1 ? 's' : ''}</span>
                    </div>
                    {loading ? (
                        <div className="grid-3">{Array(3).fill(0).map((_, i) => (
                            <div key={i} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div className="shimmer" style={{ height: 140 }} />
                                <div style={{ padding: 16 }}>
                                    <div className="shimmer" style={{ height: 18, marginBottom: 10, width: '60%' }} />
                                    <div className="shimmer" style={{ height: 14, width: '80%' }} />
                                </div>
                            </div>
                        ))}</div>
                    ) : products.length === 0 ? (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: 16, opacity: 0.5 }}>📦</div>
                            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>No products listed yet</p>
                            <p style={{ color: '#4b5563', fontSize: '0.82rem', marginTop: 6 }}>Click "+ List Product" to add your first product</p>
                        </div>
                    ) : (
                        <div className="grid-3" style={{ marginBottom: 48 }}>
                            {products.map(p => (
                                <motion.div key={p._id} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}
                                    whileHover={{ scale: 1.01 }}>
                                    {/* Image */}
                                    <div style={{ height: 140, position: 'relative', background: 'rgba(255,255,255,0.02)' }}>
                                        {p.image ? (
                                            <img src={`${getServerUrl()}${p.image}`} alt={p.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', opacity: 0.3 }}>🌿</div>
                                        )}
                                        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4 }}>
                                            <span className={`badge ${p.type === 'bidding' ? 'badge-orange' : 'badge-green'}`} style={{ fontSize: '0.7rem' }}>
                                                {p.type === 'bidding' ? 'Bidding' : 'Direct'}
                                            </span>
                                        </div>
                                        <div style={{ position: 'absolute', top: 8, right: 8 }}>
                                            {p.isApproved ? (
                                                <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>Live</span>
                                            ) : p.isRejected ? (
                                                <span className="badge badge-red" style={{ fontSize: '0.68rem' }}>Rejected</span>
                                            ) : (
                                                <span className="badge badge-orange" style={{ fontSize: '0.68rem' }}>Under Review</span>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ padding: '16px 18px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                            <h3 style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.3 }}>{p.name}</h3>
                                            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#4ade80', whiteSpace: 'nowrap' }}>
                                                ₹{p.price.toLocaleString('en-IN')}
                                            </div>
                                        </div>

                                        {p.isRejected && p.rejectionReason && (
                                            <div style={{ fontSize: '0.75rem', color: '#f87171', background: 'rgba(239,68,68,0.08)', padding: '6px 10px', borderRadius: 8, marginBottom: 8 }}>
                                                {p.rejectionReason}
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: '#6b7280', marginBottom: 12 }}>
                                            <span>{p.location}</span>
                                            <span style={{ color: p.quantity > 0 ? '#4ade80' : '#f87171', fontWeight: 600 }}>
                                                {p.quantity > 0 ? `${p.quantity} ${p.unit} in stock` : 'Out of stock'}
                                            </span>
                                        </div>

                                        {p.type === 'bidding' && bidsMap[p._id]?.amount && (
                                            <div style={{ fontSize: '0.82rem', color: '#2dd4bf', marginBottom: 10, padding: '6px 10px', background: 'rgba(45,212,191,0.08)', borderRadius: 8 }}>
                                                Highest Bid: ₹{bidsMap[p._id].amount.toLocaleString('en-IN')}
                                            </div>
                                        )}

                                        <button className="btn-danger" style={{ width: '100%', padding: '8px', fontSize: '0.82rem' }} onClick={() => deleteProduct(p._id)}>
                                            Remove Listing
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Orders */}
                    <div className="gradient-line-animated" style={{ marginBottom: 24 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h2 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Incoming Orders</h2>
                        <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
                    </div>
                    {orders.length === 0 ? (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 20px' }}>
                            <p style={{ color: '#6b7280' }}>No orders received yet</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {orders.map(o => {
                                const next = getNextStatus(o.status);
                                return (
                                    <motion.div key={o._id} className="glass-card"
                                        style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}
                                        whileHover={{ scale: 1.005 }}>
                                        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flex: 1, minWidth: 200 }}>
                                            {o.productId?.image ? (
                                                <img src={`${getServerUrl()}${o.productId.image}`} alt=""
                                                    style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: 48, height: 48, borderRadius: 10, background: 'rgba(74,222,128,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🌿</div>
                                            )}
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{o.productId?.name || 'Product'}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 2 }}>
                                                    {o.buyerId?.name} · Qty: {o.quantity} · {o.type}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: 2 }}>
                                                    {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 800, color: '#4ade80', fontSize: '1.1rem' }}>₹{o.amount.toLocaleString('en-IN')}</div>
                                                <span className={`badge ${STATUS_COLORS[o.status] || 'badge-orange'}`}>
                                                    {STATUS_LABELS[o.status] || o.status}
                                                </span>
                                            </div>
                                            {next && o.status !== 'cancelled' && (
                                                <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                                                    onClick={() => updateOrderStatus(o._id, next)}>
                                                    Mark {STATUS_LABELS[next]}
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>

            <AnimatePresence>
                {showModal && <AddProductModal onClose={() => setShowModal(false)} onSuccess={fetchAll} />}
            </AnimatePresence>
        </div>
    );
}
