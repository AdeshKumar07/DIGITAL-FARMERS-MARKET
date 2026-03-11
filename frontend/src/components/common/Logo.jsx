export default function Logo({ size = 32 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#2dd4bf" />
                </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="30" fill="url(#logo-grad)" opacity="0.12" stroke="url(#logo-grad)" strokeWidth="2" />
            <path d="M32 14 C28 14, 20 18, 20 28 C20 36, 26 42, 32 50 C38 42, 44 36, 44 28 C44 18, 36 14, 32 14Z"
                fill="url(#logo-grad)" opacity="0.9" />
            <path d="M32 22 L32 40" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <path d="M32 28 L26 24" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M32 32 L38 28" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}
