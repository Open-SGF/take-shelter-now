<script lang="ts">
	import { ShelterCard } from '$lib/components/ui/ShelterCard';
	import type { AppState } from '$lib/state/app-state.svelte';
	import { getAppStateContext } from '$lib/state/app-state-context';

	type ShelterListProps = {
		appState?: AppState;
	};

	let { appState = getAppStateContext() }: ShelterListProps = $props();
</script>

<div class="pb-32" id="shelter_list" data-testid="shelter-list">
	{#if appState.shelterDataState.kind === 'loading'}
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
	{:else if appState.shelterDataState.kind === 'error'}
		<div
			class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-900"
			data-testid="shelter-list-error"
		>
			<p class="text-sm font-semibold">Unable to load shelters.</p>
			<p class="mt-1 text-sm">{appState.shelterDataState.message}</p>
		</div>
	{:else if appState.shelterDataState.kind === 'empty'}
		<div
			class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800"
			data-testid="shelter-list-empty"
		>
			<p class="text-sm font-semibold">No shelters available right now.</p>
			<p class="mt-1 text-sm text-slate-600">Check back soon for updated shelter availability.</p>
		</div>
	{:else}
		<div class="space-y-3" data-testid="shelter-list-ready">
			{#each appState.sheltersWithDistance as shelter (shelter.slug)}
				<ShelterCard
					title={shelter.name}
					address={`${shelter.addressLine1}${shelter.addressLine2 ? ', ' + shelter.addressLine2 : ''}, ${shelter.city}, ${shelter.state} ${shelter.zip}`}
					distance={shelter.distance}
					slug={shelter.slug}
				/>
			{/each}
		</div>
	{/if}
</div>
