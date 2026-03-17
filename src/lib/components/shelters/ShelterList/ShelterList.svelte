<script lang="ts">
	import { ShelterListItem } from '$lib/components/shelters';
	import { getShelterStateContext } from '$lib/state/shelter-state.svelte';

	const shelterState = getShelterStateContext();
</script>

<div id="shelter_list" data-testid="shelter-list">
	{#if shelterState.dataState.kind === 'loading'}
		<div class="space-y-3" data-testid="shelter-list-loading">
			<p class="text-sm text-slate-600">Loading nearby shelters...</p>
			{#each Array.from({ length: 3 }, (_, index) => index) as index (index)}
				<div class="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
					<div class="h-4 w-2/3 rounded bg-slate-200"></div>
					<div class="mt-3 h-3 w-11/12 rounded bg-slate-100"></div>
					<div class="mt-2 h-3 w-1/3 rounded bg-slate-100"></div>
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
			class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800"
			data-testid="shelter-list-empty"
		>
			<p class="text-sm font-semibold">No shelters available right now.</p>
			<p class="mt-1 text-sm text-slate-600">Check back soon for updated shelter availability.</p>
		</div>
	{:else}
		<div class="space-y-3" data-testid="shelter-list-ready">
			{#each shelterState.sheltersWithDistance as shelter (shelter.slug)}
				<ShelterListItem {shelter} distanceMiles={shelter.distance} />
			{/each}
		</div>
	{/if}
</div>
