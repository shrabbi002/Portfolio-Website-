'use client';
import { useEffect, useRef, useState } from 'react';

export default function Reveal({ children, className = '', delay = 0, duration = 0.8, direction = 'up' }) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        
        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }
        
        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const getDirectionStyles = () => {
        if (isVisible) return 'opacity-100 translate-x-0 translate-y-0';
        switch (direction) {
            case 'up': return 'opacity-0 translate-y-12';
            case 'down': return 'opacity-0 -translate-y-12';
            case 'left': return 'opacity-0 translate-x-12';
            case 'right': return 'opacity-0 -translate-x-12';
            case 'scale': return 'opacity-0 scale-95';
            default: return 'opacity-0 translate-y-12';
        }
    };

    return (
        <div
            ref={ref}
            className={`transition-all cubic-bezier(0.16, 1, 0.3, 1) ${getDirectionStyles()} ${className}`}
            style={{
                transitionDuration: `${duration}s`,
                transitionDelay: `${delay}s`,
            }}
        >
            {children}
        </div>
    );
}
