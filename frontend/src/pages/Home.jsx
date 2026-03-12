import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

const features = [
    { title: 'Fresh From Farm', desc: 'Products listed directly by verified farmers — no middlemen, pure freshness.', color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
    { title: 'Live Bidding', desc: 'Participate in real-time auctions and get farm produce at the best price.', color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
    { title: 'Fast Delivery', desc: 'Order tracking from farm to doorstep with regular status updates.', color: '#2dd4bf', bg: 'rgba(45,212,191,0.1)' },
    { title: 'Verified Farmers', desc: 'Every farmer goes through admin verification before joining the marketplace.', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
    { title: 'Farmer Dashboard', desc: 'Manage listings, track bids, and view earnings — all in one place.', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
    { title: 'Filter by Location', desc: 'Buy produce grown closest to you for maximum freshness.', color: '#f472b6', bg: 'rgba(244,114,182,0.1)' },
];

const categories = [
    { name: 'Vegetables', image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=200&h=200&fit=crop&q=80', color: '#4ade80', bg: 'rgba(74,222,128,0.08)' },
    { name: 'Fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200&h=200&fit=crop&q=80', color: '#fb923c', bg: 'rgba(251,146,60,0.08)' },
    { name: 'Grains', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop&q=80', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)' },
    { name: 'Dairy', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop&q=80', color: '#e2e8f0', bg: 'rgba(226,232,240,0.06)' },
    { name: 'Spices', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop&q=80', color: '#f87171', bg: 'rgba(248,113,113,0.08)' },
    { name: 'Others', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop&q=80', color: '#2dd4bf', bg: 'rgba(45,212,191,0.08)' },
];

const howItWorks = [
    { step: '1', title: 'Create Account', desc: 'Sign up as a consumer or farmer in under 30 seconds.' },
    { step: '2', title: 'Browse & Bid', desc: 'Explore fresh produce or place live bids on auction items.' },
    { step: '3', title: 'Get Delivered', desc: 'Track your order from farm to doorstep in real-time.' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };
const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } };

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="page-wrapper" style={{ overflow: 'hidden' }}>
            {/* ===== HERO ===== */}
            <section style={{ position: 'relative', padding: '100px 20px 80px', textAlign: 'center', maxWidth: 960, margin: '0 auto' }}>
                {/* Decorative blobs */}
                <div className="deco-blob" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(34,197,94,0.15), transparent 70%)', top: -100, left: -150, animation: 'float 8s ease-in-out infinite' }} />
                <div className="deco-blob" style={{ width: 300, height: 300, background: 'radial-gradient(circle, rgba(45,212,191,0.12), transparent 70%)', bottom: -50, right: -100, animation: 'float-slow 10s ease-in-out infinite' }} />

                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'rgba(74,222,128,0.1)',
                            border: '1px solid rgba(74,222,128,0.2)', borderRadius: 24, padding: '8px 20px',
                            fontSize: '0.82rem', color: '#4ade80', fontWeight: 700, letterSpacing: 1.2, marginBottom: 32
                        }}>
                        <div className="pulse-glow" style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} />
                        INDIA'S FARM-TO-TABLE MARKETPLACE
                    </motion.span>

                    <h1 className="heading-glow" style={{
                        fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 900,
                        fontSize: 'clamp(2.8rem, 7vw, 5.2rem)', lineHeight: 1.05,
                        marginBottom: 28, letterSpacing: -2
                    }}>
                        Farm Fresh,{' '}
                        <span className="gradient-text">Direct To You</span>
                    </h1>
                    <p style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)', color: '#9ca3af', maxWidth: 620, margin: '0 auto 44px', lineHeight: 1.75 }}>
                        Connect directly with local farmers. Buy fresh produce, participate in live auctions,
                        and support Indian agriculture — all in one premium marketplace.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/marketplace">
                            <motion.button className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.05rem', borderRadius: 14 }}
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                                Explore Marketplace →
                            </motion.button>
                        </Link>
                        {!user && (
                            <Link to="/register">
                                <motion.button className="btn-secondary" style={{ padding: '16px 40px', fontSize: '1.05rem', borderRadius: 14 }}
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                                    Join as Farmer
                                </motion.button>
                            </Link>
                        )}
                    </div>
                </motion.div>

                {/* Stats ticker */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
                    style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 72 }}>
                    {[
                        { value: '500+', label: 'Verified Farmers', color: '#4ade80' },
                        { value: '10K+', label: 'Products Listed', color: '#2dd4bf' },
                        { value: '₹2Cr+', label: 'Transactions', color: '#fbbf24' },
                        { value: '50+', label: 'Cities', color: '#fb923c' },
                    ].map(({ value, label, color }, i) => (
                        <motion.div key={label} className="glass-card"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + i * 0.1 }}
                            style={{ padding: '24px 36px', minWidth: 150, textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 900, color, letterSpacing: -1 }}>{value}</div>
                            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 6, fontWeight: 500 }}>{label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Animated divider */}
            <div className="gradient-line-animated" style={{ maxWidth: 600, margin: '0 auto 20px' }} />

            {/* ===== CATEGORIES ===== */}
            <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}
                    transition={{ duration: 0.6 }}>
                    <h2 className="heading-glow" style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>
                        Shop by <span className="gradient-text">Category</span>
                    </h2>
                    <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 40, fontSize: '0.95rem' }}>
                        Browse fresh produce across all categories
                    </p>
                </motion.div>
                <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
                    style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {categories.map(({ name, image, color, bg }) => (
                        <motion.div key={name} variants={item}>
                            <Link to={`/marketplace?category=${name}`} style={{ textDecoration: 'none' }}>
                                <motion.div className="glass-card" whileHover={{ scale: 1.08, y: -6 }}
                                    style={{ padding: '20px 24px', textAlign: 'center', cursor: 'pointer', minWidth: 140 }}>
                                    <div style={{
                                        width: 80, height: 80, borderRadius: 18, overflow: 'hidden',
                                        margin: '0 auto 14px',
                                        border: `2px solid ${color}33`,
                                        boxShadow: `0 4px 20px ${color}15`,
                                    }}>
                                        <img src={image} alt={name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color }}>{name}</div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="dot-pattern" style={{ padding: '80px 20px', position: 'relative' }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}
                        transition={{ duration: 0.6 }}>
                        <h2 className="heading-glow" style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>
                            How It <span className="gradient-text">Works</span>
                        </h2>
                        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 48, fontSize: '0.95rem' }}>
                            Three simple steps to get farm-fresh produce
                        </p>
                    </motion.div>
                    <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
                        style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {howItWorks.map(({ step, title, desc }) => (
                            <motion.div key={step} variants={item} className="glass-card"
                                style={{ padding: '36px 28px', flex: '1 1 240px', maxWidth: 280, textAlign: 'center', position: 'relative' }}>
                                <div className="step-num" style={{ margin: '0 auto 18px' }}>{step}</div>
                                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 10 }}>{title}</h3>
                                <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section style={{ padding: '80px 20px', maxWidth: 1100, margin: '0 auto' }}>
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}
                    transition={{ duration: 0.6 }}>
                    <h2 className="heading-glow" style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>
                        Why <span className="gradient-text">FarmConnect?</span>
                    </h2>
                    <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 48, fontSize: '0.95rem' }}>
                        Built for farmers and consumers who value quality
                    </p>
                </motion.div>
                <motion.div className="grid-3" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.05 }}>
                    {features.map(({ title, desc, color, bg }, i) => (
                        <motion.div key={title} variants={item} className="glass-card"
                            style={{ padding: '32px 26px', position: 'relative', overflow: 'hidden' }}>
                            {/* Top accent line */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, transparent)` }} />
                            <div className="icon-box" style={{ background: bg, marginBottom: 18, border: `1px solid ${color}22` }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                            </div>
                            <h3 style={{ fontWeight: 700, marginBottom: 10, fontSize: '1.08rem' }}>{title}</h3>
                            <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.65 }}>{desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ===== TESTIMONIAL / TRUST STRIP ===== */}
            <section style={{ padding: '40px 20px', overflow: 'hidden' }}>
                <motion.div
                    initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    style={{
                        maxWidth: 1000, margin: '0 auto',
                        background: 'linear-gradient(135deg, rgba(74,222,128,0.06), rgba(45,212,191,0.04))',
                        border: '1px solid rgba(74,222,128,0.12)', borderRadius: 20, padding: '40px 32px',
                        display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center',
                    }}>
                    {[
                        { icon: '🔒', text: 'Secure Payments' },
                        { icon: '✅', text: 'Admin Verified' },
                        { icon: '📦', text: 'Order Tracking' },
                        { icon: '🌱', text: '100% Organic Options' },
                        { icon: '💬', text: '24/7 Support' },
                    ].map(({ icon, text }) => (
                        <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9ca3af', fontSize: '0.9rem', fontWeight: 600 }}>
                            <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                            {text}
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* ===== CTA ===== */}
            <section style={{ padding: '80px 20px 120px', textAlign: 'center', position: 'relative' }}>
                <div className="deco-blob" style={{ width: 300, height: 300, background: 'radial-gradient(circle, rgba(34,197,94,0.1), transparent 70%)', bottom: 0, left: '50%', transform: 'translateX(-50%)', animation: 'float-reverse 7s ease-in-out infinite' }} />
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    style={{
                        maxWidth: 720, margin: '0 auto', position: 'relative',
                        background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(45,212,191,0.06))',
                        border: '1px solid rgba(74,222,128,0.2)', borderRadius: 28, padding: '72px 48px',
                    }}>
                    <Logo size={48} />
                    <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '2.2rem', fontWeight: 900, marginTop: 20, marginBottom: 16, letterSpacing: -0.5 }}>
                        Ready to start farming <span className="gradient-text">smarter?</span>
                    </h2>
                    <p style={{ color: '#9ca3af', marginBottom: 36, lineHeight: 1.75, maxWidth: 480, margin: '0 auto 36px', fontSize: '1.05rem' }}>
                        Join thousands of farmers already earning more by selling directly on FarmConnect.
                    </p>
                    <Link to="/register">
                        <motion.button className="btn-primary" style={{ padding: '16px 48px', fontSize: '1.1rem', borderRadius: 14 }}
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                            Create Free Account
                        </motion.button>
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
