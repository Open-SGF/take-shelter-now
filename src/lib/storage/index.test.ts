import { describe, expect, test, beforeEach } from 'vitest';
import { PrefixedStorage } from '.';

describe('PrefixedStorage', () => {
	let storage: PrefixedStorage;

	beforeEach(() => {
		localStorage.clear();
		storage = new PrefixedStorage('test-');
	});

	test('get returns null for missing key', () => {
		expect(storage.get('missing')).toBe(null);
	});

	test('set and get with object', () => {
		storage.set('key', { foo: 'bar' });

		expect(storage.get('key')).toEqual({ foo: 'bar' });
		expect(localStorage.getItem('test-key')).toBe('{"foo":"bar"}');
	});

	test('set and get with string', () => {
		storage.set('key', 'value');

		expect(storage.get('key')).toBe('value');
	});

	test('set and get with number', () => {
		storage.set('count', 42);

		expect(storage.get('count')).toBe(42);
	});

	test('remove deletes key', () => {
		storage.set('key', 'value');
		storage.remove('key');

		expect(storage.get('key')).toBe(null);
	});

	test('clear only removes keys with prefix', () => {
		storage.set('a', 1);
		storage.set('b', 2);
		localStorage.setItem('other-key', 'value');

		storage.clear();

		expect(storage.get('a')).toBe(null);
		expect(storage.get('b')).toBe(null);
		expect(localStorage.getItem('other-key')).toBe('value');
	});

	test('handles invalid JSON gracefully', () => {
		localStorage.setItem('test-key', 'not valid json');

		expect(storage.get('key')).toBe(null);
	});
});
