import { useEffect, useRef } from 'react';

export default function CursorGlow() {
    const glowRef = useRef(null);

    useEffect(() => {
        const move = (e) => {
            if (glowRef.current) {
                glowRef.current.style.left = e.clientX + 'px';
                glowRef.current.style.top = e.clientY + 'px';
            }
        };
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, []);

    return (
        <div
            ref={glowRef}
            style={{
                position: 'fixed',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, rgba(45,212,191,0.03) 40%, transparent 70%)',
                pointerEvents: 'none',
                transform: 'translate(-50%,-50%)',
                zIndex: 0,
                transition: 'left 0.15s ease-out, top 0.15s ease-out',
            }}
        />
    );
}
