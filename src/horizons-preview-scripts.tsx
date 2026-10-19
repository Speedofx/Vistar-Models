import { useEffect } from 'react';
import { bannerAttrs } from 'virtual:horizons-banner';

/** Vite serves `\0`-resolved virtual ids at `/@id/__x00__<id>` in dev. */
const viteVirtualSrc = (id: string) => `/@id/__x00__${id}`;

// Framework mode hydrates the whole document, so the banner script — which inserts
// its own nodes into <body> — must not run until hydration has committed. Shipping
// it in the server HTML made it mutate <body> first and fail hydration (React #418),
// which also tore the banner down. Appending it from the post-hydration effect keeps
// the server HTML and the hydration render identical.
function appendTemplateBannerScript(attrs: HorizonsBannerAttrs) {
	if (document.querySelector(`script[src="${attrs.src}"]`)) {
		return;
	}

	const script = document.createElement('script');
	Object.entries(attrs).forEach(([name, value]) => {
		if (value) {
			script.setAttribute(name, value);
		}
	});
	document.body.appendChild(script);
}

export function HorizonsPreviewScripts() {
	useEffect(() => {
		// Effects flush only after React commits the hydration render, so this is the
		// earliest reliable "hydration is done" signal. The iframe route-restoration
		// script waits for it before applying builder-requested navigations — changing
		// the URL any earlier makes React hydrate a route that disagrees with the
		// server-rendered HTML and fail with a hydration mismatch.
		(window as Window & { __horizonsHydrated?: boolean }).__horizonsHydrated = true;
		window.dispatchEvent(new Event('horizons:hydrated'));

		if (bannerAttrs) {
			appendTemplateBannerScript(bannerAttrs);
		}

		if (import.meta.env.DEV) {
			const devScripts = [
				viteVirtualSrc('virtual:horizons-runtime'),
				viteVirtualSrc('virtual:horizons-edit-mode'),
				viteVirtualSrc('virtual:horizons-iframe-route-restoration'),
				viteVirtualSrc('virtual:horizons-pocketbase-auth'),
				viteVirtualSrc('virtual:session-journal-client'),
			];
			devScripts.forEach((src) => {
				if (!document.querySelector(`script[src="${src}"]`)) {
					const script = document.createElement('script');
					script.type = 'module';
					script.src = src;
					document.head.appendChild(script);
				}
			});
		} else {
			if ('requestIdleCallback' in window) {
				window.requestIdleCallback(() => void import('virtual:horizons-runtime'));
			} else {
				setTimeout(() => void import('virtual:horizons-runtime'), 2500);
			}
		}
	}, []);

	return null;
}
