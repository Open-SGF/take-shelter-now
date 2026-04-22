import { describe, expect, test, beforeEach } from 'vitest';
import { PrefixedStorage, storage, session } from '.';

describe('PrefixedStorage', () => {
	let prefixedStorage: PrefixedStorage;

	beforeEach(() => {
		localStorage.clear();
		sessionStorage.clear();
		prefixedStorage = new PrefixedStorage('test-', localStorage);
	});

	test('get returns null for missing key', () => {
		expect(prefixedStorage.get('missing')).toBe(null);
	});

	test('set and get with object', () => {
		prefixedStorage.set('key', { foo: 'bar' });

		expect(prefixedStorage.get('key')).toEqual({ foo: 'bar' });
		expect(localStorage.getItem('test-key')).toBe('{"foo":"bar"}');
	});

	test('set and get with string', () => {
		prefixedStorage.set('key', 'value');

		expect(prefixedStorage.get('key')).toBe('value');
	});

	test('set and get with number', () => {
		prefixedStorage.set('count', 42);

		expect(prefixedStorage.get('count')).toBe(42);
	});

	test('remove deletes key', () => {
		prefixedStorage.set('key', 'value');
		prefixedStorage.remove('key');

		expect(prefixedStorage.get('key')).toBe(null);
	});

	test('clear only removes keys with prefix', () => {
		prefixedStorage.set('a', 1);
		prefixedStorage.set('b', 2);
		localStorage.setItem('other-key', 'value');

		prefixedStorage.clear();

		expect(prefixedStorage.get('a')).toBe(null);
		expect(prefixedStorage.get('b')).toBe(null);
		expect(localStorage.getItem('other-key')).toBe('value');
	});

	test('handles invalid JSON gracefully', () => {
		localStorage.setItem('test-key', 'not valid json');

		expect(prefixedStorage.get('key')).toBe(null);
	});
});

describe('storage (localStorage)', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	test('uses take-shelter- prefix', () => {
		storage.set('test', 'value');
		expect(localStorage.getItem('take-shelter-test')).toBe('"value"');
	});
});

describe('session (sessionStorage)', () => {
	beforeEach(() => {
		sessionStorage.clear();
	});

	test('uses take-shelter- prefix', () => {
		session.set('test', 'value');
		expect(sessionStorage.getItem('take-shelter-test')).toBe('"value"');
	});

	test('set and get with object', () => {
		session.set('key', { foo: 'bar' });
		expect(session.get('key')).toEqual({ foo: 'bar' });
	});

	test('remove deletes key', () => {
		session.set('key', 'value');
		session.remove('key');
		expect(session.get('key')).toBe(null);
	});

	test('clear only removes keys with prefix', () => {
		session.set('a', 1);
		sessionStorage.setItem('other-key', 'value');
		session.clear();
		expect(session.get('a')).toBe(null);
		expect(sessionStorage.getItem('other-key')).toBe('value');
	});
});
