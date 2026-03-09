<script lang="ts">
	import { ShelterCard } from '$lib/components/ui/ShelterCard';
	import type { Shelter } from '$lib/shelters/types';
	import { shelters, userLocation } from '$lib/stores/global';
	import { calculateDistance } from '$lib/utils';
	import { fromStore } from 'svelte/store';

	const sheltersStore = fromStore(shelters);
	const userLocationStore = fromStore(userLocation);

	let sheltersWithDistance: Array<Shelter & { distance: number }> = $derived.by(() => {
		const currentShelters = sheltersStore.current;
		const currentLocation = userLocationStore.current;

		if (currentLocation === null) {
			return currentShelters.map((shelter) => ({ ...shelter, distance: 0 }));
		}

		return currentShelters
			.map((shelter) => ({
				...shelter,
				distance: calculateDistance(
					currentLocation.latitude,
					currentLocation.longitude,
					shelter.latitude,
					shelter.longitude,
				),
			}))
			.sort((a, b) => a.distance - b.distance);
	});
</script>

<div class="pb-32" id="shelter_list">
	{#each sheltersWithDistance as shelter (shelter.slug)}
		<ShelterCard
			title={shelter.name}
			address={`${shelter.addressLine1}${shelter.addressLine2 ? ', ' + shelter.addressLine2 : ''}, ${shelter.city}, ${shelter.state} ${shelter.zip}`}
			distance={shelter.distance}
			slug={shelter.slug}
		/>
	{/each}
</div>
