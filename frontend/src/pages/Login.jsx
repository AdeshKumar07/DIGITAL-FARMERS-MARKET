import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

export default function Login() {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(form.email, form.password);
            toast.success(`Welcome back, ${user.name}! 🌾`);
            if (user.role === 'farmer') navigate('/farmer');
            else if (user.role === 'admin') navigate('/admin');
            else navigate('/consumer');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            {/* Decorative blobs */}
            <div className="deco-blob" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(34,197,94,0.12), transparent 70%)', top: -100, left: -200, animation: 'float-slow 12s ease-in-out infinite' }} />
            <div className="deco-blob" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(45,212,191,0.08), transparent 70%)', bottom: -100, right: -150, animation: 'float 10s ease-in-out infinite' }} />

            <motion.div
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
                className="glass-card" style={{ width: '100%', maxWidth: 440, padding: '52px 40px', position: 'relative', overflow: 'hidden' }}
            >
                {/* Top accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #22c55e, #2dd4bf, transparent)' }} />

                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
                        <Logo size={56} />
                    </motion.div>
                    <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.8rem', marginTop: 16 }}>
                        Welcome <span className="gradient-text">Back</span>
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: 8, fontSize: '0.9rem' }}>Sign in to your FarmConnect account</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: 8, fontWeight: 600 }}>Email</label>
                        <input className="input-field" type="email" name="email" placeholder="you@example.com"
                            value={form.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: 8, fontWeight: 600 }}>Password</label>
                        <input className="input-field" type="password" name="password" placeholder="••••••••"
                            value={form.password} onChange={handleChange} required />
                    </div>

                    <motion.button
                        type="submit" className="btn-primary"
                        style={{ marginTop: 8, width: '100%', padding: '14px', fontSize: '1rem', borderRadius: 14 }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In →'}
                    </motion.button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 28, color: '#6b7280', fontSize: '0.9rem' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#4ade80', fontWeight: 600, textDecoration: 'none' }}>
                        Register
                    </Link>
                </p>

                <div className="gradient-line-animated" style={{ margin: '24px 0' }} />
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#4b5563' }}>
                    Admin? Use your admin credentials above.
                </p>
            </motion.div>
        </div>
    );
}
