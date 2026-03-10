<script lang="ts">
	import { toasts, removeToast } from '$lib/stores/toasts';

	function severityStyles(severity: string) {
		switch (severity) {
			case 'Extreme':
				return { bg: 'bg-red-600', border: 'border-red-700', icon: '🌪️', label: 'EXTREME' };
			case 'Severe':
				return { bg: 'bg-orange-500', border: 'border-orange-600', icon: '⛈️', label: 'SEVERE' };
			case 'Moderate':
				return { bg: 'bg-amber-400', border: 'border-amber-500', icon: '⚠️', label: 'MODERATE' };
			default:
				return { bg: 'bg-blue-500', border: 'border-blue-600', icon: 'ℹ️', label: 'ADVISORY' };
		}
	}
</script>

<div class="pointer-events-none fixed top-20 right-4 z-[9999] flex flex-col gap-2" style="max-width: 360px; width: calc(100vw - 2rem);">
	{#each $toasts as toast (toast.id)}
		{@const styles = severityStyles(toast.severity)}
		<div
			class="pointer-events-auto flex items-start gap-3 rounded-xl border-2 {styles.border} {styles.bg} px-4 py-3 text-white shadow-2xl"
			role="alert"
			aria-live="assertive"
			style="animation: slideIn 0.3s ease-out;"
		>
			<span class="mt-0.5 text-lg leading-none">{styles.icon}</span>
			<div class="min-w-0 flex-1">
				<div class="flex items-center gap-2">
					<span class="rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-bold tracking-widest">
						{styles.label}
					</span>
					<span class="truncate text-sm font-bold">{toast.event}</span>
				</div>
				<p class="mt-1 text-xs leading-snug opacity-90 line-clamp-2">{toast.areaDesc}</p>
			</div>
			<button
				onclick={() => removeToast(toast.id)}
				class="mt-0.5 shrink-0 rounded p-0.5 opacity-70 hover:opacity-100 transition-opacity"
				aria-label="Dismiss"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
	{/each}
</div>

<style>
	@keyframes slideIn {
		from {
			transform: translateX(110%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}
</style>
