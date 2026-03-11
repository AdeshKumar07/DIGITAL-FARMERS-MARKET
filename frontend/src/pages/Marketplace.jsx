import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api, { getServerUrl } from '../api/axios';

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Spices', 'Others'];
const CATEGORY_EMOJI = { Vegetables: '🥦', Fruits: '🍎', Grains: '🌾', Dairy: '🥛', Spices: '🌶️', Others: '🌿', All: '🏪' };

function SkeletonCard() {
    return (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="shimmer" style={{ height: 200, width: '100%', borderRadius: '16px 16px 0 0' }} />
            <div style={{ padding: 20 }}>
                <div className="shimmer" style={{ height: 20, width: '70%', marginBottom: 10 }} />
                <div className="shimmer" style={{ height: 16, width: '50%', marginBottom: 16 }} />
                <div className="shimmer" style={{ height: 36, width: '100%' }} />
            </div>
        </div>
    );
}

function ProductCard({ product }) {
    const isBidding = product.type === 'bidding';
    const isExpired = product.biddingEndTime && new Date(product.biddingEndTime) < new Date();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="glass-card"
            style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        >
            {/* Image */}
            <div className="img-hover-zoom" style={{ position: 'relative', height: 200 }}>
                {product.image ? (
                    <img
                        src={`${getServerUrl()}${product.image}`}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{
                        width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'linear-gradient(135deg,rgba(34,197,94,0.08),rgba(45,212,191,0.04))', fontSize: '3.5rem'
                    }}>
                        {CATEGORY_EMOJI[product.category] || '🌿'}
                    </div>
                )}
                {/* Gradient overlay at bottom of image */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(transparent, rgba(7,13,10,0.8))' }} />
                <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                    <span className={`badge ${isBidding ? 'badge-orange' : 'badge-green'}`}>
                        {isBidding ? 'Bidding' : 'Buy Now'}
                    </span>
                </div>
                {isBidding && isExpired && (
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                        <span className="badge badge-red">Ended</span>
                    </div>
                )}
                {/* Price floating tag on image */}
                <div style={{ position: 'absolute', bottom: 12, right: 14 }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#4ade80', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                        ₹{product.price.toLocaleString('en-IN')}<span style={{ fontWeight: 500, fontSize: '0.75rem', color: '#9ca3af' }}>/{product.unit || 'kg'}</span>
                    </span>
                </div>
            </div>

            {/* Info */}
            <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.3 }}>{product.name}</h3>
                    <span className="tag" style={{ fontSize: '0.72rem', padding: '3px 10px' }}>{product.category}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: '#4ade80', fontSize: '0.65rem' }}>●</span> {product.location} · {product.quantity} {product.unit || 'kg'}
                </div>
                <div style={{ marginTop: 'auto', paddingTop: 14 }}>
                    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                        <motion.button
                            className={isBidding ? 'btn-secondary' : 'btn-primary'}
                            style={{ width: '100%', padding: '10px 18px', fontSize: '0.88rem', borderRadius: 12 }}
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        >
                            {isBidding ? 'Place Bid →' : 'Buy Now →'}
                        </motion.button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

export default function Marketplace() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || 'All',
        type: 'all',
        minPrice: '',
        maxPrice: '',
        location: '',
        search: '',
    });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.category !== 'All') params.category = filters.category;
            if (filters.type !== 'all') params.type = filters.type;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            if (filters.location) params.location = filters.location;
            if (filters.search) params.search = filters.search;
            const { data } = await api.get('/products', { params });
            setProducts(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, [filters]);

    const setFilter = (key, value) => setFilters(f => ({ ...f, [key]: value }));

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
                        <div>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                fontSize: '0.75rem', fontWeight: 700, color: '#4ade80',
                                letterSpacing: 1, marginBottom: 8,
                            }}>
                                <div className="pulse-glow" style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
                                LIVE MARKETPLACE
                            </span>
                            <h1 className="heading-glow" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '2.2rem' }}>
                                Fresh <span className="gradient-text">Marketplace</span>
                            </h1>
                        </div>
                        {!loading && <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{products.length} product{products.length !== 1 ? 's' : ''} available</span>}
                    </div>
                    <p style={{ color: '#6b7280', marginBottom: 32, fontSize: '0.95rem' }}>Fresh produce directly from verified farmers</p>
                </motion.div>

                {/* Categories Filter */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
                    {CATEGORIES.map(cat => (
                        <motion.button key={cat} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                            onClick={() => setFilter('category', cat)}
                            style={{
                                padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
                                fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s',
                                background: filters.category === cat ? 'linear-gradient(135deg,#22c55e,#2dd4bf)' : 'rgba(255,255,255,0.05)',
                                color: filters.category === cat ? '#000' : '#9ca3af',
                                boxShadow: filters.category === cat ? '0 4px 20px rgba(34,197,94,0.3)' : 'none',
                            }}>
                            {CATEGORY_EMOJI[cat]} {cat}
                        </motion.button>
                    ))}
                </div>

                {/* Advanced Filters */}
                <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 32, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                    <input className="input-field" placeholder="🔍 Search products..." style={{ flex: 2, minWidth: 160 }}
                        value={filters.search} onChange={e => setFilter('search', e.target.value)} />
                    <input className="input-field" placeholder="📍 Location" style={{ flex: 1, minWidth: 120 }}
                        value={filters.location} onChange={e => setFilter('location', e.target.value)} />
                    <input className="input-field" type="number" placeholder="Min ₹" style={{ flex: 1, minWidth: 90, maxWidth: 110 }}
                        value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)} />
                    <input className="input-field" type="number" placeholder="Max ₹" style={{ flex: 1, minWidth: 90, maxWidth: 110 }}
                        value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)} />
                    <select className="input-field" style={{ flex: 1, minWidth: 130 }}
                        value={filters.type} onChange={e => setFilter('type', e.target.value)}>
                        <option value="all">All Types</option>
                        <option value="direct">🛒 Buy Now</option>
                        <option value="bidding">🔨 Bidding</option>
                    </select>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid-3">
                        {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : products.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="glass-card" style={{ textAlign: 'center', padding: '80px 20px' }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: 16, opacity: 0.4 }}>🌾</div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>No products found</h3>
                        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Try adjusting your filters or search terms</p>
                    </motion.div>
                ) : (
                    <motion.div className="grid-3" layout>
                        <AnimatePresence mode="popLayout">
                            {products.map(p => <ProductCard key={p._id} product={p} />)}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
