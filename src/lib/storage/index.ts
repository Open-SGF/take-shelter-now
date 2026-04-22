type StorageBackend = Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'key' | 'length'>;

const noopBackend: StorageBackend = {
	getItem: () => null,
	setItem: () => {},
	removeItem: () => {},
	key: () => null,
	length: 0,
};

export class PrefixedStorage {
	constructor(
		private readonly prefix: string,
		private readonly backend: StorageBackend,
	) {}

	private getKey(key: string): string {
		return `${this.prefix}${key}`;
	}

	get<T>(key: string): T | null {
		try {
			const saved = this.backend.getItem(this.getKey(key));
			if (saved === null) {
				return null;
			}
			return JSON.parse(saved) as T;
		} catch {
			return null;
		}
	}

	set(key: string, value: unknown): void {
		try {
			this.backend.setItem(this.getKey(key), JSON.stringify(value));
		} catch {
			// storage not available
		}
	}

	remove(key: string): void {
		try {
			this.backend.removeItem(this.getKey(key));
		} catch {
			// storage not available
		}
	}

	clear(): void {
		try {
			const keysToRemove: string[] = [];
			for (let i = 0; i < this.backend.length; i++) {
				const storageKey = this.backend.key(i);
				if (storageKey?.startsWith(this.prefix)) {
					keysToRemove.push(storageKey);
				}
			}
			for (const k of keysToRemove) {
				this.backend.removeItem(k);
			}
		} catch {
			// storage not available
		}
	}
}

export const storage = new PrefixedStorage(
	'take-shelter-',
	typeof window !== 'undefined' ? localStorage : noopBackend,
);

export const session = new PrefixedStorage(
	'take-shelter-',
	typeof window !== 'undefined' ? sessionStorage : noopBackend,
);
