<script lang="ts">
	import { userLocation, type WeatherAlert } from '$lib/stores/global';
	import { addToast } from '$lib/stores/toasts';
	import { onMount, onDestroy } from 'svelte';

	let seenIds = new Set<string>();

	let alerts = $state<WeatherAlert[]>([]);
	let loading = $state(true);
	let error = $state(false);
	let expandedId = $state<string | null>(null);
	let refreshInterval: ReturnType<typeof setInterval>;

	function severityColor(severity: string) {
		switch (severity) {
			case 'Extreme':
				return { bg: 'bg-red-600', text: 'text-white', badge: 'bg-red-700 text-white', border: 'border-red-600' };
			case 'Severe':
				return { bg: 'bg-orange-500', text: 'text-white', badge: 'bg-orange-700 text-white', border: 'border-orange-500' };
			case 'Moderate':
				return { bg: 'bg-amber-400', text: 'text-gray-900', badge: 'bg-amber-600 text-white', border: 'border-amber-400' };
			default:
				return { bg: 'bg-blue-500', text: 'text-white', badge: 'bg-blue-700 text-white', border: 'border-blue-500' };
		}
	}

	async function fetchAlerts() {
		try {
			const loc = $userLocation ?? { latitude: 37.2090, longitude: -93.2923 }; // default: Springfield, MO
			const url = `https://api.weather.gov/alerts/active?point=${loc.latitude.toFixed(4)},${loc.longitude.toFixed(4)}&status=actual`;

			const res = await fetch(url, {
				headers: { Accept: 'application/geo+json' },
			});

			if (!res.ok) throw new Error('Failed to fetch');
			const data = await res.json();
			alerts = (data.features ?? []) as WeatherAlert[];

			// Toast any alerts we haven't seen before
			const isFirstLoad = seenIds.size === 0;
			alerts.forEach((alert) => {
				if (!seenIds.has(alert.id)) {
					seenIds.add(alert.id);
					// Skip toasting on the very first fetch (page load) — only notify on new ones
					if (!isFirstLoad) {
						addToast({
							event: alert.properties.event,
							areaDesc: alert.properties.areaDesc,
							severity: alert.properties.severity,
						});
					}
				}
			});
			// Seed seenIds on first load
			if (isFirstLoad) {
				alerts.forEach((alert) => seenIds.add(alert.id));
			}

			error = false;
		} catch {
			error = true;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		fetchAlerts();
		refreshInterval = setInterval(fetchAlerts, 60 * 1000);
	});

	onDestroy(() => clearInterval(refreshInterval));

	// Refetch when location becomes available
	$effect(() => {
		if ($userLocation) fetchAlerts();
	});

	function formatExpires(iso: string) {
		return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
	}
</script>

{#if loading}
	<div class="mb-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
		<svg class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
		</svg>
		Loading weather alerts…
	</div>
{:else if error}
	<div class="mb-3 rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-500">
		Unable to load weather alerts.
	</div>
{:else if alerts.length === 0}
	<div class="mb-3 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
		<svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
		No active weather alerts for your area.
	</div>
{:else}
	<div class="mb-3 space-y-2">
		<div class="flex items-center gap-2">
			<svg class="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
				<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
			</svg>
			<span class="text-sm font-bold text-gray-800">
				{alerts.length} Active Weather Alert{alerts.length !== 1 ? 's' : ''}
			</span>
			<a
				href="https://warnings.cod.edu/"
				target="_blank"
				rel="noopener noreferrer"
				class="ml-auto text-xs text-[#0892d2] underline hover:text-[#0780bc]"
			>
				Source ↗
			</a>
		</div>

		{#each alerts as alert (alert.id)}
			{@const colors = severityColor(alert.properties.severity)}
			<div class="overflow-hidden rounded-lg border {colors.border} shadow-sm">
				<button
					class="flex w-full items-start gap-2 {colors.bg} {colors.text} px-3 py-2 text-left"
					onclick={() => (expandedId = expandedId === alert.id ? null : alert.id)}
				>
					<span class="mt-0.5 shrink-0">
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
						</svg>
					</span>
					<div class="min-w-0 flex-1">
						<div class="flex items-center gap-2">
							<span class="text-sm font-bold leading-tight">{alert.properties.event}</span>
							<span class="shrink-0 rounded-full {colors.badge} px-2 py-0.5 text-[10px] font-semibold uppercase">
								{alert.properties.severity}
							</span>
						</div>
						<p class="mt-0.5 truncate text-xs opacity-90">{alert.properties.areaDesc}</p>
					</div>
					<svg
						class="mt-0.5 h-4 w-4 shrink-0 transition-transform {expandedId === alert.id ? 'rotate-180' : ''}"
						fill="none" stroke="currentColor" viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</button>

				{#if expandedId === alert.id}
					<div class="bg-white px-3 py-2 text-xs text-gray-700">
						{#if alert.properties.headline}
							<p class="mb-1 font-semibold">{alert.properties.headline}</p>
						{/if}
						<p class="mb-2 whitespace-pre-wrap leading-relaxed">{alert.properties.description.slice(0, 500)}{alert.properties.description.length > 500 ? '…' : ''}</p>
						<p class="text-gray-400">Expires: {formatExpires(alert.properties.expires)}</p>
					</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}