<script lang="ts">
	import { ShelterListItem } from '$lib/components/shelters';
	import { getShelterStateContext } from '$lib/state/shelter-state.svelte';

	const shelterState = getShelterStateContext();
</script>

<div data-testid="shelter-list">
	{#if shelterState.dataState.kind === 'loading'}
		<div class="space-y-3" data-testid="shelter-list-loading">
			<p class="text-text-tertiary text-sm">Loading nearby shelters...</p>
			{#each Array.from({ length: 3 }, (_, index) => index) as index (index)}
				<div class="border-border bg-surface animate-pulse rounded-xl border p-4">
					<div class="bg-border h-4 w-2/3 rounded"></div>
					<div class="bg-muted mt-3 h-3 w-11/12 rounded"></div>
					<div class="bg-muted mt-2 h-3 w-1/3 rounded"></div>
				</div>
			{/each}
		</div>
	{:else if shelterState.dataState.kind === 'error'}
		<div
			class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-900"
			data-testid="shelter-list-error"
		>
			<p class="text-sm font-semibold">Unable to load shelters.</p>
			<p class="mt-1 text-sm">{shelterState.dataState.message}</p>
		</div>
	{:else if shelterState.dataState.kind === 'empty'}
		<div
			class="border-border bg-surface-muted text-foreground rounded-xl border p-4"
			data-testid="shelter-list-empty"
		>
			<p class="text-sm font-semibold">No shelters available right now.</p>
			<p class="text-text-tertiary mt-1 text-sm">
				Check back soon for updated shelter availability.
			</p>
		</div>
	{:else}
		<div class="space-y-3" data-testid="shelter-list-ready">
			{#each shelterState.sheltersWithDistance as shelter (shelter.slug)}
				<ShelterListItem {shelter} distanceMiles={shelter.distance} />
			{/each}
		</div>
	{/if}
</div>
