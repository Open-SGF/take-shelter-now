<script lang="ts">
	import { Header } from '$lib/components/ui/Header';
	import { Sheet } from '$lib/components/ui/Sheet';
	import GetLocation from '$lib/components/ui/GetLocation/GetLocation.svelte';
	import ShelterList from '$lib/components/ui/ShelterList/ShelterList.svelte';
	import { hasLocation } from '$lib/stores/global';
</script>

<div class="relative m-0 h-screen overflow-hidden bg-[#e2e0e1]">
	<Header />
	<Sheet>
		{#if !$hasLocation}
			<GetLocation />
		{:else}
			<ShelterList />
		{/if}
	</Sheet>
</div>
