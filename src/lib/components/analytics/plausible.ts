interface InitOptions {
	endpoint?: string;
	hashBasedRouting?: boolean;
	autoCapturePageviews?: boolean;
	captureOnLocalhost?: boolean;
}

export function plausibleInitScript(init?: InitOptions): string {
	const args = Object.entries(init ?? {})
		.filter(([, v]) => v !== undefined)
		.map(([k, v]) => `${k}:${JSON.stringify(v)}`)
		.join(',');

	const config = args ? `{${args}}` : '';

	return `<script>window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}},plausible.init(${config})</script>`;
}

interface PlausibleEventOptions {
	props?: Record<string, unknown>;
	callback?: (result: { status?: number } | { error?: unknown }) => void;
}

interface PlausibleFn {
	(eventName: string, options?: PlausibleEventOptions): void;
	init: (config: Record<string, unknown>) => void;
}

function getPlausible(): PlausibleFn | undefined {
	if (typeof window === 'undefined') {
		return;
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (window as any).plausible as PlausibleFn;
}

export function plausible(eventName: string, options?: PlausibleEventOptions): void {
	const p = getPlausible();
	p?.(eventName, options);
}

plausible.init = (config: Record<string, unknown>) => {
	const p = getPlausible();
	p?.init(config);
};
