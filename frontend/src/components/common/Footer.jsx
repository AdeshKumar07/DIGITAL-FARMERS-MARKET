import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
    return (
        <footer style={{
            position: 'relative', zIndex: 1,
            padding: '0 20px 32px',
            background: 'rgba(7,13,10,0.95)',
        }}>
            <div className="gradient-line-animated" style={{ marginBottom: 48 }} />
            <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <Logo size={28} />
                        <span style={{
                            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
                            background: 'linear-gradient(135deg,#4ade80,#2dd4bf)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.1rem'
                        }}>FarmConnect</span>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 260 }}>
                        Connecting farmers directly with consumers. Fresh produce, fair prices, no middlemen.
                    </p>
                </div>

                <div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 16, color: '#9ca3af' }}>Platform</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <Link to="/marketplace" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.85rem' }}>Marketplace</Link>
                        <Link to="/register" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.85rem' }}>Become a Farmer</Link>
                        <Link to="/login" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.85rem' }}>Sign In</Link>
                    </div>
                </div>

                <div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 16, color: '#9ca3af' }}>Categories</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Spices'].map(cat => (
                            <Link key={cat} to={`/marketplace?category=${cat}`} style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.85rem' }}>{cat}</Link>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 16, color: '#9ca3af' }}>Support</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>help@farmconnect.in</span>
                        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>+91 98765 43210</span>
                    </div>
                </div>
            </div>

            <div style={{
                maxWidth: 1100, margin: '32px auto 0', paddingTop: 24,
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
            }}>
                <p style={{ color: '#4b5563', fontSize: '0.8rem' }}>
                    &copy; {new Date().getFullYear()} FarmConnect. All rights reserved.
                </p>
                <p style={{ color: '#4b5563', fontSize: '0.8rem' }}>
                    Made in India
                </p>
            </div>
        </footer>
    );
}
