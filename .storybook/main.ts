import type { StorybookConfig } from '@storybook/sveltekit';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
	staticDirs: ['../static', '../.storybook/public'],
	addons: ['@storybook/addon-a11y', '@storybook/addon-vitest', '@storybook/addon-svelte-csf'],
	viteFinal: (config) =>
		mergeConfig(config, {
			resolve: {
				alias: {
					'$app/env/public': fileURLToPath(new URL('./mocks/env-public.ts', import.meta.url)),
				},
			},
		}),
	framework: {
		name: '@storybook/sveltekit',
		options: {},
	},
};

export default config;
