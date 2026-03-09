<script lang="ts">
	import { ShelterCard } from '$lib/components/ui/ShelterCard';
	import type { Shelter } from '$lib/shelters/types';
	import { shelters, userLocation } from '$lib/stores/global';
	import { calculateDistance } from '$lib/utils';

	let sheltersWithDistance: Array<Shelter & { distance: number }> = [];

	$: sheltersWithDistance =
		$userLocation === null
			? $shelters.map((shelter) => ({ ...shelter, distance: 0 }))
			: $shelters
					.map((shelter) => ({
						...shelter,
						distance: calculateDistance(
							$userLocation.latitude,
							$userLocation.longitude,
							shelter.latitude,
							shelter.longitude,
						),
					}))
					.sort((a, b) => a.distance - b.distance);
</script>

<div class="pb-32" id="shelter_list">
	{#each sheltersWithDistance as shelter (shelter.slug)}
		<ShelterCard
			title={shelter.name}
			address={`${shelter.addressLine1}${shelter.addressLine2 ? ', ' + shelter.addressLine2 : ''}, ${shelter.city}, ${shelter.state} ${shelter.zip}`}
			distance={shelter.distance}
			href={`/shelters/${shelter.slug}`}
		/>
	{/each}
</div>
