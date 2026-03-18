import { PUBLIC_SHELTERS_JSON_URL } from '$env/static/public';

export const config = {
	sheltersJsonUrl: PUBLIC_SHELTERS_JSON_URL || '/shelters.json',
};
