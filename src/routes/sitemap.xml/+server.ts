import { SitemapStream, streamToPromise } from 'sitemap';
import { loadSheltersAtBuildTime } from '$lib/shelters/source.server';
import { config } from '$lib/config';

export const prerender = true;

type SitemapEntry = {
	path: string;
	lastModified?: string;
};

function formatLastModified(value: string): string | undefined {
	const parsed = new Date(value);

	if (Number.isNaN(parsed.getTime())) {
		return undefined;
	}

	return parsed.toISOString();
}

async function renderSitemap(entries: SitemapEntry[]): Promise<string> {
	const stream = new SitemapStream({ hostname: config.siteUrl });

	for (const entry of entries) {
		stream.write({
			url: entry.path,
			...(entry.lastModified ? { lastmodISO: entry.lastModified } : {}),
		});
	}

	stream.end();

	return (await streamToPromise(stream)).toString();
}

export const GET = async ({ fetch }: { fetch: typeof globalThis.fetch }) => {
	const shelters = await loadSheltersAtBuildTime(fetch);
	const entries: SitemapEntry[] = [
		{ path: '/' },
		{ path: '/location/' },
		...shelters.map((shelter) => ({
			path: `/shelters/${shelter.slug}/`,
			lastModified: shelter.lastUpdated ? formatLastModified(shelter.lastUpdated) : undefined,
		})),
	];

	const body = await renderSitemap(entries);

	return new Response(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
		},
	});
};
