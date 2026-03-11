import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api, { getServerUrl } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [bids, setBids] = useState([]);
    const [highest, setHighest] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [qty, setQty] = useState(1);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [pRes, bRes, hRes] = await Promise.all([
                api.get(`/products/${id}`),
                api.get(`/bids/${id}`),
                api.get(`/bids/${id}/highest`),
            ]);
            setProduct(pRes.data);
            setBids(bRes.data);
            setHighest(hRes.data);
        } catch (e) {
            toast.error('Product not found');
            navigate('/marketplace');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [id]);

    // Live bid polling
    useEffect(() => {
        if (product?.type !== 'bidding') return;
        const interval = setInterval(() => {
            api.get(`/bids/${id}/highest`).then(r => setHighest(r.data));
        }, 5000);
        return () => clearInterval(interval);
    }, [id, product]);

    const placeBid = async () => {
        if (!user) return toast.error('Please login first');
        if (user.role !== 'consumer') return toast.error('Only consumers can bid');
        if (!bidAmount || isNaN(bidAmount)) return toast.error('Enter a valid bid amount');
        setSubmitting(true);
        try {
            await api.post('/bids', { productId: id, amount: Number(bidAmount) });
            toast.success('Bid placed successfully! 🎉');
            setBidAmount('');
            fetchData();
        } catch (e) {
            toast.error(e.response?.data?.message || 'Bid failed');
        } finally {
            setSubmitting(false);
        }
    };

    const buyNow = async () => {
        if (!user) return toast.error('Please login first');
        if (user.role !== 'consumer') return toast.error('Only consumers can buy');
        if (!address) return toast.error('Please enter delivery address');
        if (qty < 1) return toast.error('Quantity must be at least 1');
        setSubmitting(true);
        try {
            const { data } = await api.post('/orders/direct', { productId: id, quantity: qty, shippingAddress: address });
            toast.success(data.message || 'Order placed successfully!');
            navigate('/consumer');
        } catch (e) {
            const msg = e.response?.data?.message || 'Order failed';
            if (e.response?.data?.available === false) {
                toast.error(msg);
            } else {
                toast.error(msg);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div className="spinner" />
        </div>
    );
    if (!product) return null;

    const isBidding = product.type === 'bidding';
    const isExpired = product.biddingEndTime && new Date(product.biddingEndTime) < new Date();
    const minBid = highest?.amount ? Math.ceil(highest.amount * 1.05) : product.price;

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}
                    className="product-detail-grid">
                    <style>{`@media (max-width: 768px) { .product-detail-grid { grid-template-columns: 1fr !important; } }`}</style>

                    {/* Left: Image */}
                    <div>
                        <div className="img-hover-zoom" style={{ borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', position: 'relative' }}>
                            {product.image ? (
                                <img src={`${getServerUrl()}${product.image}`} alt={product.name}
                                    style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block' }} />
                            ) : (
                                <div style={{
                                    width: '100%', height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'linear-gradient(135deg,rgba(34,197,94,0.08),rgba(45,212,191,0.04))', fontSize: '6rem'
                                }}>🌿</div>
                            )}
                            {/* Bottom gradient overlay */}
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent, rgba(7,13,10,0.6))' }} />
                        </div>

                        {/* Bid History */}
                        {isBidding && (
                            <div className="glass-card" style={{ marginTop: 24, padding: '20px 24px' }}>
                                <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Bid History ({bids.length})</h3>
                                {bids.length === 0 ? (
                                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>No bids yet — be the first!</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 240, overflowY: 'auto' }}>
                                        {bids.map((bid, i) => (
                                            <motion.div key={bid._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                style={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    padding: '10px 14px', borderRadius: 10, background: i === 0 ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.03)',
                                                    border: i === 0 ? '1px solid rgba(74,222,128,0.25)' : '1px solid rgba(255,255,255,0.06)'
                                                }}>
                                                <div>
                                                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{bid.bidderName}</span>
                                                    {i === 0 && <span className="badge badge-green" style={{ marginLeft: 8 }}>Highest</span>}
                                                </div>
                                                <span style={{ fontWeight: 800, color: '#4ade80' }}>₹{bid.amount.toLocaleString('en-IN')}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div>
                        <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                            <span className={`badge ${isBidding ? 'badge-orange' : 'badge-green'}`}>
                                {isBidding ? 'Bidding' : 'Direct Buy'}
                            </span>
                            <span className="tag">{product.category}</span>
                            {isExpired && <span className="badge badge-red">Bidding Ended</span>}
                        </div>

                        <h1 className="heading-glow" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '2rem', marginBottom: 12 }}>
                            {product.name}
                        </h1>
                        <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: 24, fontSize: '0.95rem' }}>{product.description}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                            {[
                                { label: '📍 Location', value: product.location },
                                { label: '📦 Quantity', value: `${product.quantity} ${product.unit || 'kg'}` },
                                { label: '🌾 Farmer', value: product.farmerName || product.farmerId?.name },
                                { label: '🗓️ Listed', value: new Date(product.createdAt).toLocaleDateString('en-IN') },
                            ].map(({ label, value }) => (
                                <div key={label} className="glass-card" style={{ padding: '14px 16px' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 4 }}>{label}</div>
                                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Price Panel */}
                        <div className="glass-card" style={{ padding: '28px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #22c55e, #2dd4bf, transparent)' }} />
                            {isBidding ? (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Base Price</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#9ca3af' }}>₹{product.price.toLocaleString('en-IN')}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Current Highest</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ade80' }}>
                                                {highest?.amount ? `₹${highest.amount.toLocaleString('en-IN')}` : 'No bids yet'}
                                            </div>
                                        </div>
                                    </div>
                                    {product.biddingEndTime && (
                                        <div style={{ fontSize: '0.82rem', color: isExpired ? '#f87171' : '#fbbf24', marginBottom: 16 }}>
                                            ⌛ {isExpired ? 'Bidding ended on' : 'Ends on'}: {new Date(product.biddingEndTime).toLocaleString('en-IN')}
                                        </div>
                                    )}
                                    {!isExpired && (
                                        <>
                                            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 10 }}>Minimum bid: ₹{minBid.toLocaleString('en-IN')}</p>
                                            <div style={{ display: 'flex', gap: 10 }}>
                                                <input className="input-field" type="number" placeholder={`₹${minBid}`}
                                                    value={bidAmount} onChange={e => setBidAmount(e.target.value)} style={{ flex: 1 }} />
                                                <motion.button className="btn-primary" style={{ whiteSpace: 'nowrap', padding: '12px 20px' }}
                                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                    onClick={placeBid} disabled={submitting}>
                                                    {submitting ? '...' : 'Place Bid →'}
                                                </motion.button>
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div style={{ marginBottom: 16 }}>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Price per {product.unit || 'kg'}</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#4ade80' }}>₹{product.price.toLocaleString('en-IN')}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block', marginBottom: 6 }}>Quantity ({product.unit || 'kg'})</label>
                                            <input className="input-field" type="number" min="1" max={product.quantity}
                                                value={qty} onChange={e => setQty(Number(e.target.value))} />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: 12 }}>
                                        <label style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block', marginBottom: 6 }}>Delivery Address</label>
                                        <input className="input-field" placeholder="Enter delivery address"
                                            value={address} onChange={e => setAddress(e.target.value)} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                        <span style={{ color: '#9ca3af' }}>Total</span>
                                        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4ade80' }}>₹{(product.price * qty).toLocaleString('en-IN')}</span>
                                    </div>
                                    <motion.button className="btn-primary" style={{ width: '100%', padding: '14px' }}
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={buyNow} disabled={submitting}>
                                        {submitting ? 'Placing Order...' : 'Buy Now →'}
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
