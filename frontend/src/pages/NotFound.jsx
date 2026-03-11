import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/common/Logo';

export default function NotFound() {
    return (
        <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 20, position: 'relative', overflow: 'hidden' }}>
            <div className="deco-blob" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(34,197,94,0.1), transparent 70%)', top: -80, left: -150, animation: 'float 8s ease-in-out infinite' }} />
            <div className="deco-blob" style={{ width: 300, height: 300, background: 'radial-gradient(circle, rgba(45,212,191,0.08), transparent 70%)', bottom: -60, right: -100, animation: 'float-slow 10s ease-in-out infinite' }} />
            <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', maxWidth: 480, position: 'relative' }}
            >
                <Logo size={64} />
                <h1 style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
                    fontSize: '4rem', marginTop: 24, marginBottom: 12
                }}>
                    <span className="gradient-text">404</span>
                </h1>
                <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: 32, lineHeight: 1.7 }}>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/">
                    <button className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
                        Go Home
                    </button>
                </Link>
            </motion.div>
        </div>
    );
}
