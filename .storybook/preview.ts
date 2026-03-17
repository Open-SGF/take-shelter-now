import type { Preview } from '@storybook/sveltekit';
import { initialize, mswLoader } from 'msw-storybook-addon';
import isChromatic from 'chromatic/isChromatic';
import '../src/app.css';
import { geocodingHandlers } from './mocks/geocoding';
import { tileHandlers } from './mocks/tile';

const initialHandlers = isChromatic() ? [...geocodingHandlers, ...tileHandlers] : geocodingHandlers;

initialize(
	{
		onUnhandledRequest: 'bypass',
		serviceWorker: {
			url: '/mockServiceWorker.js',
		},
	},
	initialHandlers,
);

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
	loaders: [mswLoader],
};

export default preview;
