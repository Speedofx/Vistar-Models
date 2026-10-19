import { useEffect, useState, useRef } from 'react';

/**
 * Hook to trigger 3D/2D scroll-reveal animations when an element enters the viewport.
 */
export function useScrollReveal(threshold = 0.06) {
	const ref = useRef<HTMLDivElement>(null);
	const [isRevealed, setIsRevealed] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		// 1. Initial viewport check: ONLY reveal if element is actually visible right now on page load
		if (typeof window !== 'undefined') {
			const rect = node.getBoundingClientRect();
			if (rect.top < window.innerHeight - 20 && rect.bottom > 0) {
				setIsRevealed(true);
				return;
			}
		}

		// 2. IntersectionObserver: fires dynamically as user scrolls down to the element
		if (typeof IntersectionObserver !== 'undefined') {
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						setIsRevealed(true);
						observer.unobserve(entry.target);
					}
				},
				{ threshold, rootMargin: '0px 0px -40px 0px' }
			);

			observer.observe(node);

			// Dynamic scroll backup: ensures fast scrolls always reveal content smoothly
			const handleScroll = () => {
				if (!node) return;
				const r = node.getBoundingClientRect();
				if (r.top <= window.innerHeight - 20) {
					setIsRevealed(true);
					window.removeEventListener('scroll', handleScroll);
				}
			};
			window.addEventListener('scroll', handleScroll, { passive: true });

			return () => {
				observer.disconnect();
				window.removeEventListener('scroll', handleScroll);
			};
		} else {
			setIsRevealed(true);
		}
	}, [threshold]);

	return { ref, isRevealed };
}

/**
 * Hook for live 3D perspective tilt effect on mouse movement.
 */
export function use3DTilt(maxTilt = 8) {
	const ref = useRef<HTMLDivElement>(null);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const el = ref.current;
		if (!el) return;

		const rect = el.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const rotateX = ((y - centerY) / centerY) * -maxTilt;
		const rotateY = ((x - centerX) / centerX) * maxTilt;

		el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
	};

	const handleMouseLeave = () => {
		const el = ref.current;
		if (!el) return;
		el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
	};

	return { ref, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave };
}

/**
 * Hook to track overall page scroll progress (0 to 100%)
 */
export function useScrollProgress() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
			if (totalHeight <= 0) return;
			const current = (window.scrollY / totalHeight) * 100;
			setProgress(Math.min(100, Math.max(0, current)));
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return progress;
}
