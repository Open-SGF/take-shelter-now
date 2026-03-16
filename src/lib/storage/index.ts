export class PrefixedStorage {
	constructor(private readonly prefix: string) {}

	private getKey(key: string): string {
		return `${this.prefix}${key}`;
	}

	get<T>(key: string): T | null {
		if (typeof window === 'undefined') {
			return null;
		}
		try {
			const saved = localStorage.getItem(this.getKey(key));
			if (saved === null) {
				return null;
			}
			return JSON.parse(saved) as T;
		} catch {
			return null;
		}
	}

	set(key: string, value: unknown): void {
		if (typeof window === 'undefined') {
			return;
		}
		try {
			localStorage.setItem(this.getKey(key), JSON.stringify(value));
		} catch {
			// localStorage not available
		}
	}

	remove(key: string): void {
		if (typeof window === 'undefined') {
			return;
		}
		try {
			localStorage.removeItem(this.getKey(key));
		} catch {
			// localStorage not available
		}
	}

	clear(): void {
		if (typeof window === 'undefined') {
			return;
		}
		try {
			const keysToRemove: string[] = [];
			for (let i = 0; i < localStorage.length; i++) {
				const storageKey = localStorage.key(i);
				if (storageKey?.startsWith(this.prefix)) {
					keysToRemove.push(storageKey);
				}
			}
			for (const k of keysToRemove) {
				localStorage.removeItem(k);
			}
		} catch {
			// localStorage not available
		}
	}
}

export const storage = new PrefixedStorage('take-shelter-');
