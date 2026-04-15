import { env } from '$env/dynamic/public';

export const config = {
	siteEnv: env.PUBLIC_SITE_ENV || 'development',
	siteUrl: __SITE_URL__,
	sheltersJsonUrl: env.PUBLIC_SHELTERS_JSON_URL || '/shelters.json',
	allowIndexing: env.PUBLIC_SITE_ENV === 'production',
};
