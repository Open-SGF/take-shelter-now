import { loadSheltersAtBuildTime } from '$lib/shelters/source.server';
import { config } from '$lib/config';

export const prerender = true;

type SitemapEntry = {
	path: string;
	lastModified?: string;
};

function xml(strings: TemplateStringsArray, ...values: string[]): string {
	return String.raw({ raw: strings }, ...values)
		.split('\n')
		.map((line) => line.trimEnd())
		.join('\n')
		.trim();
}

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

function toAbsoluteUrl(path: string): string {
	return new URL(path, config.siteUrl).toString();
}

function formatLastModified(value: string): string | undefined {
	const parsed = new Date(value);

	if (Number.isNaN(parsed.getTime())) {
		return undefined;
	}

	return parsed.toISOString();
}

function renderLastMod(lastModified?: string): string {
	if (!lastModified) {
		return '';
	}

	return xml`
		<lastmod>${escapeXml(lastModified)}</lastmod>
	`;
}

function renderUrlEntry(entry: SitemapEntry): string {
	return xml`
		<url>
			<loc>${escapeXml(toAbsoluteUrl(entry.path))}</loc>
			${renderLastMod(entry.lastModified)}
		</url>
	`;
}

function renderSitemap(entries: SitemapEntry[]): string {
	return xml`
		<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			${entries.map(renderUrlEntry).join('\n')}
		</urlset>
	`;
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

	const body = renderSitemap(entries);

	return new Response(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
		},
	});
};
