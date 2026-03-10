import { writable } from 'svelte/store';

export interface Toast {
	id: string;
	event: string;
	areaDesc: string;
	severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown';
}

export const toasts = writable<Toast[]>([]);

export function addToast(toast: Omit<Toast, 'id'>) {
	const id = crypto.randomUUID();
	toasts.update((all) => [{ ...toast, id }, ...all]);
	setTimeout(() => removeToast(id), 8000);
}

export function removeToast(id: string) {
	toasts.update((all) => all.filter((t) => t.id !== id));
}
