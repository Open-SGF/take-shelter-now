<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		weatherAlertsState,
		fetchWeatherAlerts,
		hasActiveAlerts,
		SEVERITY_COLORS,
	} from '$lib/stores/weather';
	import { userLocation } from '$lib/stores/global';

	const DEFAULT_LAT = 37.208957;
	const DEFAULT_LON = -93.292299;
	const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

	let refreshInterval: ReturnType<typeof setInterval>;
	let expandedAlertId: string | null = null;

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

	function toggleAlert(id: string) {
		expandedAlertId = expandedAlertId === id ? null : id;
	}

	function getSeverityColor(severity: string): string {
		return SEVERITY_COLORS[severity] || SEVERITY_COLORS.Unknown;
	}

	function formatExpires(expires: string): string {
		try {
			const date = new Date(expires);
			return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
		} catch {
			return '';
		}
	}
</script>

{#if $weatherAlertsState.loading && $weatherAlertsState.alerts.length === 0}
	<div class="mb-4 flex items-center gap-2 p-2 text-gray-500">
		<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
		<span class="font-[DM_Sans] text-[12px]">Checking for weather alerts...</span>
	</div>
{/if}

{#if $hasActiveAlerts}
	<div class="mb-4 space-y-2">
		{#each $weatherAlertsState.alerts as alert (alert.id)}
			<button
				type="button"
				class="w-full cursor-pointer rounded-2xl p-4 text-left shadow-md transition-all"
				style="background-color: {getSeverityColor(
					alert.severity,
				)}20; border-left: 4px solid {getSeverityColor(alert.severity)};"
				onclick={() => toggleAlert(alert.id)}
			>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<svg
							class="h-5 w-5"
							fill="currentColor"
							style="color: {getSeverityColor(alert.severity)};"
							viewBox="0 0 20 20"
						>
							<path
								fill-rule="evenodd"
								d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
								clip-rule="evenodd"
							/>
						</svg>
						<span
							class="font-[DM_Sans] text-[14px] font-bold"
							style="color: {getSeverityColor(alert.severity)};"
						>
							{alert.event}
						</span>
					</div>
					<span class="text-[12px] text-gray-500"> Expires: {formatExpires(alert.expires)} </span>
				</div>

				{#if expandedAlertId === alert.id}
					<div class="mt-3 border-t border-gray-200 pt-3">
						<p class="font-[DM_Sans] text-[12px] text-gray-700">{alert.headline}</p>
						{#if alert.instruction}
							<p class="mt-2 font-[DM_Sans] text-[12px] font-semibold text-gray-800">
								{alert.instruction}
							</p>
						{/if}
					</div>
				{/if}
			</button>
		{/each}
	</div>
{/if}
