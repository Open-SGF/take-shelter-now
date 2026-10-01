import { describe, expect, test } from 'vitest';
import { variables } from './env';

const validate = (name: keyof typeof variables, input?: string) =>
	variables[name].schema['~standard'].validate(input);

describe('build-time environment variables', () => {
	test('keeps indexing and analytics off unless production is explicit', () => {
		expect(validate('PUBLIC_SITE_ENV')).toEqual({ value: 'development' });
		expect(validate('PUBLIC_SITE_ENV', '')).toEqual({ value: 'development' });
		expect(validate('PUBLIC_SITE_ENV', 'production')).toEqual({ value: 'production' });
	});

	test('defaults shelter requests to the prerendered JSON endpoint', () => {
		expect(validate('PUBLIC_SHELTERS_JSON_URL')).toEqual({ value: '/shelters.json' });
		expect(validate('PUBLIC_SHELTERS_JSON_URL', '')).toEqual({ value: '/shelters.json' });
		expect(validate('PUBLIC_SHELTERS_JSON_URL', 'https://example.com/shelters.json')).toEqual({
			value: 'https://example.com/shelters.json',
		});
	});

	test('allows builds without sheet settings and keeps them private', () => {
		expect(validate('GOOGLE_SHEET_ID')).toEqual({ value: '' });
		expect(validate('GOOGLE_SHEET_GID')).toEqual({ value: '' });
		expect(variables.GOOGLE_SHEET_ID).not.toHaveProperty('public');
		expect(variables.GOOGLE_SHEET_GID).not.toHaveProperty('public');
	});

	test('inlines all declared settings for the static deployment', () => {
		for (const variable of Object.values(variables)) {
			expect(variable.static).toBe(true);
		}
	});
});
