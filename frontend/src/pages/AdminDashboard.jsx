import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api, { getServerUrl } from '../api/axios';
import { useAuth } from '../context/AuthContext';
export default function AdminDashboard() {
    const { user: currentUser } = useAuth();
    const [stats, setStats] = useState(null);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [pendingProducts, setPendingProducts] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, pendingUsersRes, pendingProductsRes, allUsersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/pending'),
                api.get('/admin/products/pending'),
                api.get('/admin/users'),
            ]);
            setStats(statsRes.data);
            setPendingUsers(pendingUsersRes.data);
            setPendingProducts(pendingProductsRes.data);
            setAllUsers(allUsersRes.data);
        } catch {
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApproveUser = async (id) => {
        try {
            await api.put(`/admin/approve/${id}`);
            toast.success('User approved! ✅');
            fetchData();
        } catch { toast.error('Approval failed'); }
    };

    const handlePromoteAdmin = async (id) => {
        if (!confirm('Promote this farmer to Admin?')) return;
        try {
            await api.put(`/admin/promote/${id}`);
            toast.success('User promoted to Admin! 👑');
            fetchData();
        } catch { toast.error('Promotion failed'); }
    };

    const handleRemoveUser = async (id, name) => {
        if (!confirm(`Delete ${name} permanently?`)) return;
        try {
            await api.delete(`/admin/users/${id}`);
            toast.success('User removed');
            fetchData();
        } catch { toast.error('Deletion failed'); }
    };

    const handleApproveProduct = async (id) => {
        try {
            await api.put(`/admin/products/${id}/approve`);
            toast.success('Product approved! 🛒');
            fetchData();
        } catch { toast.error('Approval failed'); }
    };

    const handleRejectProduct = async (id) => {
        const reason = prompt('Reason for rejection:');
        if (!reason) return;
        try {
            await api.put(`/admin/products/${id}/reject`, { reason });
            toast.success('Product rejected');
            fetchData();
        } catch { toast.error('Rejection failed'); }
    };

    if (loading && !stats) return <div className="page-wrapper"><div className="spinner" /></div>;

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                        <div>
                            <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '2rem' }}>
                                Admin Dashboard
                            </h1>
                            <p style={{ color: '#6b7280' }}>Manage the entire FarmConnect ecosystem</p>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid-4" style={{ marginBottom: 40 }}>
                        {[
                            { label: 'Total Revenue', value: `₹${stats?.totalRevenue.toLocaleString()}`, color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
                            { label: 'Pending Users', value: pendingUsers?.length, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
                            { label: 'Pending Products', value: pendingProducts?.length, color: '#2dd4bf', bg: 'rgba(45,212,191,0.1)' },
                            { label: 'Total Farmers', value: stats?.totalFarmers, color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
                        ].map(s => (
                            <div key={s.label} className="glass-card" style={{ padding: '24px 20px', textAlign: 'center' }}>
                                <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 4 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 32, overflowX: 'auto', paddingBottom: 10 }}>
                        {[
                            { id: 'overview', label: 'Overview' },
                            { id: 'users', label: `Users (${allUsers.length})` },
                            { id: 'products', label: `Moderation (${pendingProducts.length})` },
                        ].map(t => (
                            <button key={t.id} onClick={() => setActiveTab(t.id)}
                                style={{
                                    padding: '10px 24px', whiteSpace: 'nowrap', borderRadius: 12,
                                    border: activeTab === t.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
                                    background: activeTab === t.id ? 'linear-gradient(135deg,#22c55e,#2dd4bf)' : 'rgba(255,255,255,0.03)',
                                    color: activeTab === t.id ? '#000' : '#9ca3af',
                                    fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'inherit',
                                    transition: 'all 0.25s',
                                    boxShadow: activeTab === t.id ? '0 4px 20px rgba(34,197,94,0.3)' : 'none',
                                }}>
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="glass-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #22c55e, #2dd4bf, transparent)' }} />
                                    <h3 style={{ marginBottom: 24, fontWeight: 700, fontSize: '1.1rem' }}>Platform Status</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        {[
                                            { label: 'Verified Consumers', val: stats?.totalConsumers, color: '#4ade80' },
                                            { label: 'Total Products Listed', val: stats?.totalProducts, color: '#2dd4bf' },
                                            { label: 'Successful Orders', val: stats?.deliveredOrders, color: '#fbbf24' },
                                        ].map(({ label, val, color }) => (
                                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.02)' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9ca3af', fontSize: '0.9rem' }}>
                                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
                                                    {label}
                                                </span>
                                                <span style={{ fontWeight: 800, fontSize: '1.1rem', color }}>{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'users' && (
                            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {allUsers.map(u => (
                                        <div key={u._id} className="glass-card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                                <div className="avatar-initial">{u.name?.charAt(0).toUpperCase()}</div>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{u.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{u.email} · <span style={{ color: u.role === 'admin' ? '#fbbf24' : u.role === 'farmer' ? '#4ade80' : '#2dd4bf' }}>{u.role}</span> · {u.location}</div>
                                                    {!u.isApproved && <span className="badge badge-orange" style={{ marginTop: 5 }}>Pending Approval</span>}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 10 }}>
                                                {!u.isApproved && (
                                                    <button className="btn-primary" onClick={() => handleApproveUser(u._id)}>Approve</button>
                                                )}
                                                {u.role === 'farmer' && (
                                                    <button className="btn-secondary" onClick={() => handlePromoteAdmin(u._id)} style={{ padding: '8px 16px' }}>Make Admin</button>
                                                )}
                                                {u._id !== currentUser?._id && (
                                                    <button className="btn-danger" onClick={() => handleRemoveUser(u._id, u.name)}>Remove</button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'products' && (
                            <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {pendingProducts.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '100px 20px', color: '#6b7280' }}>
                                        <div style={{ fontSize: '2.5rem', opacity: 0.4, marginBottom: 12 }}>✅</div>
                                        <p style={{ fontWeight: 600 }}>No products pending moderation</p>
                                    </div>
                                ) : (
                                    <div className="grid-3">
                                        {pendingProducts.map(p => (
                                            <div key={p._id} className="glass-card" style={{ overflow: 'hidden' }}>
                                                <div style={{ height: 160, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {p.image ? (
                                                        <img src={`${getServerUrl()}${p.image}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : 'No Image'}
                                                </div>
                                                <div style={{ padding: '15px' }}>
                                                    <h4 style={{ fontWeight: 700 }}>{p.name}</h4>
                                                    <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>By: {p.farmerId?.name}</p>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ade80', margin: '10px 0' }}>₹{p.price}</div>
                                                    <div style={{ display: 'flex', gap: 10 }}>
                                                        <button className="btn-primary" style={{ flex: 1 }} onClick={() => handleApproveProduct(p._id)}>Approve</button>
                                                        <button className="btn-danger" style={{ flex: 1 }} onClick={() => handleRejectProduct(p._id)}>Reject</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
