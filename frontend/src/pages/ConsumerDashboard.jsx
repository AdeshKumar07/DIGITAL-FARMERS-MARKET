import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api, { getServerUrl } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const STATUS_COLOR = {
    placed: 'badge-teal', confirmed: 'badge-teal', shipped: 'badge-orange',
    delivered: 'badge-green', cancelled: 'badge-red'
};
const STATUS_LABEL = {
    placed: 'Order Placed', confirmed: 'Confirmed', shipped: 'Shipped',
    delivered: 'Delivered', cancelled: 'Cancelled'
};
const STATUS_STEPS = ['placed', 'confirmed', 'shipped', 'delivered'];

function OrderProgress({ status }) {
    const idx = STATUS_STEPS.indexOf(status);
    if (status === 'cancelled') {
        return <span className="badge badge-red" style={{ fontSize: '0.78rem' }}>Cancelled</span>;
    }
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
            {STATUS_STEPS.map((step, i) => {
                const active = i <= idx;
                return (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{
                            width: 18, height: 18, borderRadius: '50%',
                            background: active ? '#22c55e' : 'rgba(255,255,255,0.08)',
                            border: `2px solid ${active ? '#22c55e' : 'rgba(255,255,255,0.15)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.55rem', color: active ? '#000' : '#4b5563', fontWeight: 700,
                        }}>
                            {active ? '✓' : ''}
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                            <div style={{
                                width: 20, height: 2,
                                background: i < idx ? '#22c55e' : 'rgba(255,255,255,0.1)',
                            }} />
                        )}
                    </div>
                );
            })}
            <span style={{ fontSize: '0.72rem', color: '#6b7280', marginLeft: 6 }}>
                {STATUS_LABEL[status]}
            </span>
        </div>
    );
}

export default function ConsumerDashboard() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [myBids, setMyBids] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [oRes, bRes] = await Promise.all([api.get('/orders/my'), api.get('/bids/my')]);
            setOrders(oRes.data);
            setMyBids(bRes.data);
        } catch {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const totalSpent = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.amount, 0);
    const activeBids = myBids.filter(b => b.productId?.isBiddingOpen).length;

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="heading-glow" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '2rem', marginBottom: 6 }}>
                        My <span className="gradient-text">Dashboard</span>
                    </h1>
                    <p style={{ color: '#6b7280', marginBottom: 32 }}>Welcome back, <span style={{ color: '#4ade80', fontWeight: 600 }}>{user?.name}</span></p>

                    {/* Stats */}
                    <div className="grid-4" style={{ marginBottom: 40 }}>
                        {[
                            { label: 'Total Orders', value: orders.length, color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
                            { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
                            { label: 'Active Bids', value: activeBids, color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
                            { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: '#2dd4bf', bg: 'rgba(45,212,191,0.1)' },
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

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
                        <Link to="/marketplace">
                            <button className="btn-primary" style={{ padding: '10px 24px' }}>Browse Marketplace →</button>
                        </Link>
                    </div>

                    {/* My Orders */}
                    <div className="gradient-line-animated" style={{ marginBottom: 24 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h2 style={{ fontWeight: 800, fontSize: '1.2rem' }}>My Orders</h2>
                        <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
                    </div>
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {Array(3).fill(0).map((_, i) => (
                                <div key={i} className="glass-card" style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', gap: 16 }}>
                                        <div className="shimmer" style={{ width: 56, height: 56, borderRadius: 10 }} />
                                        <div style={{ flex: 1 }}>
                                            <div className="shimmer" style={{ height: 18, width: '40%', marginBottom: 8 }} />
                                            <div className="shimmer" style={{ height: 14, width: '60%' }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 20px' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: 12, opacity: 0.5 }}>📦</div>
                            <p style={{ color: '#6b7280' }}>No orders yet</p>
                            <p style={{ color: '#4b5563', fontSize: '0.82rem', marginTop: 6 }}>
                                <Link to="/marketplace" style={{ color: '#4ade80', fontWeight: 600, textDecoration: 'none' }}>Start shopping →</Link>
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
                            {orders.map(o => (
                                <motion.div key={o._id} className="glass-card"
                                    style={{ padding: '20px 24px' }}
                                    whileHover={{ scale: 1.005 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                            {o.productId?.image ? (
                                                <img src={`${getServerUrl()}${o.productId.image}`} alt=""
                                                    style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{
                                                    width: 56, height: 56, borderRadius: 10, background: 'rgba(74,222,128,0.08)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem'
                                                }}>🌿</div>
                                            )}
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{o.productId?.name || 'Product unavailable'}</div>
                                                <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: 2 }}>
                                                    {o.type === 'auction' ? 'Auction' : 'Direct'} · Qty: {o.quantity} · From: {o.farmerId?.name || 'Farmer'}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: 2 }}>
                                                    {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 800, color: '#4ade80', fontSize: '1.15rem' }}>₹{o.amount.toLocaleString('en-IN')}</div>
                                        </div>
                                    </div>
                                    <OrderProgress status={o.status} />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* My Bids */}
                    <div className="gradient-line-animated" style={{ marginBottom: 24 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h2 style={{ fontWeight: 800, fontSize: '1.2rem' }}>My Bids</h2>
                        <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>{myBids.length} bid{myBids.length !== 1 ? 's' : ''}</span>
                    </div>
                    {myBids.length === 0 ? (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 20px' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: 12, opacity: 0.5 }}>🔨</div>
                            <p style={{ color: '#6b7280' }}>No bids yet</p>
                            <p style={{ color: '#4b5563', fontSize: '0.82rem', marginTop: 6 }}>
                                <Link to="/marketplace?type=bidding" style={{ color: '#4ade80', fontWeight: 600, textDecoration: 'none' }}>Browse auctions →</Link>
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {myBids.map(b => {
                                const ended = b.productId?.biddingEndTime && new Date(b.productId.biddingEndTime) < new Date();
                                return (
                                    <motion.div key={b._id} className="glass-card"
                                        style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}
                                        whileHover={{ scale: 1.005 }}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{b.productId?.name || 'Product'}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 2 }}>
                                                {ended
                                                    ? `Ended ${new Date(b.productId?.biddingEndTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                                                    : `Ends: ${new Date(b.productId?.biddingEndTime).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`
                                                }
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 800, color: '#fb923c', fontSize: '1.05rem' }}>₹{b.amount.toLocaleString('en-IN')}</div>
                                            </div>
                                            <span className={`badge ${b.productId?.isBiddingOpen && !ended ? 'badge-teal' : 'badge-red'}`}>
                                                {b.productId?.isBiddingOpen && !ended ? 'Active' : 'Ended'}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
