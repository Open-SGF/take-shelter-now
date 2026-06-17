import { config } from '$lib/config';

export function siteUrl(pathname = '/'): string {
	const url = new URL(pathname, config.siteUrl);
	url.search = '';
	url.hash = '';
	return url.toString();
}
