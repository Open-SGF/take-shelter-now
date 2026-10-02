import { PUBLIC_SITE_ENV, PUBLIC_SHELTERS_JSON_URL } from '$app/env/public';

const siteEnv = PUBLIC_SITE_ENV;

export const config = {
	siteEnv,
	siteUrl: __SITE_URL__,
	sheltersJsonUrl: PUBLIC_SHELTERS_JSON_URL,
	allowIndexing: siteEnv === 'production',
	enableAnalytics: siteEnv === 'production',
};
