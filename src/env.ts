import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_SITE_ENV: {
		public: true,
		static: true,
		schema: (input) => input || 'development',
	},
	PUBLIC_SHELTERS_JSON_URL: {
		public: true,
		static: true,
		schema: (input) => input || '/shelters.json',
	},
	// Sheet settings are optional so local and CI builds can run without a data source.
	GOOGLE_SHEET_ID: { static: true, schema: (input) => input ?? '' },
	GOOGLE_SHEET_GID: { static: true, schema: (input) => input ?? '' },
});
