<script lang="ts">
	import { ShelterCard } from '$lib/components/ui/ShelterCard';
	import { userLocation, shelters, selectedShelter, type Shelter } from '$lib/stores/global';
	import { calculateDistance } from '$lib/utils';
	import { onMount } from 'svelte';

	let location: { latitude: number; longitude: number } | null = null;

	userLocation.subscribe((value) => {
		location = value;
		loadAndSortShelters();
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function mapShelter(raw: any, index: number): Shelter {
		return {
			id: index,
			name: raw['Name'] ?? '',
			address_line1: raw['Address Line 1'] ?? '',
			address_line2: raw['Address Line 2'] || null,
			city: raw['City'] ?? '',
			state: raw['State'] ?? '',
			zip: raw['Zip'] ?? '',
			latitude: parseFloat(raw['Latitude']),
			longitude: parseFloat(raw['Longitude']),
			capacity: raw['Capacity'] && raw['Capacity'] !== '0' ? parseInt(raw['Capacity']) : null,
			category: raw['Category'] || null,
			shelter_type: raw['Shelter Type'] || null,
			accessibility: raw['Accesibility'] || null,
			pet_friendly: raw['Pet Friendly'] || null,
			has_backup_power: raw['Has Backup Power'] || null,
			hours_as_shelter: raw['Hours as a Shelter'] || null,
			special_instructions: raw['Special Instructions'] || null,
			verification_status: raw['Verification Status'] || null,
			availability_status: null,
		};
	}

	async function loadAndSortShelters() {
		try {
			const response = await fetch('/shelters.json');
			const raw = await response.json();

			const data: Shelter[] = raw
				.filter((r: any) => r['Verification Status'] !== 'Permanently Closed')
				.map(mapShelter);

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
				shelters.set(data.map((shelter) => ({ ...shelter, distance: null })));
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
	{#each $shelters as shelter (shelter.id)}
		<ShelterCard
			title={shelter.name}
			address={`${shelter.address_line1}${shelter.address_line2 ? ', ' + shelter.address_line2 : ''}, ${shelter.city}, ${shelter.state} ${shelter.zip}`}
			distance={shelter.distance}
			category={shelter.category}
			shelterType={shelter.shelter_type}
			capacity={shelter.capacity}
			accessibility={shelter.accessibility}
			petFriendly={shelter.pet_friendly}
			hasBackupPower={shelter.has_backup_power}
			hoursAsShelter={shelter.hours_as_shelter}
			onclick={() => selectedShelter.set({ lat: shelter.latitude, lng: shelter.longitude })}
		/>
	{/each}
</div>
