<script lang="ts">
	import { ShelterCard } from '$lib/components/ui/ShelterCard';
	import { getSheltersStoreContext } from '$lib/stores/shelters-context';
	import { userLocation } from '$lib/stores/location';

	const sheltersStore = getSheltersStoreContext();
	const sheltersWithDistance = sheltersStore.withDistance(userLocation);
</script>

<div class="pb-32" id="shelter_list">
	{#each $sheltersWithDistance as shelter (shelter.slug)}
		<ShelterCard
			title={shelter.name}
			address={`${shelter.addressLine1}${shelter.addressLine2 ? ', ' + shelter.addressLine2 : ''}, ${shelter.city}, ${shelter.state} ${shelter.zip}`}
			distance={shelter.distance}
			slug={shelter.slug}
		/>
	{/each}
</div>
