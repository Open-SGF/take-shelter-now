import type { Preview } from '@storybook/sveltekit';
import '../src/app.css';

const preview: Preview = {
	parameters: {
		layout: 'fullscreen',
	},
};

export default preview;
