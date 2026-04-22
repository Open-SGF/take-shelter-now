import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
	staticDirs: ['../static', '../.storybook/public'],
	addons: ['@storybook/addon-a11y', '@storybook/addon-vitest', '@storybook/addon-svelte-csf'],
	framework: {
		name: '@storybook/sveltekit',
		options: {},
	},
};

export default config;
