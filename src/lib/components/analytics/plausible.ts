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

export function plausible(eventName: string, options?: Record<string, unknown>) {
	if (typeof window === 'undefined') {
		return;
	}
	const p = (
		window as unknown as {
			plausible?: (eventName: string, options?: Record<string, unknown>) => void;
		}
	).plausible;
	p?.(eventName, options);
}
