<script lang="ts">
	import { Header } from '$lib/components/ui/Header';
	import { Sheet } from '$lib/components/ui/Sheet';
	import GetLocation from '$lib/components/ui/GetLocation/GetLocation.svelte';
	import ShelterList from '$lib/components/ui/ShelterList/ShelterList.svelte';
	import { hasLocation } from '$lib/stores/global';

	import L from 'leaflet';

	import { onMount } from 'svelte';

	let mapElement: HTMLDivElement | undefined;

	onMount(() => {
		const map = L.map(mapElement!, {
			center: [37.208957, -93.292299],
			zoom: 13,
			preferCanvas: true,
		});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 30,
			minZoom: 13,
			referrerPolicy: 'no-referrer',
			detectRetina: true,
			crossOrigin: false,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		}).addTo(map);
	});
</script>

<div class="relative m-0 h-dvh bg-[#e2e0e1]">
	<div class="fixed top-0 z-60"><Header /></div>
	<div
		class="fixed right-0 z-60 w-[400px] overflow-y-auto max-md:bottom-0 max-md:h-1/2 max-md:w-screen md:right-0"
	>
		<Sheet>
			{#if !$hasLocation}
				<GetLocation />
			{:else}
				<ShelterList />
			{/if}
		</Sheet>
	</div>
	<div class="z-1 h-dvh" bind:this={mapElement}></div>
</div>
