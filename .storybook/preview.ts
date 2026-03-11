import type { Preview } from '@storybook/sveltekit';
import isChromatic from 'chromatic/isChromatic';
import '../src/app.css';

const startStorybookMsw = async (): Promise<void> => {
	if (typeof window === 'undefined') return;
	if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

	const { HttpResponse, http } = await import('msw');
	const { setupWorker } = await import('msw/browser');
	const worker = setupWorker();

	await worker.start({
		onUnhandledRequest: 'bypass',
		quiet: true,
		serviceWorker: {
			url: '/mockServiceWorker.js',
		},
	});

	if (isChromatic()) {
		const { createMockTile } = await import('./leaflet-tile-mock');

		worker.use(
			http.get('https://tiles.stadiamaps.com/data/openmaptiles/:z/:x/:y.pbf', ({ params }) => {
				const z = String(params.z ?? '0');
				const x = String(params.x ?? '0');
				const y = String(params.y ?? '0');
				const tile = createMockTile(`TEST ${z}/${x}/${y}`);
				const tileBuffer = tile.buffer.slice(tile.byteOffset, tile.byteOffset + tile.byteLength);

				return HttpResponse.arrayBuffer(tileBuffer, {
					headers: {
						'Content-Type': 'application/vnd.mapbox-vector-tile',
						'Cache-Control': 'public, max-age=3600',
					},
				});
			}),
		);
	}
};

void startStorybookMsw();

const preview: Preview = {
	parameters: {
		layout: 'fullscreen',
	},
};

export default preview;
