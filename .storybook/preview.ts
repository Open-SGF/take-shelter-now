import type { Preview } from '@storybook/sveltekit';
import { setupWorker } from 'msw/browser';
import { mswLoader } from 'msw-storybook-addon/csf3';
import isChromatic from 'chromatic/isChromatic';
import '../src/app.css';
import { geocodingHandlers } from './mocks/geocoding';
import { tileHandlers } from './mocks/tile';

const initialHandlers = isChromatic() ? [...geocodingHandlers, ...tileHandlers] : geocodingHandlers;

const preview: Preview = {
	parameters: {
		layout: 'fullscreen',
		msw: {
			handlers: {
				geocoding: geocodingHandlers,
				...(isChromatic() ? { tiles: tileHandlers } : {}),
			},
		},
	},
	loaders: [
		mswLoader(async () => {
			const worker = setupWorker(...initialHandlers);
			await worker.start({
				quiet: true,
				onUnhandledRequest: 'bypass',
				serviceWorker: {
					url: '/mockServiceWorker.js',
				},
			});
			return worker;
		}),
	],
};

export default preview;
