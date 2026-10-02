import { config } from '#lib/config.js';
import type { RequestHandler } from './$types';

export const prerender = true;

function buildRobotsTxt(): string {
	if (!config.allowIndexing) {
		return ['User-agent: *', 'Disallow: /'].join('\n');
	}

	return [
		'User-agent: *',
		'Allow: /',
		`Sitemap: ${new URL('/sitemap.xml', config.siteUrl).toString()}`,
	].join('\n');
}

export const GET: RequestHandler = () => {
	return new Response(buildRobotsTxt(), {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
		},
	});
};
