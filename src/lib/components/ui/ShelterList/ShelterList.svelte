<script lang="ts">
	import { ShelterCard } from '$lib/components/ui/ShelterCard';
	import { getAppStateContext } from '$lib/state/app-state-context';

	const appState = getAppStateContext();
</script>

<div class="pb-32" id="shelter_list">
	{#each appState.sheltersWithDistance as shelter (shelter.slug)}
		<ShelterCard
			title={shelter.name}
			address={`${shelter.addressLine1}${shelter.addressLine2 ? ', ' + shelter.addressLine2 : ''}, ${shelter.city}, ${shelter.state} ${shelter.zip}`}
			distance={shelter.distance}
			slug={shelter.slug}
		/>
	{/each}
</div>
