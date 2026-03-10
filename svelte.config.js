import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		prerender: {
			handleUnseenRoutes: ({ routes }) => {
				const onlyMissingShelterSlug = routes.length === 1 && routes[0] === '/shelters/[slug]';

				if (onlyMissingShelterSlug) {
					return;
				}

				throw new Error(`Unseen prerender routes: ${routes.join(', ')}`);
			},
		},
	},
};

export default config;
