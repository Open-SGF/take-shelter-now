<script lang="ts">
	import { Header } from '$lib/components/ui/Header';
	import { Sheet } from '$lib/components/ui/Sheet';
	import GetLocation from '$lib/components/ui/GetLocation/GetLocation.svelte';
	import ShelterList from '$lib/components/ui/ShelterList/ShelterList.svelte';
	import { hasLocation } from '$lib/stores/global';
</script>

<div class="container">
	<Header />
	<Sheet>
		{#if !$hasLocation}
			<GetLocation />
		{:else}
			<ShelterList />
		{/if}
	</Sheet>
</div>

<style>
	.container {
		height: 100vh;
		overflow: hidden;
		position: relative;
		background-color: #e2e0e1;
		margin: 0;
	}
	.brand-logo {
		height: 100px;
		width: auto;
	}
</style>
