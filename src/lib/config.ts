import * as publicEnv from '$env/static/public';

const env = publicEnv as Record<string, string | undefined>;
const siteEnv = env.PUBLIC_SITE_ENV || 'development';

export const config = {
	siteEnv,
	siteUrl: __SITE_URL__,
	sheltersJsonUrl: env.PUBLIC_SHELTERS_JSON_URL || '/shelters.json',
	allowIndexing: siteEnv === 'production',
};
