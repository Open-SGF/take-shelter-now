<script lang="ts">
	import GetLocation from '$lib/components/ui/GetLocation/GetLocation.svelte';
	import ShelterList from '$lib/components/ui/ShelterList/ShelterList.svelte';
	import { hasLocation } from '$lib/stores/global';
</script>

<div class="p-4 pt-6">
	{#if !$hasLocation}
		<GetLocation />
	{:else}
		<ShelterList />
	{/if}
</div>
