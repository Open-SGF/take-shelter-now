import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		prerender: {
			handleUnseenRoutes: ({ routes }) => {
				const allowedMissingRoutes = new Set(['/shelters/[slug]', '/shelters/[slug]/og.png']);
				const onlyMissingShelterRoutes =
					routes.length > 0 && routes.every((route) => allowedMissingRoutes.has(route));

				if (onlyMissingShelterRoutes) {
					return;
				}

				throw new Error(`Unseen prerender routes: ${routes.join(', ')}`);
			},
		},
	},
};

export default config;
