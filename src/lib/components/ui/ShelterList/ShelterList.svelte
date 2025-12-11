<script lang="ts">
	import { ShelterCard } from '$lib/components/ui/ShelterCard';
	import { userLocation } from '$lib/stores/global';
	import { calculateDistance } from '$lib/utils';
	import { onMount } from 'svelte';

	interface Shelter {
		Name: string;
		'Address Line 1': string;
		'Address Line 2': string;
		City: string;
		State: string;
		Zip: string;
		Latitude: string;
		Longitude: string;
	}

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
							parseFloat(shelter.Latitude),
							parseFloat(shelter.Longitude),
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
	{#each shelters as shelter (shelter.Name)}
		<ShelterCard
			title={shelter.Name}
			address={`${shelter['Address Line 1']}${shelter['Address Line 2'] ? ', ' + shelter['Address Line 2'] : ''}, ${shelter.City}, ${shelter.State} ${shelter.Zip}`}
			distance={shelter.distance}
		/>
	{/each}
</div>
