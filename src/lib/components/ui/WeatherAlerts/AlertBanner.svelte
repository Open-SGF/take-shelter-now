<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		weatherAlertsState,
		fetchWeatherAlerts,
		hasActiveAlerts,
		SEVERITY_COLORS,
		alertBannerExpanded,
	} from '$lib/stores/weather';
	import { userLocation } from '$lib/stores/global';

	const DEFAULT_LAT = 37.208957;
	const DEFAULT_LON = -93.292299;
	const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

	let refreshInterval: ReturnType<typeof setInterval>;

	function doFetch() {
		const loc = $userLocation;
		fetchWeatherAlerts(loc?.latitude ?? DEFAULT_LAT, loc?.longitude ?? DEFAULT_LON);
	}

	onMount(() => {
		doFetch();
		refreshInterval = setInterval(doFetch, REFRESH_INTERVAL);
	});

	onDestroy(() => {
		if (refreshInterval) clearInterval(refreshInterval);
	});

	// Re-fetch when user location changes
	$effect(() => {
		if ($userLocation) {
			doFetch();
		}
	});

	function getSeverityColor(severity: string): string {
		return SEVERITY_COLORS[severity] || SEVERITY_COLORS.Unknown;
	}

	// Get the most severe alert to display in the banner
	$effect(() => {
		// Reset expanded when alerts change
		if ($weatherAlertsState.alerts.length === 0) {
			alertBannerExpanded.set(false);
		}
	});

	const primaryAlert = $derived($weatherAlertsState.alerts[0]);
</script>

{#if $hasActiveAlerts && primaryAlert}
	{@const bgColor = getSeverityColor(primaryAlert.severity)}
	<div
		class="alert-banner relative z-[100] w-full"
		style="background-color: {bgColor};"
	>
		<button
			type="button"
			class="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-white"
			onclick={() => alertBannerExpanded.update(v => !v)}
		>
			<div class="flex items-center gap-2">
				<svg class="h-5 w-5 flex-shrink-0 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="font-[DM_Sans] text-sm font-bold">
					{primaryAlert.event}
				</span>
				{#if $weatherAlertsState.alerts.length > 1}
					<span class="rounded-full bg-white/20 px-2 py-0.5 text-xs">
						+{$weatherAlertsState.alerts.length - 1} more
					</span>
				{/if}
			</div>
			<div class="flex items-center gap-2">
				<span class="hidden text-xs opacity-80 sm:inline">Tap for details</span>
				<svg
					class="h-4 w-4 transition-transform {$alertBannerExpanded ? 'rotate-180' : ''}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</button>

		{#if $alertBannerExpanded}
			<div class="border-t border-white/20 bg-black/10 px-4 py-3">
				{#each $weatherAlertsState.alerts as alert (alert.id)}
					<div class="mb-3 last:mb-0">
						<p class="font-[DM_Sans] text-sm font-semibold text-white">{alert.headline}</p>
						{#if alert.instruction}
							<p class="mt-1 font-[DM_Sans] text-xs text-white/90">
								{alert.instruction}
							</p>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.alert-banner {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}
</style>
