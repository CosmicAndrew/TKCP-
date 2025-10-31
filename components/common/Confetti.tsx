import React, { useMemo } from 'react';

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute confetti-piece" style={{...style, width: '8px' }}></div>
);

interface ConfettiProps {
    intensity?: 'light' | 'medium' | 'heavy';
    container?: 'viewport' | 'parent';
}

const Confetti: React.FC<ConfettiProps> = ({ intensity = 'medium', container = 'viewport' }) => {
    const pieceCount = {
        light: 70,
        medium: 150,
        heavy: 300
    }[intensity];

    const positionClass = container === 'viewport' ? 'fixed' : 'absolute';
    const animationName = container === 'viewport' ? 'confetti-fall' : 'confetti-fall-contained';

    const pieces = useMemo(() => {
        return Array.from({ length: pieceCount }).map((_, i) => {
            const style: React.CSSProperties = {
                left: `${Math.random() * 100}%`,
                animation: `${animationName} ${2 + Math.random() * 3}s ease-out ${Math.random() * 2}s forwards`,
                backgroundColor: ['#2B4C7E', '#D4AF37', '#1B365D', '#FF6B35'][Math.floor(Math.random() * 4)],
                height: `${6 + Math.random() * 10}px`,
                transform: `rotate(${Math.random() * 360}deg)`,
            };
            return <ConfettiPiece key={i} style={style} />;
        });
    }, [pieceCount, animationName]);
    
    return <div className={`${positionClass} top-0 left-0 w-full h-full overflow-hidden z-20 pointer-events-none`} aria-hidden="true">{pieces}</div>;
};

export default Confetti;