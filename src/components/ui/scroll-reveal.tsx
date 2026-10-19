import React from 'react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

export type AnimationType =
	| 'fade-up-3d'
	| 'tilt-in'
	| 'slide-left-3d'
	| 'slide-right-3d'
	| 'zoom-in-3d'
	| 'shutter-reveal'
	| 'laser-scan'
	| 'circuit-pulse'
	| 'domino-flip';

interface ScrollRevealProps {
	children?: React.ReactNode;
	className?: string;
	animation?: AnimationType;
	delay?: number;
}

export function ScrollReveal({
	children,
	className = '',
	animation = 'fade-up-3d',
	delay = 0,
}: ScrollRevealProps) {
	const { ref, isRevealed } = useScrollReveal();

	return (
		<div
			ref={ref}
			className={`scroll-reveal-box ${animation} ${isRevealed ? 'revealed' : ''} ${className}`}
			style={{ transitionDelay: `${delay}ms` }}
		>
			{children}
		</div>
	);
}
