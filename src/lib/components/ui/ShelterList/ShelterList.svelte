<script lang="ts">
	import { ShelterCard } from '$lib/components/ui/ShelterCard';
	import { userLocation, shelters, selectedShelter, type Shelter } from '$lib/stores/global';
	import { calculateDistance } from '$lib/utils';
	import { onMount } from 'svelte';

	const DEMO_SHELTERS: Shelter[] = [
		{
			id: 9001,
			name: 'Wilder Elementary School',
			address_line1: '2526 S. Hilsboro St.',
			address_line2: null,
			city: 'Springfield',
			state: 'MO',
			zip: '65807',
			latitude: 37.1820,
			longitude: -93.2950,
			capacity: 200,
			category: 'School',
			shelter_type: 'Post Impact',
			accessibility: 'Yes',
			pet_friendly: 'No',
			has_backup_power: 'No',
			hours_as_shelter: 'Non-school hours',
			special_instructions: null,
			verification_status: 'Open',
			availability_status: 'Full',
		},
		{
			id: 9002,
			name: 'Kingsway United Methodist Church',
			address_line1: '2401 South Lone Pine',
			address_line2: null,
			city: 'Springfield',
			state: 'MO',
			zip: '65804',
			latitude: 37.1865,
			longitude: -93.2612,
			capacity: 150,
			category: 'Church',
			shelter_type: 'Post Impact',
			accessibility: 'Yes',
			pet_friendly: 'No',
			has_backup_power: 'Yes',
			hours_as_shelter: null,
			special_instructions: null,
			verification_status: 'Open',
			availability_status: 'Available',
		},
	];

	let location: { latitude: number; longitude: number } | null = null;

	userLocation.subscribe((value) => {
		location = value;
		loadAndSortShelters();
	});

	async function loadAndSortShelters() {
		try {
			const apiUrl = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:5000';
			const response = await fetch(`${apiUrl}/api/shelters`);
			const json = await response.json();
			const data: Shelter[] = [...json.shelters, ...DEMO_SHELTERS];

			if (location) {
				shelters.set(
					data
						.map((shelter) => ({
							...shelter,
							distance: calculateDistance(
								location!.latitude,
								location!.longitude,
								shelter.latitude,
								shelter.longitude,
							),
						}))
						.sort((a, b) => a.distance - b.distance),
				);
			} else {
				shelters.set(
					data.map((shelter) => ({
						...shelter,
						distance: null,
					})),
				);
			}
		} catch (error) {
			console.error('Error loading shelters:', error);
			// Fall back to demo shelters if API is unavailable
			shelters.set(
				DEMO_SHELTERS.map((shelter) => ({
					...shelter,
					distance: location
						? calculateDistance(location.latitude, location.longitude, shelter.latitude, shelter.longitude)
						: null,
				})),
			);
		}
	}

	onMount(() => {
		loadAndSortShelters();
	});
</script>

<div class="pb-32" id="shelter_list">
	{#each $shelters as shelter (shelter.id)}
		<ShelterCard
			title={shelter.name}
			address={`${shelter.address_line1}${shelter.address_line2 ? ', ' + shelter.address_line2 : ''}, ${shelter.city}, ${shelter.state} ${shelter.zip}`}
			distance={shelter.distance}
			available={shelter.availability_status}
			onclick={() => selectedShelter.set({ lat: shelter.latitude, lng: shelter.longitude })}
		/>
	{/each}
</div>
