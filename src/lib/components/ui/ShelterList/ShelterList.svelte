<script lang="ts">
	import { ShelterCard } from '$lib/components/ui/ShelterCard';
	import type { Shelter } from '$lib/shelters/types';
	import { userLocation } from '$lib/stores/global';
	import { calculateDistance } from '$lib/utils';
	import { onMount } from 'svelte';

	let shelters: Array<Shelter & { distance: number }> = [];
	let location: { latitude: number; longitude: number } | null = null;

	userLocation.subscribe((value) => {
		location = value;
		loadAndSortShelters();
	});

	async function loadAndSortShelters() {
		try {
			const response = await fetch('/shelters.json');
			const data: Shelter[] = await response.json();

			if (location) {
				shelters = data
					.map((shelter) => ({
						...shelter,
						distance: calculateDistance(
							location!.latitude,
							location!.longitude,
							shelter.latitude,
							shelter.longitude,
						),
					}))
					.sort((a, b) => a.distance - b.distance);
			} else {
				shelters = data.map((shelter) => ({
					...shelter,
					distance: 0,
				}));
			}
		} catch (error) {
			console.error('Error loading shelters:', error);
		}
	}

	onMount(() => {
		loadAndSortShelters();
	});
</script>

<div class="pb-32" id="shelter_list">
	{#each shelters as shelter (shelter.name)}
		<ShelterCard
			title={shelter.name}
			address={`${shelter.addressLine1}${shelter.addressLine2 ? ', ' + shelter.addressLine2 : ''}, ${shelter.city}, ${shelter.state} ${shelter.zip}`}
			distance={shelter.distance}
		/>
	{/each}
</div>
