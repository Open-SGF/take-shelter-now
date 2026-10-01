<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ShelterFilterPanel, ShelterList } from '#lib/components/shelters/index.js';
	import { getShelterStateContext } from '#lib/state/shelter-state.svelte.js';
	import { searchParamsToFilters, filtersToSearchParams } from '#lib/shelters/filter.js';

	const shelterState = getShelterStateContext();

	let initializedFromUrl = $state(false);

	$effect(() => {
		if (!initializedFromUrl) {
			const urlFilters = searchParamsToFilters(page.url.searchParams);
			shelterState.setFilters(urlFilters);
			initializedFromUrl = true;
		}
	});

	$effect(() => {
		if (!initializedFromUrl) {
			return;
		}

		const currentFilters = shelterState.filters;
		const currentParams = filtersToSearchParams(currentFilters);
		const newSearch = currentParams.toString();
		const existingSearch = page.url.searchParams.toString();

		if (newSearch !== existingSearch) {
			const destination = resolve('/(requires-location)');
			goto(newSearch ? `${destination}?${newSearch}` : destination, {
				replace: true,
				reset: false,
			});
		}
	});
</script>

<div class="p-4 pt-6">
	<div class="mb-4">
		<ShelterFilterPanel />
	</div>
	<ShelterList />
</div>
