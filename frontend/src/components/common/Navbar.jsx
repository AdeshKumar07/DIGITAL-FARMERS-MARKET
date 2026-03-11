import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close menu on route change
    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    const handleLogout = () => { logout(); navigate('/'); };

    const dashboardPath =
        user?.role === 'farmer' ? '/farmer' :
            user?.role === 'admin' ? '/admin' : '/consumer';

    const isActive = (path) => location.pathname === path;

    const navLinkStyle = (path) => ({
        textDecoration: 'none',
        color: isActive(path) ? '#4ade80' : '#9ca3af',
        fontWeight: 600, fontSize: '0.88rem', padding: '8px 16px',
        borderRadius: 10,
        background: isActive(path) ? 'rgba(74,222,128,0.08)' : 'transparent',
        transition: 'all 0.25s',
    });

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                    position: 'fixed', top: 16, left: 20, right: 20,
                    zIndex: 100,
                    background: scrolled ? 'rgba(7,13,10,0.88)' : 'rgba(7,13,10,0.65)',
                    backdropFilter: 'blur(24px)',
                    border: `1px solid ${scrolled ? 'rgba(74,222,128,0.2)' : 'rgba(74,222,128,0.1)'}`,
                    borderRadius: 18,
                    padding: '0 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    height: 60,
                    transition: 'all 0.35s ease',
                    maxWidth: 1200, margin: '0 auto',
                    boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.4)' : 'none',
                }}
            >
                <div style={{ width: '100%', maxWidth: 1160, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    {/* Logo */}
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Logo size={30} />
                        <span style={{
                            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
                            background: 'linear-gradient(135deg,#4ade80,#2dd4bf)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.1rem'
                        }}>FarmConnect</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Link to="/marketplace" style={navLinkStyle('/marketplace')}>Marketplace</Link>

                        {user ? (
                            <>
                                <Link to={dashboardPath} style={navLinkStyle(dashboardPath)}>Dashboard</Link>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 8 }}>
                                    <div className="avatar-initial">{user.name?.charAt(0).toUpperCase()}</div>
                                    <button onClick={handleLogout} style={{
                                        background: 'rgba(239,68,68,0.1)', color: '#f87171',
                                        border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10,
                                        padding: '7px 16px', cursor: 'pointer', fontWeight: 600,
                                        fontSize: '0.85rem', fontFamily: 'inherit', transition: 'all 0.25s',
                                    }}>Logout</button>
                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
                                <Link to="/login">
                                    <button className="btn-secondary" style={{ padding: '7px 20px', fontSize: '0.85rem' }}>Login</button>
                                </Link>
                                <Link to="/register">
                                    <button className="btn-primary" style={{ padding: '7px 20px', fontSize: '0.85rem' }}>Get Started</button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
                        display: 'none', background: 'none', border: 'none', cursor: 'pointer',
                        flexDirection: 'column', gap: 5, padding: 8,
                    }}>
                        <span style={{ display: 'block', width: 22, height: 2, background: '#9ca3af', borderRadius: 2, transition: 'all 0.3s',
                            transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
                        <span style={{ display: 'block', width: 22, height: 2, background: '#9ca3af', borderRadius: 2, transition: 'all 0.3s',
                            opacity: menuOpen ? 0 : 1 }} />
                        <span style={{ display: 'block', width: 22, height: 2, background: '#9ca3af', borderRadius: 2, transition: 'all 0.3s',
                            transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile menu overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        style={{
                            position: 'fixed', top: 84, left: 20, right: 20, zIndex: 99,
                            background: 'rgba(7,13,10,0.95)', backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(74,222,128,0.15)', borderRadius: 16,
                            padding: '20px', display: 'flex', flexDirection: 'column', gap: 10,
                        }}>
                        <Link to="/marketplace" style={navLinkStyle('/marketplace')}>Marketplace</Link>
                        {user ? (
                            <>
                                <Link to={dashboardPath} style={navLinkStyle(dashboardPath)}>Dashboard</Link>
                                <button onClick={handleLogout} style={{
                                    background: 'rgba(239,68,68,0.1)', color: '#f87171',
                                    border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10,
                                    padding: '10px 16px', cursor: 'pointer', fontWeight: 600,
                                    fontSize: '0.88rem', fontFamily: 'inherit', width: '100%', marginTop: 4,
                                }}>Logout</button>
                            </>
                        ) : (
                            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                                <Link to="/login" style={{ flex: 1 }}>
                                    <button className="btn-secondary" style={{ width: '100%', padding: '10px' }}>Login</button>
                                </Link>
                                <Link to="/register" style={{ flex: 1 }}>
                                    <button className="btn-primary" style={{ width: '100%', padding: '10px' }}>Get Started</button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Responsive CSS */}
            <style>{`
                @media (max-width: 768px) {
                    .nav-desktop { display: none !important; }
                    .nav-hamburger { display: flex !important; }
                }
            `}</style>
        </>
    );
}
