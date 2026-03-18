import { env } from '$env/dynamic/public';

export const config = {
	sheltersJsonUrl: env.PUBLIC_SHELTERS_JSON_URL || '/shelters.json',
};
