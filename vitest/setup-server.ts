import { vi } from 'vitest';

const store: Record<string, string> = {};

const localStorageMock = {
	getItem: vi.fn((key: string) => store[key] ?? null),
	setItem: vi.fn((key: string, value: string) => {
		store[key] = value;
	}),
	removeItem: vi.fn((key: string) => {
		delete store[key];
	}),
	clear: vi.fn(() => {
		for (const key of Object.keys(store)) {
			delete store[key];
		}
	}),
};

vi.stubGlobal('localStorage', localStorageMock);
vi.stubGlobal('window', { localStorage: localStorageMock });
