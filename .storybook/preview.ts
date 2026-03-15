import type { Preview } from '@storybook/sveltekit';
import isChromatic from 'chromatic/isChromatic';
import '../src/app.css';
import { geocodingHandlers } from './mocks/geocoding';
import { tileHandlers } from './mocks/tile';

const startStorybookMsw = async (): Promise<void> => {
	if (typeof window === 'undefined') {
		return;
	}
	if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
		return;
	}

	const { setupWorker } = await import('msw/browser');

	const worker = setupWorker(...geocodingHandlers);

	await worker.start({
		onUnhandledRequest: 'bypass',
		quiet: true,
		serviceWorker: {
			url: '/mockServiceWorker.js',
		},
	});

	if (isChromatic()) {
		worker.use(...tileHandlers);
	}
};

void startStorybookMsw();

const preview: Preview = {
	parameters: {
		layout: 'fullscreen',
	},
};

export default preview;
