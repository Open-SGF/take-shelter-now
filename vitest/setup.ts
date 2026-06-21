import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Node 26 defines experimental localStorage/sessionStorage on globalThis which
// shadows jsdom's versions. Patch them to point at jsdom's implementations.
const jsdomGlobal = globalThis as { jsdom?: { window: Window & typeof globalThis } };
const jsdomWin = jsdomGlobal.jsdom?.window;
if (jsdomWin?.localStorage) {
	Object.defineProperty(globalThis, 'localStorage', { value: jsdomWin.localStorage });
}
if (jsdomWin?.sessionStorage) {
	Object.defineProperty(globalThis, 'sessionStorage', { value: jsdomWin.sessionStorage });
}

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	enumerable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});
