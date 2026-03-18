import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('$lib/config', () => ({
	config: {
		sheltersJsonUrl: '/shelters.json',
	},
}));

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
