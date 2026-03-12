import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'consumer', location: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 8) {
            return toast.error('Password must be at least 8 characters');
        }
        if (!form.name.trim()) {
            return toast.error('Please enter your full name');
        }
        setLoading(true);
        try {
            const payload = { ...form, email: form.email.trim().toLowerCase(), name: form.name.trim(), location: form.location.trim() };
            const data = await register(payload);
            toast.success(data.message || 'Registered! Awaiting admin approval.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div className="deco-blob" style={{ width: 450, height: 450, background: 'radial-gradient(circle, rgba(34,197,94,0.1), transparent 70%)', top: -80, right: -150, animation: 'float 10s ease-in-out infinite' }} />
            <div className="deco-blob" style={{ width: 350, height: 350, background: 'radial-gradient(circle, rgba(45,212,191,0.08), transparent 70%)', bottom: -60, left: -120, animation: 'float-slow 12s ease-in-out infinite' }} />

            <motion.div
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
                className="glass-card" style={{ width: '100%', maxWidth: 480, padding: '52px 40px', position: 'relative', overflow: 'hidden' }}
            >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #22c55e, #2dd4bf, transparent)' }} />

                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
                        <Logo size={56} />
                    </motion.div>
                    <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '1.8rem', marginTop: 16 }}>
                        Join <span className="gradient-text">FarmConnect</span>
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: 8, fontSize: '0.9rem' }}>Create your account to get started</p>
                </div>

                <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: 8, fontWeight: 600 }}>Full Name</label>
                        <input className="input-field" name="name" placeholder="Ramesh Kumar" value={form.name} onChange={handleChange} required autoComplete="off" />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: 8, fontWeight: 600 }}>Email</label>
                        <input className="input-field" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required autoComplete="off" />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: 8, fontWeight: 600 }}>Password</label>
                        <input className="input-field" type="password" name="password" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} required minLength={8} autoComplete="new-password" />
                    </div>

                    {/* Role toggle */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: 10, fontWeight: 600 }}>I want to</label>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {[{ value: 'consumer', label: 'Buy Produce', icon: '🛒' }, { value: 'farmer', label: 'Sell Produce', icon: '🌾' }].map(({ value, label, icon }) => (
                                <motion.button key={value} type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    onClick={() => setForm(f => ({ ...f, role: value }))}
                                    style={{
                                        flex: 1, padding: '14px 12px', borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit',
                                        fontWeight: 700, fontSize: '0.88rem', textAlign: 'center', transition: 'all 0.25s',
                                        border: `1.5px solid ${form.role === value ? '#22c55e' : 'rgba(255,255,255,0.08)'}`,
                                        background: form.role === value ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.02)',
                                        color: form.role === value ? '#4ade80' : '#6b7280',
                                        boxShadow: form.role === value ? '0 0 20px rgba(34,197,94,0.1)' : 'none',
                                    }}>
                                    <span style={{ fontSize: '1.3rem', display: 'block', marginBottom: 6 }}>{icon}</span>
                                    {label}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: 8, fontWeight: 600 }}>Location</label>
                        <input className="input-field" name="location" placeholder="e.g. Pune, Maharashtra" value={form.location} onChange={handleChange} />
                    </div>

                    <motion.button
                        type="submit" className="btn-primary"
                        style={{ marginTop: 8, width: '100%', padding: '14px', fontSize: '1rem', borderRadius: 14 }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account →'}
                    </motion.button>
                </form>

                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    style={{
                        marginTop: 20, padding: '14px 16px', borderRadius: 14,
                        background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.12)',
                        fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.6
                    }}>
                    {form.role === 'farmer'
                        ? '🌾 Your farmer account will be reviewed by an admin before you can log in.'
                        : '🛒 Consumer accounts are activated instantly after registration.'
                    }
                </motion.div>

                <p style={{ textAlign: 'center', marginTop: 24, color: '#6b7280', fontSize: '0.9rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#4ade80', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
                </p>
            </motion.div>
        </div>
    );
}
