export const config = {
	siteEnv: import.meta.env.PUBLIC_SITE_ENV || 'development',
	sheltersJsonUrl: import.meta.env.PUBLIC_SHELTERS_JSON_URL || '/shelters.json',
	allowIndexing: import.meta.env.PUBLIC_SITE_ENV === 'production',
};
